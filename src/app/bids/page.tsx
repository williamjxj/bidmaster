'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Target, Calendar, DollarSign, ExternalLink, Edit, Trash2, Search, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useBids, useDeleteBid } from '@/hooks/useApi'

export default function BidsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Build filters for API call
  const filters = useMemo(() => {
    const result: Record<string, string | string[] | number> = {}
    
    if (selectedStatus) {
      result.status = [selectedStatus]
    }
    
    if (searchTerm) {
      result.searchTerm = searchTerm
    }
    
    return result
  }, [selectedStatus, searchTerm])

  // Fetch bids from API
  const { data: bids = [], error } = useBids(filters)
  const deleteBidMutation = useDeleteBid()

  const statuses = useMemo(() => 
    Array.from(new Set(bids.map(b => b.status))), 
    [bids]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />
      case 'submitted':
        return <Target className="h-4 w-4" />
      case 'accepted':
        return <Target className="h-4 w-4" />
      case 'rejected':
        return <Trash2 className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const handleDeleteBid = async (bidId: string) => {
    try {
      await deleteBidMutation.mutateAsync(bidId)
    } catch (error) {
      console.error('Error deleting bid:', error)
    }
  }

  const handleEditBid = (bidId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit bid:', bidId)
  }

  const stats = {
    totalBids: bids.length,
    submitted: bids.filter(b => b.status === 'submitted').length,
    accepted: bids.filter(b => b.status === 'accepted').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
    drafts: bids.filter(b => b.status === 'draft').length
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Target className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-2">Error Loading Bids</h3>
            <p className="text-sm">
              {error instanceof Error ? error.message : 'Failed to load bids'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bids & Applications</h1>
        <p className="text-gray-600">
          Track and manage all your project applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBids}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific bids or applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bids, projects, or platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStatus(null)}
                className={selectedStatus === null ? 'bg-primary text-primary-foreground' : ''}
              >
                All Status
              </Button>
              {statuses.map(status => (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? 'bg-primary text-primary-foreground' : ''}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Showing {bids.length} bids
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Bid
          </Button>
        </div>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {bids.map((bid) => (
          <Card key={bid.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{bid.projectTitle}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-2">
                    {bid.platform} • {formatDate(bid.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(bid.status)}>
                    {getStatusIcon(bid.status)}
                    <span className="ml-1">{bid.status}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      ${bid.bidAmount.toLocaleString()}
                      {bid.bidType === 'hourly' && '/hr'}
                    </span>
                  </div>
                  
                  {bid.submittedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted {formatDate(bid.submittedAt)}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{bid.proposalText}</p>
                  {bid.notes && (
                    <p className="text-xs text-gray-500 italic">Notes: {bid.notes}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBid(bid.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={bid.projectUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Project
                    </a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteBid(bid.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bids.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more bids.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Create New Bid
          </Button>
        </div>
      )}
    </div>
  )
}
