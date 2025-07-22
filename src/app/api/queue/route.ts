/**
 * Queue Management API
 * Provides endpoints for managing the crawler queue system
 */

import { NextRequest, NextResponse } from 'next/server'
import { crawlerQueue } from '@/lib/crawler-queue'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        const stats = await crawlerQueue.getStats()
        return NextResponse.json({ stats })

      case 'workers':
        const workerStats = await crawlerQueue.getWorkerStats()
        return NextResponse.json({ workers: workerStats })

      case 'job':
        const jobId = searchParams.get('jobId')
        if (!jobId) {
          return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
        }
        const job = await crawlerQueue.getJobStatus(jobId)
        return NextResponse.json({ job })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Queue API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'add_job':
        const { type, priority = 'medium', platform, searchTerm, maxResults, metadata = {} } = data
        
        if (!type) {
          return NextResponse.json({ error: 'Job type required' }, { status: 400 })
        }

        const jobId = await crawlerQueue.addJob({
          type,
          priority,
          platform,
          searchTerm,
          maxResults,
          metadata,
          maxAttempts: 3
        })

        return NextResponse.json({ jobId, status: 'queued' })

      case 'add_batch':
        const { jobs } = data
        
        if (!Array.isArray(jobs)) {
          return NextResponse.json({ error: 'Jobs array required' }, { status: 400 })
        }

        const jobIds = await crawlerQueue.addJobBatch(
          jobs.map(job => ({
            ...job,
            maxAttempts: job.maxAttempts || 3
          }))
        )

        return NextResponse.json({ jobIds, status: 'queued', count: jobIds.length })

      case 'schedule_priority':
        const priorityJob = {
          type: data.type,
          platform: data.platform,
          searchTerm: data.searchTerm,
          maxResults: data.maxResults,
          metadata: data.metadata || {},
          maxAttempts: 3
        }

        const priorityJobId = await crawlerQueue.scheduleHighPriorityJob(priorityJob)
        return NextResponse.json({ jobId: priorityJobId, status: 'scheduled', priority: 'high' })

      case 'cleanup':
        const { olderThanHours = 24 } = data
        const cleaned = await crawlerQueue.cleanup(olderThanHours)
        return NextResponse.json({ cleaned, olderThanHours })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Queue API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, jobId, ...data } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    switch (action) {
      case 'complete':
        await crawlerQueue.completeJob(jobId, data.result)
        return NextResponse.json({ status: 'completed' })

      case 'fail':
        await crawlerQueue.failJob(jobId, data.error || 'Job failed')
        return NextResponse.json({ status: 'failed' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Queue API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
