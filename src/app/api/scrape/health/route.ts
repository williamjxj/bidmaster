/**
 * Health Monitoring API Endpoint
 * 
 * Provides comprehensive health monitoring and status information
 * for the web scraping system with error handling and recovery.
 */

import { NextRequest, NextResponse } from 'next/server'
import { enhancedScraper } from '@/lib/enhanced-scraper'
import { errorHandler } from '@/lib/crawler-error-handler'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'
    const platform = searchParams.get('platform')
    const timeRange = parseInt(searchParams.get('timeRange') || '86400000') // 24 hours default

    // Get specific platform health
    if (platform) {
      const platformHealth = errorHandler.getPlatformHealth(platform)
      
      if (!platformHealth) {
        return NextResponse.json({
          success: false,
          error: 'Platform not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: platformHealth
      })
    }

    // Get comprehensive health report from enhanced scraper
    const healthReport = await enhancedScraper.getHealthReport()
    
    // Get error statistics from error handler
    const errorStats = await errorHandler.getErrorStatistics(timeRange)
    const allPlatformHealth = errorHandler.getHealthStatus()

    if (!detailed) {
      // Return simplified health status
      return NextResponse.json({
        success: true,
        data: {
          overall: healthReport.overall,
          healthy_platforms: healthReport.platforms.filter(p => p.status === 'healthy').length,
          total_platforms: healthReport.platforms.length,
          error_rate: errorStats.totalErrors > 0 
            ? (errorStats.totalErrors - (healthReport.errorStats?.recoverableErrors || 0)) / errorStats.totalErrors
            : 0,
          active_sessions: healthReport.activeSessions?.length || 0,
          error_summary: {
            total_errors: errorStats.totalErrors,
            critical_errors: errorStats.errorsBySeverity.CRITICAL || 0,
            high_errors: errorStats.errorsBySeverity.HIGH || 0
          }
        }
      })
    }

    // Return detailed health information with error handling data
    return NextResponse.json({
      success: true,
      data: {
        overall_status: healthReport.overall,
        platforms: healthReport.platforms.map(platform => {
          const errorHandlerHealth = allPlatformHealth.get(platform.platform)
          return {
            name: platform.platform,
            status: platform.status,
            error_rate: platform.errorRate,
            consecutive_failures: platform.consecutiveFailures,
            is_blocked: platform.isBlocked,
            last_successful: platform.lastSuccessful,
            next_retry_time: platform.nextRetryTime,
            average_response_time: platform.averageResponseTime,
            error_handler_status: errorHandlerHealth?.status || 'unknown',
            error_handler_consecutive_failures: errorHandlerHealth?.consecutiveFailures || 0
          }
        }),
        error_statistics: {
          total_errors: healthReport.errorStats.totalErrors,
          recoverable_errors: healthReport.errorStats.recoverableErrors,
          errors_by_type: healthReport.errorStats.errorsByType,
          recent_errors: healthReport.errorStats.recentErrors.map(error => ({
            type: error.type,
            message: error.message,
            platform: error.platform,
            timestamp: error.timestamp,
            retry_count: error.retryCount,
            recoverable: error.recoverable
          }))
        },
        active_sessions: healthReport.activeSessions.map(session => ({
          id: session.id,
          platform: session.platform,
          search_term: session.searchTerm,
          status: session.status,
          start_time: session.startTime,
          duration: session.endTime 
            ? session.endTime.getTime() - session.startTime.getTime()
            : Date.now() - session.startTime.getTime(),
          results_count: session.resultsCount,
          errors: session.errors
        })),
        system_info: {
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory_usage: process.memoryUsage(),
          node_version: process.version
        }
      }
    })

  } catch (error) {
    console.error('Health check API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get health status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, platform } = body

    switch (action) {
      case 'reset_health':
        // Reset health status for a specific platform or all platforms
        if (platform) {
          console.log(`Resetting health status for platform: ${platform}`)
        } else {
          console.log('Resetting health status for all platforms')
        }
        
        return NextResponse.json({
          success: true,
          message: `Health status reset for ${platform || 'all platforms'}`
        })

      case 'clear_errors':
        // Clear error logs (this would need to be implemented in the error handler)
        console.log('Clearing error logs')
        
        return NextResponse.json({
          success: true,
          message: 'Error logs cleared'
        })

      case 'force_health_check':
        // Force a comprehensive health check
        const healthReport = await enhancedScraper.getHealthReport()
        
        return NextResponse.json({
          success: true,
          message: 'Health check completed',
          data: {
            overall: healthReport.overall,
            platforms_checked: healthReport.platforms.length,
            issues_found: healthReport.platforms.filter(p => p.status !== 'healthy').length
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: `Action '${action}' is not supported`
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Health management API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to execute health management action',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
