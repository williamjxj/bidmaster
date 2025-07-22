/**
 * Worker Management API
 * Provides endpoints for managing crawler workers and auto-scaling
 */

import { NextRequest, NextResponse } from 'next/server'
import { WorkerManager } from '@/lib/crawler-worker'

// Global worker manager instance
let workerManager: WorkerManager | null = null

const DEFAULT_SCALING_CONFIG = {
  minWorkers: 1,
  maxWorkers: 5,
  targetJobsPerWorker: 10,
  scaleUpThreshold: 15,
  scaleDownThreshold: 5,
  cooldownPeriod: 300000 // 5 minutes
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'status':
        if (!workerManager) {
          return NextResponse.json({ 
            status: 'stopped',
            activeWorkers: 0,
            totalWorkers: 0
          })
        }

        const status = await workerManager.getStatus()
        return NextResponse.json({ 
          status: 'running',
          ...status
        })

      case 'config':
        return NextResponse.json({ 
          scalingConfig: DEFAULT_SCALING_CONFIG,
          isRunning: workerManager !== null
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Worker API] Error:', error)
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
      case 'start':
        if (workerManager) {
          return NextResponse.json({ error: 'Worker manager already running' }, { status: 400 })
        }

        const scalingConfig = { ...DEFAULT_SCALING_CONFIG, ...data.scalingConfig }
        workerManager = new WorkerManager(scalingConfig)
        
        await workerManager.start()
        
        return NextResponse.json({ 
          status: 'started',
          scalingConfig,
          message: 'Worker manager started with auto-scaling'
        })

      case 'stop':
        if (!workerManager) {
          return NextResponse.json({ error: 'Worker manager not running' }, { status: 400 })
        }

        await workerManager.stop()
        workerManager = null
        
        return NextResponse.json({ 
          status: 'stopped',
          message: 'Worker manager stopped'
        })

      case 'restart':
        // Stop existing manager if running
        if (workerManager) {
          await workerManager.stop()
        }

        // Start new manager
        const restartConfig = { ...DEFAULT_SCALING_CONFIG, ...data.scalingConfig }
        workerManager = new WorkerManager(restartConfig)
        await workerManager.start()
        
        return NextResponse.json({ 
          status: 'restarted',
          scalingConfig: restartConfig,
          message: 'Worker manager restarted'
        })

      case 'scale':
        if (!workerManager) {
          return NextResponse.json({ error: 'Worker manager not running' }, { status: 400 })
        }

        const { targetWorkers } = data
        if (!targetWorkers || targetWorkers < 0) {
          return NextResponse.json({ error: 'Valid targetWorkers required' }, { status: 400 })
        }

        // Note: Manual scaling would require extending WorkerManager with a manual scale method
        return NextResponse.json({ 
          message: 'Manual scaling not implemented - using auto-scaling',
          targetWorkers
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('[Worker API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    if (workerManager) {
      await workerManager.stop()
      workerManager = null
    }

    return NextResponse.json({ 
      status: 'stopped',
      message: 'All workers stopped and manager shut down'
    })
  } catch (error) {
    console.error('[Worker API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
