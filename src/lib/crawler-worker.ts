/**
 * Crawler Worker Implementation
 * Handles distributed job processing with auto-scaling capabilities
 * Integrates with queue system for coordinated crawling operations
 */

import { crawlerQueue, CrawlerJob, WorkerConfig } from './crawler-queue'
import { CrawlerErrorHandler } from './crawler-error-handler'
import { MultiPlatformOptimizer } from './multi-platform-optimizer'
import { supabase } from './supabase'

export interface WorkerMetrics {
  jobsProcessed: number
  jobsSucceeded: number
  jobsFailed: number
  averageJobTime: number
  uptime: number
  memoryUsage: number
  cpuUsage: number
  lastJobAt?: Date
}

export interface ScalingConfig {
  minWorkers: number
  maxWorkers: number
  targetJobsPerWorker: number
  scaleUpThreshold: number
  scaleDownThreshold: number
  cooldownPeriod: number
}

class CrawlerWorker {
  private config: WorkerConfig
  private isRunning: boolean = false
  private currentJobs: Set<string> = new Set()
  private metrics: WorkerMetrics
  private errorHandler: CrawlerErrorHandler
  private optimizer: MultiPlatformOptimizer
  private healthCheckInterval: NodeJS.Timeout | null = null
  private jobProcessingPromises: Map<string, Promise<void>> = new Map()

  constructor(config: WorkerConfig) {
    this.config = config
    this.errorHandler = new CrawlerErrorHandler()
    this.optimizer = new MultiPlatformOptimizer()
    
    this.metrics = {
      jobsProcessed: 0,
      jobsSucceeded: 0,
      jobsFailed: 0,
      averageJobTime: 0,
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0
    }
  }

  /**
   * Start the worker
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error(`Worker ${this.config.id} is already running`)
    }

    console.log(`[Worker ${this.config.id}] Starting worker`)
    
    // Register with queue
    await crawlerQueue.registerWorker(this.config)
    
    this.isRunning = true
    this.metrics.uptime = Date.now()

    // Start job processing loop
    this.startJobProcessingLoop()
    
    // Start health monitoring
    this.startHealthMonitoring()

    console.log(`[Worker ${this.config.id}] Worker started successfully`)
  }

  /**
   * Stop the worker
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return
    }

    console.log(`[Worker ${this.config.id}] Stopping worker`)
    
    this.isRunning = false

    // Wait for current jobs to complete
    await this.waitForJobsToComplete()

    // Stop health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    // Unregister from queue
    await crawlerQueue.unregisterWorker(this.config.id)

    console.log(`[Worker ${this.config.id}] Worker stopped`)
  }

  /**
   * Get worker metrics
   */
  getMetrics(): WorkerMetrics {
    return {
      ...this.metrics,
      uptime: this.isRunning ? Date.now() - this.metrics.uptime : 0,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage()
    }
  }

  /**
   * Get worker status
   */
  getStatus(): {
    id: string
    isRunning: boolean
    currentJobs: number
    config: WorkerConfig
    metrics: WorkerMetrics
  } {
    return {
      id: this.config.id,
      isRunning: this.isRunning,
      currentJobs: this.currentJobs.size,
      config: this.config,
      metrics: this.getMetrics()
    }
  }

  // Private methods

  private startJobProcessingLoop(): void {
    const processJobs = async () => {
      while (this.isRunning) {
        try {
          // Check if we can handle more jobs
          if (this.currentJobs.size >= this.config.maxConcurrentJobs) {
            await this.sleep(1000) // Wait 1 second
            continue
          }

          // Get next job from queue
          const job = await crawlerQueue.getNextJob(this.config.id)
          if (!job) {
            await this.sleep(2000) // Wait 2 seconds when no jobs
            continue
          }

          // Process job asynchronously
          const jobPromise = this.processJob(job)
          this.jobProcessingPromises.set(job.id, jobPromise)

          // Clean up completed job promises
          jobPromise.finally(() => {
            this.jobProcessingPromises.delete(job.id)
          })

        } catch (error) {
          console.error(`[Worker ${this.config.id}] Error in job processing loop:`, error)
          await this.sleep(5000) // Wait 5 seconds on error
        }
      }
    }

    processJobs()
  }

