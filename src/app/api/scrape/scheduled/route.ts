import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { scrapeAllPlatforms, saveScrapedProjects } from '@/lib/scraper'

// This endpoint will be called by cron jobs or external schedulers
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a trusted source (optional)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get active sources and user preferences
    const { data: sources } = await supabase
      .from('sources')
      .select('*')
      .eq('is_active', true)

    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('target_technologies, target_categories, preferred_platforms')

    if (!sources || sources.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active sources to scrape',
        scraped: 0
      })
    }

    let totalScraped = 0
    const results = []

    // Generate search terms based on user preferences
    const searchTerms = generateSearchTerms(preferences)

    for (const source of sources) {
      try {
        console.log(`Scraping ${source.name}...`)
        
        for (const searchTerm of searchTerms) {
          const scrapedProjects = await scrapeAllPlatforms(
            searchTerm,
            [source.name.toLowerCase()],
            10 // Limit per search term per platform
          )

          if (scrapedProjects.length > 0) {
            await saveScrapedProjects(scrapedProjects)
            totalScraped += scrapedProjects.length
          }

          // Small delay between searches
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

        // Update last_scraped timestamp
        await supabase
          .from('sources')
          .update({ last_scraped: new Date().toISOString() })
          .eq('id', source.id)

        results.push({
          source: source.name,
          success: true,
          scraped: totalScraped
        })

      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error)
        results.push({
          source: source.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scheduled scraping completed. Total projects scraped: ${totalScraped}`,
      totalScraped,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Scheduled scraping error:', error)
    return NextResponse.json(
      { 
        error: 'Scheduled scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateSearchTerms(preferences: { target_technologies?: string[]; target_categories?: string[] }[] | null): string[] {
  const defaultTerms = [
    'web development',
    'react developer',
    'node.js',
    'full stack developer',
    'javascript',
    'typescript'
  ]

  if (!preferences || preferences.length === 0) {
    return defaultTerms
  }

  const terms = new Set<string>()
  
  preferences.forEach(pref => {
    if (pref.target_technologies) {
      pref.target_technologies.forEach((tech: string) => {
        terms.add(tech.toLowerCase())
      })
    }
    if (pref.target_categories) {
      pref.target_categories.forEach((cat: string) => {
        terms.add(cat.toLowerCase())
      })
    }
  })

  return terms.size > 0 ? Array.from(terms) : defaultTerms
}
