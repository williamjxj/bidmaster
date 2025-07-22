/**
 * Crawler Error Handling & Recovery System
 * 
 * Provides comprehensive error handling, retry mechanisms, and recovery
 * procedures for the BidMaster web scraping system.
 */

import { createClient } from '@/utils/supabase/client'

// Error types and severity levels
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  CAPTCHA_ERROR = 'CAPTCHA_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ScrapingError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  platform: string
  searchTerm?: string
  timestamp: Date
  stackTrace?: string
  context: Record<string, unknown>
  retryCount: number
  resolved: boolean
}

export interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  exponentialBase: number
  jitter: boolean
}

export interface HealthCheckResult {
  platform: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  lastCheck: Date
  errorRate: number
  consecutiveFailures: number
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  exponentialBase: 2,
  jitter: true
}

// Rate limiting configuration per platform
const RATE_LIMITS = {
  upwork: { requestsPerMinute: 10, burstLimit: 3 },
  freelancer: { requestsPerMinute: 15, burstLimit: 5 },
  indeed: { requestsPerMinute: 20, burstLimit: 8 },
  linkedin: { requestsPerMinute: 5, burstLimit: 2 }
}

export class CrawlerErrorHandler {
  private supabase = createClient()
  private healthStatus = new Map<string, HealthCheckResult>()
  private rateLimiters = new Map<string, { tokens: number; lastRefill: number }>()

  constructor() {
    this.initializeRateLimiters()
    this.startHealthMonitoring()
  }

  /**
   * Initialize rate limiters for all platforms
   */
  private initializeRateLimiters(): void {
    Object.keys(RATE_LIMITS).forEach(platform => {
      this.rateLimiters.set(platform, {
        tokens: RATE_LIMITS[platform as keyof typeof RATE_LIMITS].burstLimit,
        lastRefill: Date.now()
      })
    })
  }

  /**
   * Start continuous health monitoring
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthChecks()
    }, 60000) // Check every minute
  }

  /**
   * Log error to database and console
   */
  async logError(error: Partial<ScrapingError>): Promise<string> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullError: ScrapingError = {
      id: errorId,
      type: error.type || ErrorType.UNKNOWN_ERROR,
      severity: error.severity || ErrorSeverity.MEDIUM,
      message: error.message || 'Unknown error occurred',
      platform: error.platform || 'unknown',
      searchTerm: error.searchTerm,
      timestamp: new Date(),
      stackTrace: error.stackTrace,
      context: error.context || {},
      retryCount: error.retryCount || 0,
      resolved: false
    }

    try {
      // Save to database
      await this.supabase
        .from('scraping_logs')
        .insert({
          error_id: fullError.id,
          error_type: fullError.type,
          severity: fullError.severity,
          message: fullError.message,
          platform: fullError.platform,
          search_term: fullError.searchTerm,
          stack_trace: fullError.stackTrace,
          context: fullError.context,
          retry_count: fullError.retryCount,
          resolved: fullError.resolved,
          created_at: fullError.timestamp.toISOString()
        })

      // Console logging with colors
      const timestamp = fullError.timestamp.toISOString()
      const severityColor = this.getSeverityColor(fullError.severity)
      
      console.error(
        `${severityColor}[${timestamp}] ${fullError.severity}: ${fullError.type}`,
        `\nPlatform: ${fullError.platform}`,
        `\nMessage: ${fullError.message}`,
        fullError.searchTerm ? `\nSearch Term: ${fullError.searchTerm}` : '',
        `\nRetry Count: ${fullError.retryCount}`,
        fullError.stackTrace ? `\nStack: ${fullError.stackTrace}` : '',
        '\x1b[0m' // Reset color
      )

    } catch (dbError) {
      console.error('Failed to log error to database:', dbError)
    }