  private async processJob(job: CrawlerJob): Promise<void> {
    const startTime = Date.now()
    this.currentJobs.add(job.id)

    try {
      console.log(`[Worker ${this.config.id}] Processing job ${job.id} (${job.type})`)

      let result: unknown

      switch (job.type) {
        case 'scrape':
          result = await this.processScrapeJob(job)
          break
        case 'health_check':
          result = await this.processHealthCheckJob(job)
          break
        case 'recovery':
          result = await this.processRecoveryJob(job)
          break
        case 'cleanup':
          result = await this.processCleanupJob(job)
          break
        default:
          throw new Error(`Unknown job type: ${job.type}`)
      }

      // Mark job as completed
      await crawlerQueue.completeJob(job.id, result)

      // Update metrics
      this.metrics.jobsProcessed++
      this.metrics.jobsSucceeded++
      this.metrics.lastJobAt = new Date()

      const jobTime = Date.now() - startTime
      this.updateAverageJobTime(jobTime)

      console.log(`[Worker ${this.config.id}] Completed job ${job.id} in ${jobTime}ms`)

    } catch (error) {
      console.error(`[Worker ${this.config.id}] Failed to process job ${job.id}:`, error)

      // Mark job as failed
      await crawlerQueue.failJob(job.id, error instanceof Error ? error.message : String(error))

      // Update metrics
      this.metrics.jobsProcessed++
      this.metrics.jobsFailed++

    } finally {
      this.currentJobs.delete(job.id)
    }
  }

  private async processScrapeJob(job: CrawlerJob): Promise<unknown> {
    const { platform, searchTerm, maxResults = 20 } = job.metadata as {
      platform: string
      searchTerm: string
      maxResults?: number
    }

    if (!platform || !searchTerm) {
      throw new Error('Missing required parameters: platform and searchTerm')
    }

    // Use multi-platform optimizer for scraping
    return await this.optimizer.scrapeAllPlatforms(
      searchTerm,
      maxResults,
      [platform]
    )
  }

  private async processHealthCheckJob(job: CrawlerJob): Promise<unknown> {
    const { platform } = job.metadata as { platform?: string }

    if (platform) {
      // Platform-specific health check
      return await this.errorHandler.getPlatformHealth(platform)
    } else {
      // General health check
      const platforms = ['upwork', 'freelancer', 'indeed', 'linkedin']
      const results = await Promise.allSettled(
        platforms.map(p => this.errorHandler.getPlatformHealth(p))
      )

      return {
        overall: 'healthy',
        platforms: Object.fromEntries(
          platforms.map((platform, index) => [
            platform,
            results[index].status === 'fulfilled' ? results[index].value : { status: 'error' }
          ])
        )
      }
    }
  }

  private async processRecoveryJob(job: CrawlerJob): Promise<unknown> {
    const { platform, action } = job.metadata as {
      platform: string
      action: 'reset_rate_limit' | 'clear_errors' | 'restart_scraping'
    }

    switch (action) {
      case 'reset_rate_limit':
        // Reset rate limiting by clearing rate limit data
        await supabase
          .from('scraping_errors')
          .delete()
          .eq('platform', platform)
          .eq('error_type', 'rate_limit')
        return { action: 'reset_rate_limit', platform, status: 'completed' }

      case 'clear_errors':
        // Clear error history for platform
        await supabase
          .from('scraping_errors')
          .delete()
          .eq('platform', platform)
        return { action: 'clear_errors', platform, status: 'completed' }

      case 'restart_scraping':
        // Attempt recovery for the platform
        const recovered = await this.errorHandler.attemptRecovery(platform)
        return { action: 'restart_scraping', platform, status: recovered ? 'completed' : 'failed' }

      default:
        throw new Error(`Unknown recovery action: ${action}`)
    }
  }

