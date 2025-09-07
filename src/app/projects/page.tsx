'use client'

import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsTable, Project as TableProject } from '@/components/projects-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, SortAsc, Loader2, LayoutGrid, List, Target } from 'lucide-react'
import { useProjects, useUpdateProject } from '@/hooks/useApi'
import { ProjectCard } from '@/components/project-card'

interface APIProject {
  id: string
  category: string | null
  status: 'bookmarked' | 'applied' | 'new' | 'in_progress' | 'won' | 'lost' | 'archived'
  title: string
  description: string | null
  budget: number | null
  budget_type: 'fixed' | 'hourly' | null
  source_platform: string
  source_url: string
  technologies: string[] | null
  location: string | null
  posted_date: string
  created_at: string
  deadline: string | null
  updated_at: string
}

// Original Simple Projects View
function OriginalProjectsView({ projects, handleBookmark, handleApply, isLoading, error }: {
  projects: APIProject[]
  handleBookmark: (id: string) => void
  handleApply: (id: string) => void
  isLoading: boolean
  error: Error | null
}) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [projects, searchTerm])

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Simple Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Projects</CardTitle>
          <CardDescription>Find freelance opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      )}

      {/* Simple Grid View */}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} projects
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onBookmark={handleBookmark}
                onApply={handleApply}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms to find more projects.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Enhanced Projects View (existing implementation)
function EnhancedProjectsView({ projects, handleBookmark, handleApply, isLoading, error, tableProjects }: {
  projects: APIProject[]
  handleBookmark: (id: string) => void
  handleApply: (id: string) => void
  isLoading: boolean
  error: Error | null
  tableProjects: TableProject[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const categories = useMemo(() =>
    Array.from(new Set(projects.map((p: APIProject) => p.category).filter(Boolean))) as string[],
    [projects]
  )

  const statuses = ['new', 'applied', 'in_progress', 'won', 'lost']

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>Find projects matching your criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={!selectedCategory ? 'bg-primary text-primary-foreground' : ''}
            >
              All Categories
            </Button>
            {categories.map((category) => (
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

          {/* Status Filter */}
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
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
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <>
          {viewMode === 'table' ? (
            <ProjectsTable data={tableProjects} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project: APIProject) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onBookmark={handleBookmark}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find more projects.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add New Project
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  // Build filters for API call
  const filters = useMemo(() => {
    const result: Record<string, string | string[] | number> = {}
    return result
  }, [])

  const { data: projects = [], isLoading, error } = useProjects(filters)
  const updateProjectMutation = useUpdateProject()

  // Convert API projects to table format
  const tableProjects: TableProject[] = useMemo(() => {
    return projects.map((project: APIProject) => ({
      id: project.id,
      title: project.title,
      platform: project.source_platform,
      budget: project.budget || 0,
      budgetType: (project.budget_type as 'fixed' | 'hourly') || 'fixed',
      technologies: project.technologies || [],
      postedDate: project.posted_date,
      status: project.status === 'bookmarked' ? 'new' : project.status === 'applied' ? 'applied' : 
              project.status === 'in_progress' ? 'in_progress' : 'new'
    }))
  }, [projects])

  const handleBookmark = async (projectId: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        updates: { status: 'bookmarked' }
      })
    } catch (error) {
      console.error('Failed to bookmark project:', error)
    }
  }

  const handleApply = async (projectId: string) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        updates: { status: 'applied' }
      })
    } catch (error) {
      console.error('Failed to update project status:', error)
    }
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
                <Search className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Project Discovery
                </h1>
                <p className="text-base text-muted-foreground font-medium">
                  Find your next opportunity and level up! 🚀
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-md">
                <Target className="w-4 h-4 mr-2" />
                {projects?.length || 0} Opportunities
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm font-bold">
                🔥 Updated: Live
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <Tabs defaultValue="enhanced" className="w-full">
          <div className="flex items-center justify-between mb-8">
            <TabsList className="w-full max-w-lg bg-muted/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl p-1">
              <TabsTrigger value="original" className="flex-1 rounded-xl font-bold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg">
                🚀 Quick View
              </TabsTrigger>
              <TabsTrigger value="enhanced" className="flex-1 rounded-xl font-bold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg">
                💪 Power View
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="original" className="tabs-content">
            <OriginalProjectsView 
              projects={projects}
              handleBookmark={handleBookmark}
              handleApply={handleApply}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="enhanced" className="tabs-content">
            <EnhancedProjectsView 
              projects={projects}
              handleBookmark={handleBookmark}
              handleApply={handleApply}
              isLoading={isLoading}
              error={error}
              tableProjects={tableProjects}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
