import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all bids for stats calculation
    const { data: bids, error } = await supabase
      .from('bids')
      .select('status, bid_amount, created_at')

    if (error) {
      console.error('Error fetching bid stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bid stats' },
        { status: 500 }
      )
    }

    // Calculate stats
    const stats = {
      totalBids: bids?.length || 0,
      submitted: bids?.filter(b => b.status === 'submitted').length || 0,
      accepted: bids?.filter(b => b.status === 'accepted').length || 0,
      rejected: bids?.filter(b => b.status === 'rejected').length || 0,
      drafts: bids?.filter(b => b.status === 'draft').length || 0,
      totalBidValue: bids?.reduce((sum, b) => sum + (b.bid_amount || 0), 0) || 0,
      averageBidAmount: bids?.length ? 
        (bids.reduce((sum, b) => sum + (b.bid_amount || 0), 0) / bids.length) : 0,
      successRate: bids?.filter(b => b.status === 'submitted').length ?
        ((bids.filter(b => b.status === 'accepted').length / 
          bids.filter(b => ['submitted', 'accepted', 'rejected'].includes(b.status)).length) * 100) : 0
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