    return errorId
  }

  /**
   * Execute function with retry logic and error handling
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    platform: string,
    config: Partial<RetryConfig> = {},
    context: Record<string, unknown> = {}
  ): Promise<T> {
    const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        // Check rate limiting before each attempt
        await this.checkRateLimit(platform)
        
        // Execute the operation
        const result = await operation()
        
        // If successful, mark platform as healthy
        this.updateHealthStatus(platform, true, Date.now())
        
        return result
        
      } catch (error) {
        lastError = error as Error
        const errorType = this.classifyError(error as Error)
        const severity = this.determineSeverity(errorType, attempt)
        
        // Log the error
        await this.logError({
          type: errorType,
          severity,
          message: lastError.message,
          platform,
          stackTrace: lastError.stack,
          context: { ...context, attempt, maxRetries: retryConfig.maxRetries },
          retryCount: attempt
        })

        // Update health status
        this.updateHealthStatus(platform, false, Date.now())
        
        // Don't retry for certain error types
        if (this.shouldNotRetry(errorType)) {
          break
        }
        
        // Don't delay on final attempt
        if (attempt < retryConfig.maxRetries) {
          const delay = this.calculateDelay(attempt, retryConfig)
          console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${retryConfig.maxRetries})`)
          await this.sleep(delay)
        }
      }
    }
    
    // All retries exhausted
    throw new Error(`Operation failed after ${retryConfig.maxRetries} retries. Last error: ${lastError?.message}`)
  }

  /**
   * Check if operation should respect rate limits
   */
  private async checkRateLimit(platform: string): Promise<void> {
    const limits = RATE_LIMITS[platform as keyof typeof RATE_LIMITS]
    if (!limits) return

    const limiter = this.rateLimiters.get(platform)
    if (!limiter) return

    const now = Date.now()
    const timeSinceLastRefill = now - limiter.lastRefill
    
    // Refill tokens based on time passed
    if (timeSinceLastRefill >= 60000) { // 1 minute
      limiter.tokens = Math.min(limits.burstLimit, limiter.tokens + limits.requestsPerMinute)
      limiter.lastRefill = now
    }
    
    // Check if we have tokens available
    if (limiter.tokens <= 0) {
      const waitTime = 60000 - timeSinceLastRefill
      console.log(`Rate limit reached for ${platform}. Waiting ${waitTime}ms...`)
      await this.sleep(waitTime)
      limiter.tokens = limits.requestsPerMinute
      limiter.lastRefill = Date.now()
    }
    
    // Consume a token
    limiter.tokens--
  }

  /**
   * Classify error type based on error message and properties
   */
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return ErrorType.TIMEOUT_ERROR
    }
    if (message.includes('network') || message.includes('connection') || message.includes('econnreset')) {
      return ErrorType.NETWORK_ERROR
    }
    if (message.includes('captcha') || message.includes('challenge')) {
      return ErrorType.CAPTCHA_ERROR
    }
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return ErrorType.RATE_LIMIT_ERROR
    }
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
      return ErrorType.AUTHENTICATION_ERROR
    }
    if (message.includes('parse') || message.includes('selector') || message.includes('element not found')) {
      return ErrorType.PARSING_ERROR
    }
    
    return ErrorType.UNKNOWN_ERROR
  }

  /**
   * Determine error severity based on type and attempt number
   */
  private determineSeverity(errorType: ErrorType, attempt: number): ErrorSeverity {
    if (errorType === ErrorType.CAPTCHA_ERROR || errorType === ErrorType.AUTHENTICATION_ERROR) {
      return ErrorSeverity.CRITICAL
    }
    if (errorType === ErrorType.RATE_LIMIT_ERROR) {
      return ErrorSeverity.HIGH
    }
    if (attempt >= 2) {
      return ErrorSeverity.HIGH
    }
    if (errorType === ErrorType.NETWORK_ERROR || errorType === ErrorType.TIMEOUT_ERROR) {
      return ErrorSeverity.MEDIUM
    }
    
    return ErrorSeverity.LOW
  }

  /**
   * Check if error type should not be retried
   */
  private shouldNotRetry(errorType: ErrorType): boolean {
    return [
      ErrorType.AUTHENTICATION_ERROR,
      ErrorType.CAPTCHA_ERROR
    ].includes(errorType)
  }

  /**
   * Calculate delay for exponential backoff with jitter
   */
  private calculateDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = config.baseDelay * Math.pow(config.exponentialBase, attempt)
    const cappedDelay = Math.min(exponentialDelay, config.maxDelay)
    
    if (config.jitter) {
      // Add ±25% jitter
      const jitterRange = cappedDelay * 0.25
      const jitter = (Math.random() - 0.5) * 2 * jitterRange
      return Math.max(0, cappedDelay + jitter)
    }
    
    return cappedDelay
  }

  /**
   * Update platform health status
   */
  private updateHealthStatus(platform: string, success: boolean, responseTime: number): void {
    const current = this.healthStatus.get(platform) || {
      platform,
      status: 'healthy' as const,
      responseTime: 0,
      lastCheck: new Date(),
      errorRate: 0,
      consecutiveFailures: 0
    }

    current.lastCheck = new Date()
    current.responseTime = responseTime

    if (success) {
      current.consecutiveFailures = 0
      current.status = 'healthy'
    } else {
      current.consecutiveFailures++
      current.errorRate = Math.min(1, current.errorRate + 0.1)
      
      if (current.consecutiveFailures >= 5) {
        current.status = 'unhealthy'
      } else if (current.consecutiveFailures >= 3) {
        current.status = 'degraded'
      }
    }

    this.healthStatus.set(platform, current)
  }

  /**
   * Perform health checks on all platforms
   */
  private async performHealthChecks(): Promise<void> {
    const platforms = Object.keys(RATE_LIMITS)
    
    for (const platform of platforms) {
      try {
        const startTime = Date.now()
        
        // Simple health check - could be enhanced with actual platform pings
        await this.sleep(Math.random() * 100) // Simulate check
        
        const responseTime = Date.now() - startTime
        this.updateHealthStatus(platform, true, responseTime)
        
      } catch {
        await this.logError({
          type: ErrorType.NETWORK_ERROR,
          severity: ErrorSeverity.MEDIUM,
          message: `Health check failed for ${platform}`,
          platform,
          context: { healthCheck: true }
        })
        
        this.updateHealthStatus(platform, false, 0)
      }
    }
  }

  /**
   * Get current health status for all platforms
   */
  getHealthStatus(): Map<string, HealthCheckResult> {
    return new Map(this.healthStatus)
  }

  /**
   * Get health status for specific platform
   */
  getPlatformHealth(platform: string): HealthCheckResult | null {
    return this.healthStatus.get(platform) || null
  }

  /**
   * Attempt automated recovery for a platform
   */
  async attemptRecovery(platform: string): Promise<boolean> {
    console.log(`Attempting automated recovery for ${platform}...`)
    
    try {
      // Reset rate limiter
      const limits = RATE_LIMITS[platform as keyof typeof RATE_LIMITS]
      if (limits) {
        this.rateLimiters.set(platform, {
          tokens: limits.burstLimit,
          lastRefill: Date.now()
        })
      }
      
      // Wait before retry
      await this.sleep(5000)
      
      // Reset health status
      this.healthStatus.delete(platform)
      
      console.log(`Recovery completed for ${platform}`)
      return true
      
    } catch (error) {
      await this.logError({
        type: ErrorType.UNKNOWN_ERROR,
        severity: ErrorSeverity.HIGH,
        message: `Recovery failed for ${platform}: ${(error as Error).message}`,
        platform,
        context: { recovery: true }
      })
      
      return false
    }
  }

  /**
   * Get error statistics
   */
  async getErrorStatistics(timeRange: number = 24 * 60 * 60 * 1000): Promise<{
    totalErrors: number
    errorsByType: Record<ErrorType, number>
    errorsByPlatform: Record<string, number>
    errorsBySeverity: Record<ErrorSeverity, number>
  }> {
    const since = new Date(Date.now() - timeRange).toISOString()
    
    try {
      const { data: errors } = await this.supabase
        .from('scraping_logs')
        .select('error_type, platform, severity')
        .gte('created_at', since)
      
      const stats = {
        totalErrors: errors?.length || 0,
        errorsByType: {} as Record<ErrorType, number>,
        errorsByPlatform: {} as Record<string, number>,
        errorsBySeverity: {} as Record<ErrorSeverity, number>
      }
      
      errors?.forEach(error => {
        stats.errorsByType[error.error_type as ErrorType] = 
          (stats.errorsByType[error.error_type as ErrorType] || 0) + 1
        stats.errorsByPlatform[error.platform] = 
          (stats.errorsByPlatform[error.platform] || 0) + 1
        stats.errorsBySeverity[error.severity as ErrorSeverity] = 
          (stats.errorsBySeverity[error.severity as ErrorSeverity] || 0) + 1
      })
      
      return stats
      
    } catch (error) {
      console.error('Failed to get error statistics:', error)
      return {
        totalErrors: 0,
        errorsByType: {} as Record<ErrorType, number>,
        errorsByPlatform: {} as Record<string, number>,
        errorsBySeverity: {} as Record<ErrorSeverity, number>
      }
    }
  }

  /**
   * Utility functions
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.LOW: return '\x1b[32m' // Green
      case ErrorSeverity.MEDIUM: return '\x1b[33m' // Yellow
      case ErrorSeverity.HIGH: return '\x1b[31m' // Red
      case ErrorSeverity.CRITICAL: return '\x1b[35m' // Magenta
      default: return '\x1b[37m' // White
    }
  }
}

// Singleton instance
export const errorHandler = new CrawlerErrorHandler()

// Fallback data sources
export const FALLBACK_DATA = {
  upwork: [
    {
      title: 'React Developer Needed',
      description: 'Looking for an experienced React developer for a medium-term project.',
      budget: '$5000',
      budgetType: 'fixed',
      technologies: ['React', 'TypeScript', 'Node.js'],
      category: 'Web Development',
      location: 'Remote',
      postedDate: new Date(),
      sourceUrl: 'https://upwork.com/fallback/1',
      platform: 'upwork'
    }
  ],
  freelancer: [
    {
      title: 'Full Stack Development',
      description: 'Need a full stack developer for e-commerce platform.',
      budget: '$3000',
      budgetType: 'fixed',
      technologies: ['Vue.js', 'Python', 'PostgreSQL'],
      category: 'Web Development',
      location: 'Remote',
      postedDate: new Date(),
      sourceUrl: 'https://freelancer.com/fallback/1',
      platform: 'freelancer'
    }
  ]
}

export default CrawlerErrorHandler
