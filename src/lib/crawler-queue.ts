/**
 * Crawler Queue Manager
 * Implements distributed job processing with Redis-like queue system
 * Handles task prioritization, scheduling, and worker coordination
 */

export interface CrawlerJob {
  id: string
  type: 'scrape' | 'health_check' | 'recovery' | 'cleanup'
  priority: 'low' | 'medium' | 'high' | 'critical'
  platform?: string
  searchTerm?: string
  maxResults?: number
  metadata: Record<string, unknown>
  createdAt: Date
  scheduledAt?: Date
  attempts: number
  maxAttempts: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying'
  workerId?: string
  startedAt?: Date
  completedAt?: Date
  error?: string
  result?: unknown
}

export interface QueueStats {
  pending: number
  processing: number
  completed: number
  failed: number
  totalJobs: number
  averageProcessingTime: number
  successRate: number
}

export interface WorkerConfig {
  id: string
  maxConcurrentJobs: number
  platforms: string[]
  healthCheckInterval: number
  maxIdleTime: number
  capabilities: string[]
}

class CrawlerQueue {
  private jobs: Map<string, CrawlerJob> = new Map()
  private workers: Map<string, WorkerConfig> = new Map()
  private processingJobs: Map<string, string> = new Map() // jobId -> workerId
  private workerLastActivity: Map<string, Date> = new Map()
  private stats: QueueStats = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalJobs: 0,
    averageProcessingTime: 0,
    successRate: 0
  }

  constructor() {
    // Start background processes
    this.startMaintenanceLoop()
    this.startStatsUpdater()
  }

  /**
   * Add a new job to the queue
   */
  async addJob(job: Omit<CrawlerJob, 'id' | 'createdAt' | 'attempts' | 'status'>): Promise<string> {
    const jobId = this.generateJobId()
    const crawlerJob: CrawlerJob = {
      ...job,
      id: jobId,
      createdAt: new Date(),
      attempts: 0,
      status: 'pending'
    }

    this.jobs.set(jobId, crawlerJob)
    this.updateStats()

    console.log(`[Queue] Added job ${jobId} with priority ${job.priority}`)
    return jobId
  }

  /**
   * Register a worker
   */
  async registerWorker(config: WorkerConfig): Promise<void> {
    this.workers.set(config.id, config)
    this.workerLastActivity.set(config.id, new Date())
    console.log(`[Queue] Registered worker ${config.id}`)
  }

  /**
   * Unregister a worker
   */
  async unregisterWorker(workerId: string): Promise<void> {
    // Reassign any jobs this worker was processing
    for (const [jobId, assignedWorkerId] of this.processingJobs.entries()) {
      if (assignedWorkerId === workerId) {
        const job = this.jobs.get(jobId)
        if (job) {
          job.status = 'pending'
          job.workerId = undefined
          job.startedAt = undefined
        }
        this.processingJobs.delete(jobId)
      }
    }

    this.workers.delete(workerId)
    this.workerLastActivity.delete(workerId)
    console.log(`[Queue] Unregistered worker ${workerId}`)
  }

  /**
   * Get next job for a worker
   */
  async getNextJob(workerId: string): Promise<CrawlerJob | null> {
    const worker = this.workers.get(workerId)
    if (!worker) {
      throw new Error(`Worker ${workerId} not registered`)
    }

    // Update worker activity
    this.workerLastActivity.set(workerId, new Date())

    // Check if worker is at capacity
    const workerJobCount = Array.from(this.processingJobs.values())
      .filter(id => id === workerId).length
    
    if (workerJobCount >= worker.maxConcurrentJobs) {
      return null
    }

    // Find highest priority job that worker can handle
    const availableJobs = Array.from(this.jobs.values())
      .filter(job => 
        job.status === 'pending' && 
        this.canWorkerHandleJob(worker, job) &&
        (!job.scheduledAt || job.scheduledAt <= new Date())
      )
      .sort((a, b) => this.comparePriority(a.priority, b.priority))

    const job = availableJobs[0]
    if (!job) {
      return null
    }

    // Assign job to worker
    job.status = 'processing'
    job.workerId = workerId
    job.startedAt = new Date()
    job.attempts += 1

    this.processingJobs.set(job.id, workerId)
    this.updateStats()

    console.log(`[Queue] Assigned job ${job.id} to worker ${workerId}`)
    return job
  }

  /**
   * Mark job as completed
   */
  async completeJob(jobId: string, result: unknown): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    job.status = 'completed'
    job.completedAt = new Date()
    job.result = result

    this.processingJobs.delete(jobId)
    this.updateStats()

    console.log(`[Queue] Completed job ${jobId}`)
  }

  /**
   * Mark job as failed
   */
  async failJob(jobId: string, error: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    job.error = error

    // Retry logic
    if (job.attempts < job.maxAttempts) {
      job.status = 'retrying'
      job.workerId = undefined
      job.startedAt = undefined
      
      // Exponential backoff for retry
      const backoffMs = Math.pow(2, job.attempts) * 1000
      job.scheduledAt = new Date(Date.now() + backoffMs)
      
      setTimeout(() => {
        if (job.status === 'retrying') {
          job.status = 'pending'
        }
      }, backoffMs)

      console.log(`[Queue] Retrying job ${jobId} in ${backoffMs}ms (attempt ${job.attempts}/${job.maxAttempts})`)
    } else {
      job.status = 'failed'
      console.log(`[Queue] Failed job ${jobId} after ${job.attempts} attempts`)
    }

    this.processingJobs.delete(jobId)
    this.updateStats()
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<CrawlerJob | null> {
    return this.jobs.get(jobId) || null
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<QueueStats> {
    return { ...this.stats }
  }

  /**
   * Get worker statistics
   */
  async getWorkerStats(): Promise<Array<{
    id: string
    status: 'active' | 'idle' | 'offline'
    jobsProcessing: number
    lastActivity: Date
    config: WorkerConfig
  }>> {
    const now = new Date()
    return Array.from(this.workers.entries()).map(([id, config]) => {
      const lastActivity = this.workerLastActivity.get(id) || new Date(0)
      const timeSinceActivity = now.getTime() - lastActivity.getTime()
      const jobsProcessing = Array.from(this.processingJobs.values())
        .filter(workerId => workerId === id).length

      let status: 'active' | 'idle' | 'offline' = 'offline'
      if (timeSinceActivity < config.healthCheckInterval * 2) {
        status = jobsProcessing > 0 ? 'active' : 'idle'
      }

      return {
        id,
        status,
        jobsProcessing,
        lastActivity,
        config
      }
    })
  }

  /**
   * Clean up old jobs
   */
  async cleanup(olderThanHours: number = 24): Promise<number> {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000)
    let cleaned = 0

    for (const [jobId, job] of this.jobs.entries()) {
      if ((job.status === 'completed' || job.status === 'failed') && 
          job.completedAt && job.completedAt < cutoff) {
        this.jobs.delete(jobId)
        cleaned++
      }
    }

    this.updateStats()
    console.log(`[Queue] Cleaned up ${cleaned} old jobs`)
    return cleaned
  }

  /**
   * Priority scheduling for high-priority jobs
   */
  async scheduleHighPriorityJob(job: Omit<CrawlerJob, 'id' | 'createdAt' | 'attempts' | 'status' | 'priority'>): Promise<string> {
    return this.addJob({
      ...job,
      priority: 'high',
      scheduledAt: new Date() // Immediate scheduling
    })
  }

  /**
   * Bulk job submission
   */
  async addJobBatch(jobs: Array<Omit<CrawlerJob, 'id' | 'createdAt' | 'attempts' | 'status'>>): Promise<string[]> {
    const jobIds: string[] = []
    
    for (const job of jobs) {
      const jobId = await this.addJob(job)
      jobIds.push(jobId)
    }

    console.log(`[Queue] Added batch of ${jobs.length} jobs`)
    return jobIds
  }

  // Private methods

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private canWorkerHandleJob(worker: WorkerConfig, job: CrawlerJob): boolean {
    // Check platform capability
    if (job.platform && !worker.platforms.includes(job.platform)) {
      return false
    }

    // Check job type capability
    if (job.type && !worker.capabilities.includes(job.type)) {
      return false
    }

    return true
  }

  private comparePriority(a: CrawlerJob['priority'], b: CrawlerJob['priority']): number {
    const priorityValues = { critical: 4, high: 3, medium: 2, low: 1 }
    return priorityValues[b] - priorityValues[a]
  }

  private updateStats(): void {
    const jobs = Array.from(this.jobs.values())
    
    this.stats = {
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      totalJobs: jobs.length,
      averageProcessingTime: this.calculateAverageProcessingTime(jobs),
      successRate: this.calculateSuccessRate(jobs)
    }
  }

  private calculateAverageProcessingTime(jobs: CrawlerJob[]): number {
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.startedAt && j.completedAt)
    if (completedJobs.length === 0) return 0

    const totalTime = completedJobs.reduce((sum, job) => {
      return sum + (job.completedAt!.getTime() - job.startedAt!.getTime())
    }, 0)

    return totalTime / completedJobs.length
  }

  private calculateSuccessRate(jobs: CrawlerJob[]): number {
    const finishedJobs = jobs.filter(j => j.status === 'completed' || j.status === 'failed')
    if (finishedJobs.length === 0) return 0

    const successfulJobs = finishedJobs.filter(j => j.status === 'completed')
    return successfulJobs.length / finishedJobs.length
  }

  private startMaintenanceLoop(): void {
    setInterval(() => {
      this.performMaintenance()
    }, 30000) // Every 30 seconds
  }

  private startStatsUpdater(): void {
    setInterval(() => {
      this.updateStats()
    }, 5000) // Every 5 seconds
  }

  private async performMaintenance(): Promise<void> {
    // Check for stale jobs
    const now = new Date()
    const staleTimeout = 300000 // 5 minutes

    for (const [jobId, job] of this.jobs.entries()) {
      if (job.status === 'processing' && job.startedAt) {
        const processingTime = now.getTime() - job.startedAt.getTime()
        if (processingTime > staleTimeout) {
          console.log(`[Queue] Detected stale job ${jobId}, resetting to pending`)
          job.status = 'pending'
          job.workerId = undefined
          job.startedAt = undefined
          this.processingJobs.delete(jobId)
        }
      }
    }

    // Check for inactive workers
    const inactiveTimeout = 120000 // 2 minutes
    for (const [workerId, lastActivity] of this.workerLastActivity.entries()) {
      const inactiveTime = now.getTime() - lastActivity.getTime()
      if (inactiveTime > inactiveTimeout) {
        console.log(`[Queue] Worker ${workerId} inactive for ${inactiveTime}ms, unregistering`)
        await this.unregisterWorker(workerId)
      }
    }

    // Auto-cleanup old jobs
    await this.cleanup(24)
  }
}

// Global queue instance
export const crawlerQueue = new CrawlerQueue()
