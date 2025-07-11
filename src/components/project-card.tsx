'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, DollarSign, Calendar, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export interface Project {
  id: string
  title: string
  description: string | null
  budget: number | null
  budget_type: 'fixed' | 'hourly' | null
  source_platform: string
  source_url: string
  technologies: string[] | null
  category: string | null
  location: string | null
  posted_date: string
  deadline: string | null
  status: 'new' | 'bookmarked' | 'applied' | 'in_progress' | 'won' | 'lost' | 'archived'
  created_at: string
  updated_at: string
}

interface ProjectCardProps {
  project: Project
  onBookmark?: (projectId: string) => void
  onApply?: (projectId: string) => void
}

export function ProjectCard({ project, onBookmark, onApply }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'bookmarked':
        return 'bg-yellow-100 text-yellow-800'
      case 'applied':
        return 'bg-purple-100 text-purple-800'
      case 'in_progress':
        return 'bg-orange-100 text-orange-800'
      case 'won':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-6 mb-1">{project.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {project.source_platform}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-3">
          {project.description && (
            <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {project.budget && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>
                  ${project.budget.toLocaleString()}
                  {project.budget_type === 'hourly' && '/hr'}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.posted_date)}</span>
            </div>
            
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.technologies.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark?.(project.id)}
            className="flex-1"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Bookmark
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1"
          >
            <a href={project.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
          
          <Button
            size="sm"
            onClick={() => onApply?.(project.id)}
            className="flex-1"
          >
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
