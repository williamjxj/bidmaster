import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category')
    const status = searchParams.get('status')?.split(',') || []
    const searchTerm = searchParams.get('searchTerm')
    const technologies = searchParams.get('technologies')?.split(',') || []
    const platform = searchParams.get('platform')
    const minBudget = searchParams.get('minBudget')
    const maxBudget = searchParams.get('maxBudget')

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (status.length > 0) {
      query = query.in('status', status)
    }

    if (platform) {
      query = query.eq('source_platform', platform)
    }

    if (minBudget) {
      query = query.gte('budget', parseInt(minBudget))
    }

    if (maxBudget) {
      query = query.lte('budget', parseInt(maxBudget))
    }

    // Apply search if provided
    if (searchTerm) {
      query = query.or(`
        title.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%
      `)
    }

    // Apply technology filter
    if (technologies.length > 0) {
      query = query.overlaps('technologies', technologies)
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json(projects || [])
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title: body.title,
        description: body.description,
        budget: body.budget,
        budget_type: body.budgetType || 'fixed',
        source_platform: body.sourcePlatform,
        source_url: body.sourceUrl,
        technologies: body.technologies || [],
        category: body.category,
        location: body.location,
        posted_date: body.postedDate || new Date().toISOString(),
        deadline: body.deadline,
        status: body.status || 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
