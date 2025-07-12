import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all projects for stats calculation
    const { data: projects, error } = await supabase
      .from('projects')
      .select('status, budget, created_at, category, source_platform')

    if (error) {
      console.error('Error fetching project stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch project stats' },
        { status: 500 }
      )
    }

    // Calculate stats
    const stats = {
      totalProjects: projects?.length || 0,
      new: projects?.filter(p => p.status === 'new').length || 0,
      bookmarked: projects?.filter(p => p.status === 'bookmarked').length || 0,
      applied: projects?.filter(p => p.status === 'applied').length || 0,
      inProgress: projects?.filter(p => p.status === 'in_progress').length || 0,
      won: projects?.filter(p => p.status === 'won').length || 0,
      lost: projects?.filter(p => p.status === 'lost').length || 0,
      archived: projects?.filter(p => p.status === 'archived').length || 0,
      totalBudget: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0,
      averageBudget: projects?.length ? 
        (projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length) : 0,
      categoryCounts: projects?.reduce((acc, p) => {
        if (p.category) {
          acc[p.category] = (acc[p.category] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {},
      platformCounts: projects?.reduce((acc, p) => {
        if (p.source_platform) {
          acc[p.source_platform] = (acc[p.source_platform] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {},
      winRate: projects?.filter(p => ['applied', 'won', 'lost'].includes(p.status)).length ?
        ((projects.filter(p => p.status === 'won').length / 
          projects.filter(p => ['applied', 'won', 'lost'].includes(p.status)).length) * 100) : 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
