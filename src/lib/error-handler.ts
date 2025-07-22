/**
 * Advanced Error Handling & Recovery System for Web Scraping
 * 
 * This module provides comprehensive error handling, retry mechanisms,
 * and recovery procedures for the BidMaster web scraping system.
 */

import { createClient } from '@/utils/supabase/server'

// Error types for different scraping scenarios
export enum ScrapingErrorType {
  NETWORK_ERROR = 'network_error',
  TIMEOUT_ERROR = 'timeout_error',
  CAPTCHA_DETECTED = 'captcha_detected',
  RATE_LIMITED = 'rate_limited',
  SELECTOR_NOT_FOUND = 'selector_not_found',
  DATA_VALIDATION_ERROR = 'data_validation_error',
  PLATFORM_BLOCKED = 'platform_blocked',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface ScrapingError {
  type: ScrapingErrorType
  message: string
  platform: string
  url?: string
  timestamp: Date
  retryCount: number
  recoverable: boolean
  context?: Record<string, unknown>
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number // milliseconds
  maxDelay: number // milliseconds
  backoffMultiplier: number
  jitter: boolean
}

export interface RecoveryAction {
  type: 'retry' | 'fallback' | 'skip' | 'abort'
  delay?: number
  context?: Record<string, unknown>
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true
}

// Enhanced error handling and recovery class
export class ScrapingErrorHandler {
  private retryConfig: RetryConfig
  private errorLog: ScrapingError[] = []
  private recoveryStrategies: Map<ScrapingErrorType, (error: ScrapingError) => RecoveryAction>

  constructor(retryConfig: Partial<RetryConfig> = {}) {
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
    this.recoveryStrategies = new Map()
    this.setupDefaultRecoveryStrategies()
  }

  /**
   * Set up default recovery strategies for different error types
   */
  private setupDefaultRecoveryStrategies(): void {
    // Network errors - retry with exponential backoff
    this.recoveryStrategies.set(ScrapingErrorType.NETWORK_ERROR, (error) => ({
      type: error.retryCount < this.retryConfig.maxRetries ? 'retry' : 'fallback',
      delay: this.calculateRetryDelay(error.retryCount)
    }))

    // Timeout errors - retry with longer delay
    this.recoveryStrategies.set(ScrapingErrorType.TIMEOUT_ERROR, (error) => ({
      type: error.retryCount < this.retryConfig.maxRetries ? 'retry' : 'skip',
      delay: this.calculateRetryDelay(error.retryCount) * 2
    }))

    // CAPTCHA detected - manual intervention required
    this.recoveryStrategies.set(ScrapingErrorType.CAPTCHA_DETECTED, () => ({
      type: 'abort',
      context: { reason: 'CAPTCHA requires manual intervention' }
    }))

    // Rate limited - wait and retry
    this.recoveryStrategies.set(ScrapingErrorType.RATE_LIMITED, (error) => ({
      type: error.retryCount < this.retryConfig.maxRetries ? 'retry' : 'skip',
      delay: Math.max(this.calculateRetryDelay(error.retryCount), 60000) // At least 1 minute
    }))

    // Selector not found - try fallback selectors
    this.recoveryStrategies.set(ScrapingErrorType.SELECTOR_NOT_FOUND, (error) => ({
      type: error.retryCount < 2 ? 'retry' : 'skip', // Limited retries for selector issues
      delay: this.calculateRetryDelay(error.retryCount),
      context: { useFallbackSelectors: true }
    }))

    // Data validation errors - skip invalid data
    this.recoveryStrategies.set(ScrapingErrorType.DATA_VALIDATION_ERROR, () => ({
      type: 'skip',
      context: { reason: 'Invalid data format detected' }
    }))

    // Platform blocked - abort scraping for this platform
    this.recoveryStrategies.set(ScrapingErrorType.PLATFORM_BLOCKED, () => ({
      type: 'abort',
      context: { reason: 'Platform has blocked our scraping attempts' }
    }))

    // Unknown errors - conservative retry approach
    this.recoveryStrategies.set(ScrapingErrorType.UNKNOWN_ERROR, (error) => ({
      type: error.retryCount < 1 ? 'retry' : 'skip',
      delay: this.calculateRetryDelay(error.retryCount)
    }))
  }

  /**
   * Calculate retry delay with exponential backoff and optional jitter
   */
  private calculateRetryDelay(retryCount: number): number {
    let delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount)
    delay = Math.min(delay, this.retryConfig.maxDelay)
    
    if (this.retryConfig.jitter) {
      // Add random jitter (±25%)
      const jitterRange = delay * 0.25
      delay += (Math.random() - 0.5) * 2 * jitterRange
    }
    
