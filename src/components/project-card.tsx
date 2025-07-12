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
    <Card className="h-full group card-floating hover-lift-strong border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden animate-slide-up">
      {/* Modern glass background */}
      <div className="absolute inset-0 glass-card opacity-30" />
      
      {/* Urgent indicator with enhanced animation */}
      {isUrgent && (
        <div className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full animate-heartbeat" />
      )}
      
      {/* Modern floating elements with blur */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-morph backdrop-blur-sm"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-breathe backdrop-blur-sm" style={{animationDelay: '1s'}}></div>
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl leading-7 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 font-bold">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-3 mb-3">
              <Badge className={`${getPlatformColor(project.source_platform)} font-semibold hover-lift-gentle animate-scale-in px-3 py-1`}>
                {project.source_platform}
              </Badge>
              {isHighBudget && (
                <Badge className="neo-card bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-none animate-glow px-3 py-1">
                  <Star className="w-3 h-3 mr-1 animate-wiggle" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
          <Badge className={`${getStatusColor(project.status)} font-semibold animate-pulse px-3 py-1`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 relative z-10">
        <div className="space-y-5">
          {project.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed font-medium">
              {project.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {project.budget && (
              <div className="neo-card bg-green-50 dark:bg-green-900/20 p-3 hover-glow-primary">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl animate-breathe">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-bold text-green-800 dark:text-green-400">
                    ${project.budget.toLocaleString()}
                    {project.budget_type === 'hourly' && '/hr'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="neo-card bg-blue-50 dark:bg-blue-900/20 p-3 hover-glow-accent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl animate-breathe">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-semibold text-blue-800 dark:text-blue-400">
                  {formatDate(project.posted_date)}
                </span>
              </div>
            </div>
            
            {project.location && (
              <div className="neo-card bg-purple-50 dark:bg-purple-900/20 p-3 hover-lift-gentle">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl animate-breathe">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-purple-800 dark:text-purple-400">
                    {project.location}
                  </span>
                </div>
              </div>
            )}

            {project.deadline && (
              <div className={`neo-card p-3 ${isUrgent ? 'bg-red-50 dark:bg-red-900/20 hover-glow-primary' : 'bg-orange-50 dark:bg-orange-900/20 hover-glow-accent'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl animate-breathe ${isUrgent ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                    <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
                  </div>
                  <span className={`font-semibold ${isUrgent ? 'text-red-800 dark:text-red-400' : 'text-orange-800 dark:text-orange-400'}`}>
                    {formatDate(project.deadline)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((tech, index) => (
                <Badge 
                  key={tech} 
                  className="text-xs btn-glass hover-lift-gentle animate-scale-in font-medium" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 5 && (
                <Badge className="text-xs btn-gradient animate-scale-in font-medium">
                  +{project.technologies.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 glass-card relative">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark?.(project.id)}
            className="flex-1 btn-glass hover-glow-accent hover-lift-gentle transition-all duration-300"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 btn-glass hover-glow-primary hover-lift-gentle transition-all duration-300"
          >
            <a href={project.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </a>
          </Button>
          
          <Button
            size="sm"
            onClick={() => onApply?.(project.id)}
            className="flex-1 btn-gradient hover-lift-gentle animate-glow font-semibold"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
