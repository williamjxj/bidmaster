import { NextRequest, NextResponse } from 'next/server'
import { enhancedScraper } from '@/lib/enhanced-scraper'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { searchTerm, platforms, maxResults } = await request.json()
    
    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      )
    }

    // Get active platforms from database if not specified
    const supabase = await createClient()
    let activePlatforms = platforms

    if (!activePlatforms) {
      const { data: sources } = await supabase
        .from('sources')
        .select('name')
        .eq('is_active', true)
      
      activePlatforms = sources?.map(s => s.name.toLowerCase()) || ['upwork', 'freelancer']
    }

    // Scrape projects using enhanced scraper with error handling
    const scrapingResult = await enhancedScraper.scrapeProjects(
      searchTerm,
      activePlatforms,
      maxResults || 5
    )

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${scrapingResult.results.length} projects`,
      projects: scrapingResult.results,
      platforms: activePlatforms,
      sessions: scrapingResult.sessions,
      health_status: scrapingResult.healthStatus,
      statistics: {
        total_results: scrapingResult.results.length,
        successful_platforms: scrapingResult.sessions.filter(s => s.status === 'completed').length,
        failed_platforms: scrapingResult.sessions.filter(s => s.status === 'failed').length,
        average_response_time: scrapingResult.sessions.length > 0
          ? scrapingResult.sessions.reduce((sum, s) => sum + (s.responseTime || 0), 0) / scrapingResult.sessions.length
          : 0
      }
    })

  } catch (error) {
    console.error('Enhanced scraping API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to scrape projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const searchTerm = searchParams.get('q') || 'web development'
    const maxResults = parseInt(searchParams.get('limit') || '5')

    const platforms = platform ? [platform] : ['upwork', 'freelancer']
    
    // Use enhanced scraper for GET requests too
    const scrapingResult = await enhancedScraper.scrapeProjects(
      searchTerm, 
      platforms, 
      maxResults
    )

    return NextResponse.json({
      success: true,
      projects: scrapingResult.results,
      count: scrapingResult.results.length,
      health_status: scrapingResult.healthStatus.map(h => ({
        platform: h.platform,
        status: h.status,
        error_rate: h.errorRate
      })),
      performance: {
        total_response_time: scrapingResult.sessions.reduce((sum, s) => sum + (s.responseTime || 0), 0),
        successful_sessions: scrapingResult.sessions.filter(s => s.status === 'completed').length,
        failed_sessions: scrapingResult.sessions.filter(s => s.status === 'failed').length
      }
    })

  } catch (error) {
    console.error('Enhanced scraping API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to scrape projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