    return Math.max(delay, 0)
  }

  /**
   * Handle a scraping error and determine recovery action
   */
  async handleError(
    errorType: ScrapingErrorType,
    message: string,
    platform: string,
    context: Record<string, unknown> = {}
  ): Promise<RecoveryAction> {
    const error: ScrapingError = {
      type: errorType,
      message,
      platform,
      timestamp: new Date(),
      retryCount: context.retryCount as number || 0,
      recoverable: this.isRecoverable(errorType),
      context
    }

    // Log the error
    await this.logError(error)
    this.errorLog.push(error)

    // Get recovery strategy
    const strategy = this.recoveryStrategies.get(errorType)
    if (!strategy) {
      console.warn(`No recovery strategy found for error type: ${errorType}`)
      return { type: 'skip' }
    }

    const action = strategy(error)
    
    // Log recovery action
    console.log(`Recovery action for ${errorType}: ${action.type}`, {
      platform,
      retryCount: error.retryCount,
      delay: action.delay
    })

    return action
  }

  /**
   * Determine if an error type is recoverable
   */
  private isRecoverable(errorType: ScrapingErrorType): boolean {
    const nonRecoverableErrors = [
      ScrapingErrorType.CAPTCHA_DETECTED,
      ScrapingErrorType.PLATFORM_BLOCKED
    ]
    return !nonRecoverableErrors.includes(errorType)
  }

  /**
   * Log error to database for monitoring and analysis
   */
  private async logError(error: ScrapingError): Promise<void> {
    try {
      const supabase = await createClient()
      
      const { error: dbError } = await supabase.from('scraping_logs').insert({
        error_type: error.type,
        message: error.message,
        platform: error.platform,
        url: error.context?.url as string,
        retry_count: error.retryCount,
        recoverable: error.recoverable,
        context: error.context,
        created_at: error.timestamp.toISOString()
      })

      if (dbError) {
        console.error('Database error while logging scraping error:', dbError)
      }
    } catch (dbError) {
      console.error('Failed to log scraping error to database:', dbError)
      // Don't throw here to avoid cascading failures
    }
  }

  /**
   * Execute a function with automatic retry and error handling
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    platform: string,
    context: Record<string, unknown> = {}
  ): Promise<T | null> {
    let lastError: Error | null = null
    let retryCount = 0

    while (retryCount <= this.retryConfig.maxRetries) {
      try {
        const result = await operation()
        
        // Log successful execution after retries
        if (retryCount > 0) {
          console.log(`Operation succeeded after ${retryCount} retries for platform: ${platform}`)
        }
        
        return result
      } catch (error) {
        lastError = error as Error
        const errorType = this.classifyError(error as Error)
        
        const recoveryAction = await this.handleError(
          errorType,
          lastError.message,
          platform,
          { ...context, retryCount }
        )

        if (recoveryAction.type === 'abort') {
          console.error(`Aborting operation for platform ${platform}:`, recoveryAction.context)
          throw lastError
        }

        if (recoveryAction.type === 'skip') {
          console.warn(`Skipping operation for platform ${platform}:`, recoveryAction.context)
          return null
        }

        if (recoveryAction.type === 'retry' && retryCount < this.retryConfig.maxRetries) {
          retryCount++
          const delay = recoveryAction.delay || this.calculateRetryDelay(retryCount)
          
          console.log(`Retrying operation for ${platform} in ${delay}ms (attempt ${retryCount}/${this.retryConfig.maxRetries})`)
          await this.sleep(delay)
          continue
        }

        // If we've exhausted retries, try fallback
        if (recoveryAction.type === 'fallback') {
          console.log(`Attempting fallback for platform ${platform}`)
          const fallbackResult = await this.executeFallback(platform, context)
          return fallbackResult as T | null
        }

        break
      }
    }

    // All retries exhausted
    console.error(`All retry attempts exhausted for platform ${platform}`)
    throw lastError
  }

  /**
   * Classify error based on error message and type
   */
  private classifyError(error: Error): ScrapingErrorType {
    const message = error.message.toLowerCase()

    if (message.includes('timeout') || message.includes('timed out')) {
      return ScrapingErrorType.TIMEOUT_ERROR
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('econnrefused')) {
      return ScrapingErrorType.NETWORK_ERROR
    }
    
    if (message.includes('captcha') || message.includes('verification')) {
      return ScrapingErrorType.CAPTCHA_DETECTED
    }
    
    if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429')) {
      return ScrapingErrorType.RATE_LIMITED
    }
    
