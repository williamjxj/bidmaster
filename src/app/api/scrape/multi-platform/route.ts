/**
 * Multi-Platform Scraping API
 * 
 * Provides endpoints for optimized multi-platform scraping with
 * parallel processing and deduplication.
 */

import { NextRequest, NextResponse } from 'next/server'
import { multiPlatformOptimizer, ENHANCED_PLATFORM_CONFIGS } from '@/lib/multi-platform-optimizer'

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, maxResults = 20, platforms } = await request.json()

    if (!searchTerm) {
      return NextResponse.json({
        success: false,
        error: 'Search term is required'
      }, { status: 400 })
    }

    // Validate platforms
    const availablePlatforms = Object.keys(ENHANCED_PLATFORM_CONFIGS)
    const targetPlatforms = platforms || availablePlatforms
    
    const invalidPlatforms = targetPlatforms.filter((p: string) => !availablePlatforms.includes(p))
    if (invalidPlatforms.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}. Available: ${availablePlatforms.join(', ')}`
      }, { status: 400 })
    }

    console.log(`🚀 Starting multi-platform scraping for: ${searchTerm}`)
    const startTime = Date.now()

    // Execute optimized scraping
    const result = await multiPlatformOptimizer.scrapeAllPlatforms(
      searchTerm,
      maxResults,
      targetPlatforms
    )

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        search_term: searchTerm,
        total_projects: result.projects.length,
        projects: result.projects,
        statistics: {
          ...result.statistics,
          duration_ms: duration,
          platforms_used: targetPlatforms,
          average_per_platform: Math.round(result.projects.length / targetPlatforms.length)
        }
      }
    })

  } catch (error) {
    console.error('Multi-platform scraping error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to execute multi-platform scraping',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'platforms':
        // Return available platforms and their configurations
        const platformInfo = Object.entries(ENHANCED_PLATFORM_CONFIGS).map(([key, config]) => ({
          id: key,
          name: config.platform,
          baseUrl: config.baseUrl,
          rateLimit: config.rateLimit,
          maxConcurrent: config.maxConcurrent,
          features: {
            realSelectors: true,
            optimizedScraping: true,
            errorHandling: true,
            deduplication: true
          }
        }))

        return NextResponse.json({
          success: true,
          data: {
            platforms: platformInfo,
            total_platforms: platformInfo.length,
            capabilities: {
              parallel_scraping: true,
              data_deduplication: true,
              error_recovery: true,
              rate_limiting: true
            }
          }
        })

      case 'stats':
        // Return scraping statistics (mock data for now)
        return NextResponse.json({
          success: true,
          data: {
            recent_scrapes: {
              last_24h: Math.floor(Math.random() * 100),
              last_week: Math.floor(Math.random() * 500),
              last_month: Math.floor(Math.random() * 2000)
            },
            platform_performance: Object.keys(ENHANCED_PLATFORM_CONFIGS).reduce((acc, platform) => ({
              ...acc,
              [platform]: {
                success_rate: 0.85 + Math.random() * 0.15,
                avg_response_time: Math.floor(Math.random() * 3000) + 1000,
                projects_found: Math.floor(Math.random() * 50)
              }
            }), {}),
            deduplication_stats: {
              duplicate_rate: 0.1 + Math.random() * 0.2,
              projects_saved: Math.floor(Math.random() * 200),
              efficiency_gain: '15-30%'
            }
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: platforms, stats'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Multi-platform API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 })
  }
}
