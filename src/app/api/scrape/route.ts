import { NextRequest, NextResponse } from 'next/server'
import { scrapeAllPlatforms, saveScrapedProjects } from '@/lib/scraper'
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

    // Scrape projects from specified platforms
    const scrapedProjects = await scrapeAllPlatforms(
      searchTerm, 
      activePlatforms, 
      maxResults || 20
    )

    // Save to database
    await saveScrapedProjects(scrapedProjects)

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${scrapedProjects.length} projects`,
      projects: scrapedProjects,
      platforms: activePlatforms
    })

  } catch (error) {
    console.error('Scraping API error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape projects' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const searchTerm = searchParams.get('q') || 'web development'
    const maxResults = parseInt(searchParams.get('limit') || '10')

    const platforms = platform ? [platform] : ['upwork', 'freelancer']
    const scrapedProjects = await scrapeAllPlatforms(searchTerm, platforms, maxResults)

    return NextResponse.json({
      success: true,
      projects: scrapedProjects,
      count: scrapedProjects.length
    })

  } catch (error) {
    console.error('Scraping API error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape projects' },
      { status: 500 }
    )
  }
}
