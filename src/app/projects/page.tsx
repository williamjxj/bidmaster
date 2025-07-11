'use client'

import { useState, useMemo } from 'react'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, SortAsc, Loader2 } from 'lucide-react'
import { useProjects, useUpdateProject } from '@/hooks/useApi'

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Build filters for API call
  const filters = useMemo(() => {
    const result: Record<string, string | string[] | number> = {}
    
    if (selectedCategory) {
      result.category = selectedCategory
    }
    
    if (selectedStatus) {
      result.status = [selectedStatus]
    }
    
    if (searchTerm) {
      result.searchTerm = searchTerm
    }
    
    return result
  }, [selectedCategory, selectedStatus, searchTerm])

  // Fetch projects from API
  const { data: projects = [], isLoading, error } = useProjects(filters)
  const updateProjectMutation = useUpdateProject()

  // Extract categories and statuses from fetched data
  const categories = useMemo(() => 
    Array.from(new Set(projects.map(p => p.category).filter(Boolean))), 
    [projects]
  )
  const statuses = useMemo(() => 
    Array.from(new Set(projects.map(p => p.status))), 
    [projects]
  )

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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <Search className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-2">Error Loading Projects</h3>
            <p className="text-sm">
              {error instanceof Error ? error.message : 'Failed to load projects'}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Discover and manage freelance opportunities from multiple platforms
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find projects that match your skills and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects, technologies, or keywords..."
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
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-primary text-primary-foreground' : ''}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-primary text-primary-foreground' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Status:</span>
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
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `Showing ${projects.length} projects`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-1" />
            Sort
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading projects...</span>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onBookmark={handleBookmark}
              onApply={handleApply}
            />
          ))}
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more projects.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add New Project
          </Button>
        </div>
      )}
    </div>
  )
}
