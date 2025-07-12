import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/database'

type BidUpdate = Database['public']['Tables']['bids']['Update']

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: bid, error } = await supabase
      .from('bids')
      .select(`
        *,
        projects (
          title,
          source_platform,
          source_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching bid:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bid' },
        { status: 500 }
      )
    }

    if (!bid) {
      return NextResponse.json(
        { error: 'Bid not found' },
        { status: 404 }
      )
    }

    // Transform data to match frontend expectations
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

    return NextResponse.json(transformedBid)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const updateData: BidUpdate = {}
    
    if (body.bidAmount !== undefined) updateData.bid_amount = body.bidAmount
    if (body.proposalText !== undefined) updateData.proposal = body.proposalText
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === 'submitted' && !updateData.submitted_at) {
        updateData.submitted_at = new Date().toISOString()
      }
    }
    if (body.notes !== undefined) updateData.notes = body.notes

    const { data: bid, error } = await supabase
      .from('bids')
      .update(updateData)
      .eq('id', id)
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
      console.error('Error updating bid:', error)
      return NextResponse.json(
        { error: 'Failed to update bid' },
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

    return NextResponse.json(transformedBid)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { error } = await supabase
      .from('bids')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bid:', error)
      return NextResponse.json(
        { error: 'Failed to delete bid' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
