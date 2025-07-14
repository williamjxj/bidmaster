'use client'

import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Target, Calendar, DollarSign, ExternalLink, Edit, Trash2, Search, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useBids, useDeleteBid } from '@/hooks/useApi'

interface Bid {
  id: string
  status: string
  projectTitle: string
  platform: string
  bidAmount: number
  bidType?: string
  submittedAt?: string
  createdAt: string
  projectUrl?: string
  proposalText?: string
  notes?: string
}

// Simple Bids View
function SimpleBidsView({ bids, onDelete }: { bids: Bid[], onDelete: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredBids = useMemo(() => {
    if (!searchTerm) return bids
    return bids.filter(bid => 
      bid.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.platform.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [bids, searchTerm])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Simple Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bids</CardTitle>
          <CardDescription>Find your submitted proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Simple Bids List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBids.length} bids
          </p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Bid
          </Button>
        </div>

        {filteredBids.map((bid) => (
          <Card key={bid.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{bid.projectTitle}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {bid.platform}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${bid.bidAmount.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(bid.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => onDelete(bid.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBids.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bids found</h3>
            <p className="text-muted-foreground">
              Start by creating your first bid proposal.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Bids View (existing complex implementation)
function EnhancedBidsView({ bids, onDelete }: { bids: Bid[], onDelete: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const statuses = useMemo(() => 
    Array.from(new Set(bids.map((b: Bid) => b.status))) as string[], 
    [bids]
  )

  const filteredBids = useMemo(() => {
    let filtered = bids

    if (searchTerm) {
      filtered = filtered.filter(bid => 
        bid.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.platform.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(bid => bid.status === selectedStatus)
    }

    return filtered
  }, [bids, searchTerm, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Advanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Filter your bids by status and search terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by project title or platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStatus(null)}
              className={!selectedStatus ? 'bg-primary text-primary-foreground' : ''}
            >
              All Status
            </Button>
            {statuses.map((status) => (
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
        </CardContent>
      </Card>

      {/* Results and Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBids.length} of {bids.length} bids
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Bid
          </Button>
        </div>
      </div>

      {/* Enhanced Bids Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBids.map((bid) => (
          <Card key={bid.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(bid.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-2">
                    {bid.projectTitle}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      {bid.platform}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${bid.bidAmount.toLocaleString()}
                      {bid.bidType && (
                        <span className="ml-1">({bid.bidType})</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(bid.createdAt)}
                    </div>
                  </div>
                </div>

                {bid.proposalText && (
                  <div className="text-sm">
                    <p className="line-clamp-3 text-muted-foreground">
                      {bid.proposalText}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  {bid.projectUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={bid.projectUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBids.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No bids found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedStatus 
              ? "Try adjusting your search terms or filters."
              : "Start by creating your first bid proposal."
            }
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

export default function BidsPage() {
  // Build filters for API call
  const filters = useMemo(() => {
    const result: Record<string, string | string[] | number> = {}
    return result
  }, [])

  // Fetch bids from API
  const { data: bids = [], error } = useBids(filters)
  const deleteBidMutation = useDeleteBid()

  const handleDelete = async (bidId: string) => {
    if (confirm('Are you sure you want to delete this bid?')) {
      try {
        await deleteBidMutation.mutateAsync(bidId)
      } catch (error) {
        console.error('Failed to delete bid:', error)
      }
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Bids</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bids</h1>
        <p className="page-description">Track and manage your bid submissions</p>
      </div>
      
      <div className="tabs-container">
        <Tabs defaultValue="enhanced" className="w-full">
          <div className="tabs-header">
            <TabsList className="tabs-nav w-full max-w-md">
              <TabsTrigger value="simple" className="tabs-trigger flex-1">
                Simple View
              </TabsTrigger>
              <TabsTrigger value="enhanced" className="tabs-trigger flex-1">
                Enhanced View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="simple" className="tabs-content">
            <SimpleBidsView bids={bids} onDelete={handleDelete} />
          </TabsContent>
          
          <TabsContent value="enhanced" className="tabs-content">
            <EnhancedBidsView bids={bids} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
