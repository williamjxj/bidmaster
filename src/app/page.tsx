'use client'

import { DashboardStats, RecentActivity } from '@/components/dashboard'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Filter, Search, Target } from 'lucide-react'
import { useDashboard, useUpdateProject } from '@/hooks/useApi'
import { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

// Mock activities for now - in production, you'd fetch these from a database
const mockActivities = [
  {
    id: '1',
    type: 'application' as const,
    title: 'Applied to React E-commerce Project',
    description: 'Submitted proposal for $2,500 project',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'win' as const,
    title: 'Won Node.js API Project',
    description: 'Congratulations! You won the $1,800 project',
    timestamp: '1 day ago'
  },
  {
    id: '3',
    type: 'new_project' as const,
    title: 'New AI Project Added',
    description: 'AI Image Generation Tool matches your preferences',
    timestamp: '2 days ago'
  }
]

export default function Home() {
  const { data: dashboardData, isLoading, error } = useDashboard()
  const updateProjectMutation = useUpdateProject()

  const handleBookmark = async (projectId: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        updates: { status: 'bookmarked' }
      })
    } catch (error) {
      console.error('Error bookmarking project:', error)
    }
  }

  const handleApply = async (projectId: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        updates: { status: 'applied' }
      })
    } catch (error) {
      console.error('Error applying to project:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Loading your dashboard data...</p>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">
              Error loading dashboard data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { stats, recentProjects } = dashboardData || { stats: null, recentProjects: [] }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s an overview of your bidding activities.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>
      )}

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest opportunities from your connected platforms</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Project
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects && recentProjects.length > 0 ? (
                  recentProjects.slice(0, 3).map((project: Project) => (
                    <ProjectCard
                      key={project.id}
                      project={{
                        id: project.id,
                        title: project.title,
                        description: project.description,
                        budget: project.budget,
                        budget_type: project.budget_type,
                        source_platform: project.source_platform,
                        source_url: project.source_url,
                        technologies: project.technologies,
                        category: project.category,
                        location: project.location,
                        posted_date: project.posted_date,
                        deadline: project.deadline,
                        status: project.status,
                        created_at: project.created_at,
                        updated_at: project.updated_at
                      }}
                      onBookmark={handleBookmark}
                      onApply={handleApply}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your platforms to start discovering projects.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Platform
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <RecentActivity activities={mockActivities} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex-col">
              <Search className="h-6 w-6 mb-2" />
              <span className="font-medium">Browse Projects</span>
              <span className="text-xs text-muted-foreground">Find new opportunities</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Target className="h-6 w-6 mb-2" />
              <span className="font-medium">Track Bids</span>
              <span className="text-xs text-muted-foreground">Monitor applications</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              <span className="font-medium">Add Source</span>
              <span className="text-xs text-muted-foreground">Configure new platforms</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
