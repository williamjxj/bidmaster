import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const daysBack = parseInt(searchParams.get('days') || '7')

    const supabase = await createClient()

    // Try to get stats from the enhanced scraping_logs table
    // If it doesn't exist, fall back to basic project stats
    let stats = []

    try {
      // Try the enhanced function first
      const { data: enhancedStats, error: enhancedError } = await supabase
        .rpc('get_scraping_stats', { days_back: daysBack })

      if (enhancedError) {
        throw enhancedError
      }

      stats = enhancedStats || []
    } catch (error) {
      console.log('Enhanced stats not available, using basic stats:', error)
      
      // Fallback to basic project statistics
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('source_platform, created_at')
        .gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())

      if (projectsError) {
        throw projectsError
      }

      // Group by platform and create basic stats
      const platformStats = projects?.reduce((acc: any, project) => {
        const platform = project.source_platform.toLowerCase()
        if (!acc[platform]) {
          acc[platform] = {
            platform,
            total_runs: 1,
            successful_runs: 1,
            total_projects_found: 0,
            total_projects_saved: 0,
            avg_execution_time_ms: 0,
            last_run: project.created_at
          }
        }
        acc[platform].total_projects_saved++
        if (new Date(project.created_at) > new Date(acc[platform].last_run)) {
          acc[platform].last_run = project.created_at
        }
        return acc
      }, {})

      stats = Object.values(platformStats || {})
    }

    // Get additional summary data
    const { data: recentProjects, error: recentError } = await supabase
      .from('projects')
      .select('id, source_platform, created_at')
      .gte('created_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (recentError) {
      console.error('Error fetching recent projects:', recentError)
    }

    const summary = {
      totalProjects: recentProjects?.length || 0,
      platformsActive: stats.length,
      lastScrapingRun: stats.length > 0 ? 
        Math.max(...stats.map((s: any) => new Date(s.last_run).getTime())) : null
    }

    return NextResponse.json({
      success: true,
      stats,
      summary,
      daysBack
    })

  } catch (error) {
    console.error('Scraping stats API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch scraping statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
