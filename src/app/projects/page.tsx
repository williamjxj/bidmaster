'use client'

import { useState } from 'react'
import { ProjectCard, Project } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, SortAsc } from 'lucide-react'

// Extended mock data for projects page
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'React E-commerce Website Development',
    description: 'Looking for an experienced React developer to build a modern e-commerce platform with Next.js, TypeScript, and Tailwind CSS. The project includes user authentication, payment integration, and admin dashboard.',
    budget: 2500,
    budget_type: 'fixed',
    source_platform: 'Upwork',
    source_url: 'https://upwork.com/job/1',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    category: 'Web Development',
    location: 'Remote',
    posted_date: '2024-01-15T10:00:00Z',
    deadline: '2024-02-15T10:00:00Z',
    status: 'new',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'AI Image Generation Tool',
    description: 'Need a skilled developer to create an AI-powered image generation tool using OpenAI API. Must have experience with Python, Flask, and machine learning.',
    budget: 75,
    budget_type: 'hourly',
    source_platform: 'Freelancer',
    source_url: 'https://freelancer.com/job/2',
    technologies: ['Python', 'Flask', 'OpenAI API', 'Machine Learning'],
    category: 'AI Development',
    location: 'Remote',
    posted_date: '2024-01-14T14:30:00Z',
    deadline: null,
    status: 'bookmarked',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Node.js API Development',
    description: 'Building a RESTful API with Node.js, Express, and MongoDB. Need someone with experience in authentication, database design, and API documentation.',
    budget: 1800,
    budget_type: 'fixed',
    source_platform: 'Toptal',
    source_url: 'https://toptal.com/job/3',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    category: 'Backend Development',
    location: 'US Only',
    posted_date: '2024-01-13T09:15:00Z',
    deadline: '2024-02-10T09:15:00Z',
    status: 'applied',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Mobile App Development with React Native',
    description: 'Looking for a React Native developer to build a cross-platform mobile app for iOS and Android. Features include real-time messaging, push notifications, and offline functionality.',
    budget: 3200,
    budget_type: 'fixed',
    source_platform: 'Upwork',
    source_url: 'https://upwork.com/job/4',
    technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    category: 'Mobile Development',
    location: 'Remote',
    posted_date: '2024-01-12T16:45:00Z',
    deadline: '2024-02-25T16:45:00Z',
    status: 'new',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: 'WordPress Custom Theme Development',
    description: 'Need a WordPress developer to create a custom theme for a corporate website. Must be responsive, SEO-optimized, and include custom post types.',
    budget: 45,
    budget_type: 'hourly',
    source_platform: 'Freelancer',
    source_url: 'https://freelancer.com/job/5',
    technologies: ['WordPress', 'PHP', 'HTML/CSS', 'JavaScript'],
    category: 'Web Development',
    location: 'Remote',
    posted_date: '2024-01-11T11:20:00Z',
    deadline: '2024-02-05T11:20:00Z',
    status: 'new',
    created_at: '2024-01-11T11:20:00Z',
    updated_at: '2024-01-11T11:20:00Z'
  },
  {
    id: '6',
    title: 'Machine Learning Model for Predictive Analytics',
    description: 'Seeking an ML engineer to develop a predictive model for customer behavior analysis. Experience with Python, scikit-learn, and TensorFlow required.',
    budget: 4500,
    budget_type: 'fixed',
    source_platform: 'Toptal',
    source_url: 'https://toptal.com/job/6',
    technologies: ['Python', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'],
    category: 'AI Development',
    location: 'Remote',
    posted_date: '2024-01-10T08:30:00Z',
    deadline: '2024-03-01T08:30:00Z',
    status: 'bookmarked',
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-10T08:30:00Z'
  }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)))
  const statuses = Array.from(new Set(projects.map(p => p.status)))

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || project.category === selectedCategory
    const matchesStatus = !selectedStatus || project.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleBookmark = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: 'bookmarked' as const }
          : project
      )
    )
  }

  const handleApply = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: 'applied' as const }
          : project
      )
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
            Showing {filteredProjects.length} of {projects.length} projects
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