  private async processCleanupJob(job: CrawlerJob): Promise<unknown> {
    const { type, olderThanHours = 24 } = job.metadata as {
      type: 'queue' | 'errors' | 'logs'
      olderThanHours?: number
    }

    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000)

    switch (type) {
      case 'queue':
        const cleaned = await crawlerQueue.cleanup(olderThanHours)
        return { type: 'queue', cleaned, olderThanHours }

      case 'errors':
        const { data } = await supabase
          .from('scraping_errors')
          .delete()
          .lt('created_at', cutoff.toISOString())
          .select('count')
        return { type: 'errors', cleaned: data?.length || 0, olderThanHours }

      case 'logs':
        const { data: logData } = await supabase
          .from('scraping_logs')
          .delete()
          .lt('created_at', cutoff.toISOString())
          .select('count')
        return { type: 'logs', cleaned: logData?.length || 0, olderThanHours }

      default:
        throw new Error(`Unknown cleanup type: ${type}`)
    }
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        // Report health to queue (updates last activity)
        await crawlerQueue.getNextJob(this.config.id)

        // Log worker status
        const metrics = this.getMetrics()
        console.log(`[Worker ${this.config.id}] Health check - Jobs: ${this.currentJobs.size}/${this.config.maxConcurrentJobs}, Memory: ${metrics.memoryUsage}MB`)

      } catch (error) {
        console.error(`[Worker ${this.config.id}] Health check failed:`, error)
      }
    }, this.config.healthCheckInterval)
  }

  private async waitForJobsToComplete(): Promise<void> {
    console.log(`[Worker ${this.config.id}] Waiting for ${this.currentJobs.size} jobs to complete`)
    
    // Wait for all job processing promises to complete
    await Promise.allSettled(Array.from(this.jobProcessingPromises.values()))
    
    console.log(`[Worker ${this.config.id}] All jobs completed`)
  }

  private updateAverageJobTime(jobTime: number): void {
    const totalJobs = this.metrics.jobsProcessed
    const currentAverage = this.metrics.averageJobTime
    this.metrics.averageJobTime = ((currentAverage * (totalJobs - 1)) + jobTime) / totalJobs
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return Math.round(process.memoryUsage().heapUsed / 1024 / 1024) // MB
    }
    return 0
  }

  private getCpuUsage(): number {
    // Simplified CPU usage estimation
    return Math.random() * 100 // Placeholder - in real implementation would use proper CPU monitoring
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Auto-scaling Worker Manager
 * Manages worker instances based on queue load
 */
export class WorkerManager {
  private workers: Map<string, CrawlerWorker> = new Map()
  private scalingConfig: ScalingConfig
  private lastScalingAction: Date = new Date(0)
  private scalingInterval: NodeJS.Timeout | null = null

  constructor(scalingConfig: ScalingConfig) {
    this.scalingConfig = scalingConfig
  }

  /**
   * Start the worker manager with auto-scaling
   */
  async start(): Promise<void> {
    console.log('[WorkerManager] Starting worker manager')
    
    // Start with minimum workers
    await this.scaleWorkers(this.scalingConfig.minWorkers)
    
    // Start auto-scaling loop
    this.startAutoScaling()
    
    console.log(`[WorkerManager] Started with ${this.workers.size} workers`)
  }

  /**
   * Stop all workers
   */
  async stop(): Promise<void> {
    console.log('[WorkerManager] Stopping worker manager')
    
    // Stop auto-scaling
    if (this.scalingInterval) {
      clearInterval(this.scalingInterval)
    }
    
    // Stop all workers
    await Promise.all(
      Array.from(this.workers.values()).map(worker => worker.stop())
    )
    
    this.workers.clear()
    console.log('[WorkerManager] All workers stopped')
  }

  /**
   * Get manager status
   */
  async getStatus(): Promise<{
    activeWorkers: number
    totalWorkers: number
    queueStats: Awaited<ReturnType<typeof crawlerQueue.getStats>>
    workerDetails: Array<ReturnType<CrawlerWorker['getStatus']>>
  }> {
    const queueStats = await crawlerQueue.getStats()
    const workerDetails = Array.from(this.workers.values()).map(worker => worker.getStatus())
    
    return {
      activeWorkers: workerDetails.filter(w => w.isRunning).length,
      totalWorkers: this.workers.size,
      queueStats,
      workerDetails
    }
  }

  // Private methods

  private async scaleWorkers(targetCount: number): Promise<void> {
    const currentCount = this.workers.size
    
    if (targetCount > currentCount) {
      // Scale up
      for (let i = currentCount; i < targetCount; i++) {
        const workerId = `worker_${Date.now()}_${i}`
        const worker = new CrawlerWorker({
          id: workerId,
          maxConcurrentJobs: 5,
          platforms: ['upwork', 'freelancer', 'indeed', 'linkedin'],
          healthCheckInterval: 30000,
          maxIdleTime: 300000,
          capabilities: ['scrape', 'health_check', 'recovery', 'cleanup']
        })
        
        await worker.start()
        this.workers.set(workerId, worker)
        console.log(`[WorkerManager] Scaled up: added worker ${workerId}`)
      }
    } else if (targetCount < currentCount) {
      // Scale down
      const workersToStop = Array.from(this.workers.entries()).slice(targetCount)
      
      for (const [workerId, worker] of workersToStop) {
        await worker.stop()
        this.workers.delete(workerId)
        console.log(`[WorkerManager] Scaled down: removed worker ${workerId}`)
      }
    }
  }

  private startAutoScaling(): void {
    this.scalingInterval = setInterval(async () => {
      try {
        await this.performAutoScaling()
      } catch (error) {
        console.error('[WorkerManager] Auto-scaling error:', error)
      }
    }, 30000) // Check every 30 seconds
  }

  private async performAutoScaling(): Promise<void> {
    const now = new Date()
    const timeSinceLastScaling = now.getTime() - this.lastScalingAction.getTime()
    
    // Respect cooldown period
    if (timeSinceLastScaling < this.scalingConfig.cooldownPeriod) {
      return
    }

    const queueStats = await crawlerQueue.getStats()
    const currentWorkers = this.workers.size
    
    // Calculate load metrics
    const pendingJobs = queueStats.pending
    const processingJobs = queueStats.processing
    const totalLoad = pendingJobs + processingJobs
    const jobsPerWorker = currentWorkers > 0 ? totalLoad / currentWorkers : 0

    // Determine scaling action
    let targetWorkers = currentWorkers

    if (jobsPerWorker > this.scalingConfig.scaleUpThreshold && currentWorkers < this.scalingConfig.maxWorkers) {
      // Scale up
      targetWorkers = Math.min(
        this.scalingConfig.maxWorkers,
        Math.ceil(totalLoad / this.scalingConfig.targetJobsPerWorker)
      )
    } else if (jobsPerWorker < this.scalingConfig.scaleDownThreshold && currentWorkers > this.scalingConfig.minWorkers) {
      // Scale down
      targetWorkers = Math.max(
        this.scalingConfig.minWorkers,
        Math.ceil(totalLoad / this.scalingConfig.targetJobsPerWorker)
      )
    }

    // Perform scaling if needed
    if (targetWorkers !== currentWorkers) {
      console.log(`[WorkerManager] Auto-scaling: ${currentWorkers} -> ${targetWorkers} workers (load: ${jobsPerWorker.toFixed(2)} jobs/worker)`)
      await this.scaleWorkers(targetWorkers)
      this.lastScalingAction = now
    }
  }
}

// Export worker classes
export { CrawlerWorker }
