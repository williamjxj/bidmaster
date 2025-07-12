import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { dryRun = true } = await request.json()
    
    const supabase = await createClient()

    // Find all mock data projects
    const { data: mockProjects, error: findError } = await supabase
      .from('projects')
      .select('id, title, source_url, created_at')
      .or('source_url.like.%/job/MOCK_%,title.eq.React Developer Needed for E-commerce Platform,title.eq.AI/ML Engineer for Computer Vision Project')

    if (findError) {
      throw findError
    }

    if (!mockProjects || mockProjects.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No mock data found to clean up',
        found: 0,
        deleted: 0,
        dryRun
      })
    }

    let deletedCount = 0

    if (!dryRun) {
      // Actually delete the mock data
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .or('source_url.like.%/job/MOCK_%,title.eq.React Developer Needed for E-commerce Platform,title.eq.AI/ML Engineer for Computer Vision Project')

      if (deleteError) {
        throw deleteError
      }

      deletedCount = mockProjects.length
    }

    return NextResponse.json({
      success: true,
      message: dryRun 
        ? `Found ${mockProjects.length} mock projects (dry run - not deleted)`
        : `Successfully deleted ${deletedCount} mock projects`,
      found: mockProjects.length,
      deleted: deletedCount,
      dryRun,
      mockProjects: mockProjects.map(p => ({
        id: p.id,
        title: p.title,
        source_url: p.source_url,
        created_at: p.created_at
      }))
    })

  } catch (error) {
    console.error('Mock data cleanup error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to cleanup mock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Count mock vs real data
    const { data: allProjects, error } = await supabase
      .from('projects')
      .select('id, title, source_url, source_platform, created_at')

    if (error) {
      throw error
    }

    const mockProjects = allProjects?.filter(p => 
      p.source_url?.includes('/job/MOCK_') ||
      p.title === 'React Developer Needed for E-commerce Platform' ||
      p.title === 'AI/ML Engineer for Computer Vision Project' ||
      p.title === 'Full Stack Developer - Node.js & React'
    ) || []

    const realProjects = allProjects?.filter(p => !mockProjects.includes(p)) || []

    return NextResponse.json({
      success: true,
      summary: {
        total: allProjects?.length || 0,
        mock: mockProjects.length,
        real: realProjects.length,
        mockPercentage: allProjects?.length ? Math.round((mockProjects.length / allProjects.length) * 100) : 0
      },
      mockProjects: mockProjects.slice(0, 10), // Show first 10 for preview
      realProjects: realProjects.slice(0, 10)   // Show first 10 for preview
    })

  } catch (error) {
    console.error('Mock data analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze mock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
