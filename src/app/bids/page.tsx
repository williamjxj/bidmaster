'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Target, Calendar, DollarSign, ExternalLink, Edit, Trash2, Search, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Bid {
  id: string
  projectTitle: string
  projectId: string
  bidAmount: number
  bidType: 'fixed' | 'hourly'
  proposalText: string
  status: 'draft' | 'submitted' | 'accepted' | 'rejected'
  submittedAt: string | null
  projectUrl: string
  platform: string
  notes: string
  createdAt: string
  updatedAt: string
}

// Mock data for bids
const mockBids: Bid[] = [
  {
    id: '1',
    projectTitle: 'React E-commerce Website Development',
    projectId: '1',
    bidAmount: 2400,
    bidType: 'fixed',
    proposalText: 'I have extensive experience building e-commerce platforms with React, Next.js, and TypeScript. I can deliver a modern, responsive website with payment integration and admin dashboard within the specified timeframe.',
    status: 'submitted',
    submittedAt: '2024-01-15T14:30:00Z',
    projectUrl: 'https://upwork.com/job/1',
    platform: 'Upwork',
    notes: 'Client seems responsive, good project scope',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    projectTitle: 'AI Image Generation Tool',
    projectId: '2',
    bidAmount: 70,
    bidType: 'hourly',
    proposalText: 'I specialize in AI development and have worked with OpenAI API extensively. I can create a robust image generation tool with a user-friendly interface.',
    status: 'draft',
    submittedAt: null,
    projectUrl: 'https://freelancer.com/job/2',
    platform: 'Freelancer',
    notes: 'Need to research more about their specific requirements',
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z'
  },
  {
    id: '3',
    projectTitle: 'Node.js API Development',
    projectId: '3',
    bidAmount: 1750,
    bidType: 'fixed',
    proposalText: 'I have 5+ years of experience with Node.js and Express. I can build a secure, scalable API with comprehensive documentation and testing.',
    status: 'accepted',
    submittedAt: '2024-01-13T10:00:00Z',
    projectUrl: 'https://toptal.com/job/3',
    platform: 'Toptal',
    notes: 'Won the project! Starting next week',
    createdAt: '2024-01-13T09:30:00Z',
    updatedAt: '2024-01-13T18:00:00Z'
  },
  {
    id: '4',
    projectTitle: 'Mobile App Development with React Native',
    projectId: '4',
    bidAmount: 3000,
    bidType: 'fixed',
    proposalText: 'I have successfully delivered 10+ React Native apps with real-time features. I can implement the messaging system and push notifications as required.',
    status: 'rejected',
    submittedAt: '2024-01-12T17:00:00Z',
    projectUrl: 'https://upwork.com/job/4',
    platform: 'Upwork',
    notes: 'Client chose someone else, feedback was positive though',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T20:00:00Z'
  }
]

export default function BidsPage() {
  const [bids, setBids] = useState<Bid[]>(mockBids)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const statuses = Array.from(new Set(bids.map(b => b.status)))
  
  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.proposalText.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || bid.status === selectedStatus

    return matchesSearch && matchesStatus
  })

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

  const handleDeleteBid = (bidId: string) => {
    setBids(prevBids => prevBids.filter(bid => bid.id !== bidId))
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
            Showing {filteredBids.length} of {bids.length} bids
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
        {filteredBids.map((bid) => (
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

      {filteredBids.length === 0 && (
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