    if (message.includes('selector') || message.includes('element not found')) {
      return ScrapingErrorType.SELECTOR_NOT_FOUND
    }
    
    if (message.includes('blocked') || message.includes('forbidden') || message.includes('403')) {
      return ScrapingErrorType.PLATFORM_BLOCKED
    }
    
    if (message.includes('validation') || message.includes('invalid data')) {
      return ScrapingErrorType.DATA_VALIDATION_ERROR
    }

    return ScrapingErrorType.UNKNOWN_ERROR
  }

  /**
   * Execute fallback data source (mock data or cached data)
   */
  private async executeFallback(platform: string, context: Record<string, unknown>): Promise<unknown> {
    console.log(`Executing fallback for platform: ${platform}`)
    
    try {
      // Try to get cached data first
      const cachedData = await this.getCachedData(platform, context)
      if (cachedData) {
        return cachedData
      }

      // Fall back to mock data
      return await this.generateFallbackData(platform, context)
    } catch (fallbackError) {
      console.error(`Fallback failed for platform ${platform}:`, fallbackError)
      return null
    }
  }

  /**
   * Get cached data from database
   */
  private async getCachedData(platform: string, context: Record<string, unknown>): Promise<unknown> {
    try {
      const supabase = await createClient()
      const searchTerm = context.searchTerm as string
      
      if (!searchTerm) return null

      // Get recent cached results (within last 24 hours)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('platform', platform)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(5)

      if (error) throw error
      
      return data?.length ? data : null
    } catch (error) {
      console.error(`Failed to get cached data for ${platform}:`, error)
      return null
    }
  }

  /**
   * Generate fallback mock data
   */
  private async generateFallbackData(platform: string, context: Record<string, unknown>): Promise<unknown[]> {
    const searchTerm = context.searchTerm as string || 'development'
    const maxResults = context.maxResults as number || 3

    console.log(`Generating fallback mock data for ${platform} with search term: ${searchTerm}`)

    const mockProjects = []
    for (let i = 0; i < maxResults; i++) {
      mockProjects.push({
        title: `[FALLBACK] ${searchTerm} Project ${i + 1}`,
        description: `Fallback project description for ${searchTerm} on ${platform}. This is mock data due to scraping issues.`,
        budget: Math.floor(Math.random() * 5000) + 500,
        budgetType: Math.random() > 0.5 ? 'fixed' : 'hourly',
        technologies: [searchTerm, 'JavaScript', 'React'],
        category: 'Web Development',
        location: 'Remote',
        postedDate: new Date().toISOString(),
        sourceUrl: `https://${platform.toLowerCase()}.com/fallback-${i + 1}`,
        platform,
        isFallback: true
      })
    }

    return mockProjects
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get error statistics for monitoring
   */
  getErrorStats(): {
    totalErrors: number
    errorsByType: Record<ScrapingErrorType, number>
    recoverableErrors: number
    recentErrors: ScrapingError[]
  } {
    const errorsByType = this.errorLog.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1
      return acc
    }, {} as Record<ScrapingErrorType, number>)

    const recentErrors = this.errorLog
      .filter(error => Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000)
      .slice(-10)

    return {
      totalErrors: this.errorLog.length,
      errorsByType,
      recoverableErrors: this.errorLog.filter(e => e.recoverable).length,
      recentErrors
    }
  }

  /**
   * Health check for scraping system
   */
  async performHealthCheck(platforms: string[]): Promise<{
    platform: string
    status: 'healthy' | 'degraded' | 'unhealthy'
    errorRate: number
    lastError?: ScrapingError
  }[]> {
    const results = []

    for (const platform of platforms) {
      const platformErrors = this.errorLog
        .filter(e => e.platform === platform && Date.now() - e.timestamp.getTime() < 60 * 60 * 1000) // Last hour

      const totalOperations = Math.max(platformErrors.length + 5, 10) // Assume some successful operations
      const errorRate = platformErrors.length / totalOperations

      let status: 'healthy' | 'degraded' | 'unhealthy'
      if (errorRate < 0.1) status = 'healthy'
      else if (errorRate < 0.5) status = 'degraded'
      else status = 'unhealthy'

      results.push({
        platform,
        status,
        errorRate,
        lastError: platformErrors[platformErrors.length - 1]
      })
    }

    return results
  }
}

// Singleton instance for global use
export const globalErrorHandler = new ScrapingErrorHandler()

// Utility function for common retry scenarios
export async function withRetry<T>(
  operation: () => Promise<T>,
  platform: string,
  context: Record<string, unknown> = {}
): Promise<T | null> {
  return globalErrorHandler.executeWithRetry(operation, platform, context)
}
