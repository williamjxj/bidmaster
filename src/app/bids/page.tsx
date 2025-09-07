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

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': 
        return {
          gradient: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          emoji: '🚀'
        }
      case 'accepted': 
        return {
          gradient: 'from-emerald-500 to-green-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          emoji: '🏆'
        }
      case 'rejected': 
        return {
          gradient: 'from-red-500 to-rose-500',
          bg: 'bg-red-50 dark:bg-red-950/20',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          emoji: '💪'
        }
      case 'withdrawn': 
        return {
          gradient: 'from-gray-500 to-slate-500',
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          emoji: '⏸️'
        }
      default: 
        return {
          gradient: 'from-blue-500 to-indigo-500',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          emoji: '⚡'
        }
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
                  {(() => {
                    const config = getStatusConfig(bid.status)
                    return (
                      <Badge className={`${config.bg} ${config.text} ${config.border} border font-black px-3 py-1.5 shadow-sm`}>
                        {config.emoji} {bid.status}
                      </Badge>
                    )
                  })()}
                  <Button variant="outline" size="sm" onClick={() => onDelete(bid.id)} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
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

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': 
        return {
          gradient: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          emoji: '🚀'
        }
      case 'accepted': 
        return {
          gradient: 'from-emerald-500 to-green-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          emoji: '🏆'
        }
      case 'rejected': 
        return {
          gradient: 'from-red-500 to-rose-500',
          bg: 'bg-red-50 dark:bg-red-950/20',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          emoji: '💪'
        }
      case 'withdrawn': 
        return {
          gradient: 'from-gray-500 to-slate-500',
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          emoji: '⏸️'
        }
      default: 
        return {
          gradient: 'from-blue-500 to-indigo-500',
          bg: 'bg-blue-50 dark:bg-blue-950/20',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          emoji: '⚡'
        }
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
        {filteredBids.map((bid) => {
          const statusConfig = getStatusConfig(bid.status)
          return (
            <Card key={bid.id} className="fitness-card group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${statusConfig.gradient}`} />
              
              <CardContent className="p-6 pt-8">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border font-black px-4 py-2 shadow-lg`}>
                      {statusConfig.emoji} {bid.status}
                    </Badge>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(bid.id)} className="hover:bg-red-50 hover:text-red-600">
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
    <div className="flex-1 space-y-8 bg-background min-h-full">
      {/* Fitness-style header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background rounded-3xl p-8 border border-border/50">
        {/* Animated background elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary/5 rounded-full blur-lg animate-pulse delay-500" />
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-xl">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Bid Tracker
                </h1>
                <p className="text-base text-muted-foreground font-medium">
                  Track your proposals and crush your goals! 🎯
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-md">
                <Target className="w-4 h-4 mr-2" />
                {bids?.length || 0} Active Bids
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm font-bold">
                🔥 Performance Mode: ON
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="enhanced" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="w-full max-w-lg bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl p-1">
              <TabsTrigger value="simple" className="flex-1 rounded-xl font-bold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg">
                🎯 Quick Track
              </TabsTrigger>
              <TabsTrigger value="enhanced" className="flex-1 rounded-xl font-bold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg">
                💪 Power Track
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
