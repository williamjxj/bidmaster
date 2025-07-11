'use client'

import { useState } from 'react'
import { DashboardStats, RecentActivity } from '@/components/dashboard'
import { ProjectCard, Project } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Filter, Search, Target } from 'lucide-react'

// Mock data for demonstration
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
  }
]

const mockStats = {
  totalProjects: 156,
  activeApplications: 12,
  winRate: 68,
  totalEarnings: 45600
}

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
  const [projects, setProjects] = useState<Project[]>(mockProjects)

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s an overview of your bidding activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <DashboardStats stats={mockStats} />
      </div>

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest opportunities matching your preferences</CardDescription>
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
                {projects.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onBookmark={handleBookmark}
                    onApply={handleApply}
                  />
                ))}
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
