'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, DollarSign, Calendar, MapPin, Star, TrendingUp, Clock } from 'lucide-react'
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
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
      case 'bookmarked':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg'
      case 'applied':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
      case 'in_progress':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
      case 'won':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
      case 'lost':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
      case 'archived':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'upwork':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'freelancer':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'toptal':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isUrgent = project.deadline && new Date(project.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const isHighBudget = project.budget && project.budget > 5000

  return (
    <Card className="h-full group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      {/* Urgent indicator */}
      {isUrgent && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-6 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getPlatformColor(project.source_platform)} font-medium`}>
                {project.source_platform}
              </Badge>
              {isHighBudget && (
                <Badge variant="outline" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-none">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
          <Badge className={`${getStatusColor(project.status)} font-medium`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 relative">
        <div className="space-y-4">
          {project.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {project.budget && (
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <DollarSign className="h-3 w-3 text-green-600" />
                </div>
                <span className="font-semibold text-green-800 dark:text-green-400">
                  ${project.budget.toLocaleString()}
                  {project.budget_type === 'hourly' && '/hr'}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="p-1 bg-blue-500/20 rounded-full">
                <Calendar className="h-3 w-3 text-blue-600" />
              </div>
              <span className="font-medium text-blue-800 dark:text-blue-400">
                {formatDate(project.posted_date)}
              </span>
            </div>
            
            {project.location && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="p-1 bg-purple-500/20 rounded-full">
                  <MapPin className="h-3 w-3 text-purple-600" />
                </div>
                <span className="font-medium text-purple-800 dark:text-purple-400">
                  {project.location}
                </span>
              </div>
            )}

            {project.deadline && (
              <div className={`flex items-center gap-2 p-2 rounded-lg ${isUrgent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <div className={`p-1 rounded-full ${isUrgent ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                  <Clock className={`h-3 w-3 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
                </div>
                <span className={`font-medium ${isUrgent ? 'text-red-800 dark:text-red-400' : 'text-orange-800 dark:text-orange-400'}`}>
                  {formatDate(project.deadline)}
                </span>
              </div>
            )}
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-700 transition-all duration-200">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 5 && (
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700">
                  +{project.technologies.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 bg-gray-50/50 dark:bg-gray-800/50 relative">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark?.(project.id)}
            className="flex-1 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 dark:hover:bg-yellow-900/20 dark:hover:border-yellow-600 dark:hover:text-yellow-400 transition-all duration-200"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Bookmark
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all duration-200"
          >
            <a href={project.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
          
          <Button
            size="sm"
            onClick={() => onApply?.(project.id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
