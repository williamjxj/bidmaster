/**
 * Crawler Error Recovery API
 * 
 * Provides endpoints for automated error recovery and manual intervention
 */

import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from '@/lib/crawler-error-handler'

export async function POST(request: NextRequest) {
  try {
    const { platform, action } = await request.json()

    if (!platform || !action) {
      return NextResponse.json({
        success: false,
        error: 'Platform and action are required'
      }, { status: 400 })
    }

    switch (action) {
      case 'recover':
        const success = await errorHandler.attemptRecovery(platform)
        
        return NextResponse.json({
          success,
          message: success 
            ? `Recovery initiated for ${platform}` 
            : `Recovery failed for ${platform}`,
          data: {
            platform,
            action: 'recover',
            timestamp: new Date().toISOString()
          }
        })

      case 'reset_rate_limit':
        // This would reset rate limiting for a platform
        const resetSuccess = await errorHandler.attemptRecovery(platform)
        
        return NextResponse.json({
          success: resetSuccess,
          message: resetSuccess 
            ? `Rate limit reset for ${platform}` 
            : `Failed to reset rate limit for ${platform}`,
          data: {
            platform,
            action: 'reset_rate_limit',
            timestamp: new Date().toISOString()
          }
        })

      case 'force_health_check':
        // Force a health check for the platform
        const healthBefore = errorHandler.getPlatformHealth(platform)
        
        // Trigger recovery which includes health reset
        await errorHandler.attemptRecovery(platform)
        
        const healthAfter = errorHandler.getPlatformHealth(platform)
        
        return NextResponse.json({
          success: true,
          message: `Health check completed for ${platform}`,
          data: {
            platform,
            action: 'force_health_check',
            health_before: healthBefore,
            health_after: healthAfter,
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: recover, reset_rate_limit, force_health_check'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Recovery API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to execute recovery action',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = parseInt(searchParams.get('timeRange') || '86400000') // 24 hours
    
    // Get error statistics
    const errorStats = await errorHandler.getErrorStatistics(timeRange)
    
    // Get recovery recommendations
    const recommendations = []
    const healthStatus = errorHandler.getHealthStatus()
    
    for (const [platform, health] of healthStatus.entries()) {
      if (health.status === 'unhealthy') {
        recommendations.push({
          platform,
          severity: 'high',
          action: 'recover',
          reason: `Platform has ${health.consecutiveFailures} consecutive failures`,
          automated: true
        })
      } else if (health.status === 'degraded') {
        recommendations.push({
          platform,
          severity: 'medium',
          action: 'monitor',
          reason: `Platform is degraded with error rate ${health.errorRate}`,
          automated: false
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        error_statistics: errorStats,
        health_summary: Object.fromEntries(healthStatus),
        recovery_recommendations: recommendations,
        summary: {
          total_errors: errorStats.totalErrors,
          platforms_needing_recovery: recommendations.filter(r => r.action === 'recover').length,
          automated_recovery_available: recommendations.filter(r => r.automated).length
        }
      }
    })

  } catch (error) {
    console.error('Recovery status API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get recovery status'
    }, { status: 500 })
  }
}
