import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database'

type Bid = Database['public']['Tables']['bids']['Row']
type Project = Database['public']['Tables']['projects']['Row']

interface BidWithProject extends Bid {
  projects: Project | null
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const status = searchParams.get('status')?.split(',') || []
    const projectId = searchParams.get('projectId')
    const searchTerm = searchParams.get('searchTerm')

    let query = supabase
      .from('bids')
      .select(`
        *,
        projects (
          title,
          source_platform,
          source_url
        )
      `)
      .eq('user_id', user.id) // Only get bids for the authenticated user
      .order('created_at', { ascending: false })

    // Apply filters
    if (status.length > 0) {
      query = query.in('status', status)
    }
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    // Apply search if provided
    if (searchTerm) {
      query = query.or(`
        proposal_text.ilike.%${searchTerm}%,
        notes.ilike.%${searchTerm}%,
        projects.title.ilike.%${searchTerm}%
      `)
    }

    const { data: bids, error } = await query

    if (error) {
      console.error('Error fetching bids:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bids' },
        { status: 500 }
      )
    }

    // Transform data to match frontend expectations
    const transformedBids = bids?.map((bid: BidWithProject) => ({
      id: bid.id,
      projectTitle: bid.projects?.title || 'Unknown Project',
      platform: bid.projects?.source_platform || 'Unknown',
      projectUrl: bid.projects?.source_url || '#',
      bidAmount: bid.bid_amount || 0,
      bidType: 'fixed', // Default since bid_type doesn't exist in schema
      status: bid.status,
      proposalText: bid.proposal || '',
      notes: bid.notes || '',
      createdAt: bid.created_at,
      submittedAt: bid.submitted_at,
      projectId: bid.project_id
    })) || []

    return NextResponse.json(transformedBids)
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
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()

    const { data: bid, error } = await supabase
      .from('bids')
      .insert({
        project_id: body.projectId,
        user_id: user.id, // Use authenticated user's ID
        bid_amount: body.bidAmount,
        proposal: body.proposalText,
        status: body.status || 'draft',
        notes: body.notes,
        submitted_at: body.status === 'submitted' ? new Date().toISOString() : null
      })
      .select(`
        *,
        projects (
          title,
          source_platform,
          source_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating bid:', error)
      return NextResponse.json(
        { error: 'Failed to create bid' },
        { status: 500 }
      )
    }

    // Transform response
    const transformedBid = {
      id: bid.id,
      projectTitle: bid.projects?.title || 'Unknown Project',
      platform: bid.projects?.source_platform || 'Unknown',
      projectUrl: bid.projects?.source_url || '#',
      bidAmount: bid.bid_amount || 0,
      bidType: 'fixed', // Default since bid_type doesn't exist in schema
      status: bid.status,
      proposalText: bid.proposal || '',
      notes: bid.notes || '',
      createdAt: bid.created_at,
      submittedAt: bid.submitted_at,
      projectId: bid.project_id
    }

    return NextResponse.json(transformedBid, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
