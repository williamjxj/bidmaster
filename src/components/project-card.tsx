'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Bookmark, DollarSign, Calendar, MapPin, Star, TrendingUp, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Project {
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
    <Card className="fitness-card h-full group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:rotate-1 hover-lift animate-fade-in">
      {/* Fitness-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30" />
      
      {/* Energy indicator */}
      {isUrgent && (
        <div className="absolute top-4 right-4 z-20">
          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full pulse-glow" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/20 rounded-full animate-ping" />
        </div>
      )}
      
      {/* Fitness-style floating elements */}
      <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-sm animate-float" />
      <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-secondary/10 to-amber-500/10 rounded-full blur-sm animate-float" style={{animationDelay: '1.5s'}} />
      
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-amber-500" />
      
      <CardHeader className="pb-6 relative z-10 pt-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg md:text-xl font-black tracking-tight leading-tight mb-3 group-hover:text-gradient group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all duration-500">
                {project.title}
              </CardTitle>
            </div>
            <Badge className={`${getStatusColor(project.status)} font-black text-xs px-3 py-2 shadow-lg`}>
              {project.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={`${getPlatformColor(project.source_platform)} font-black text-xs px-4 py-2 hover:scale-105 transition-all duration-200 shadow-md border-0`}>
              💼 {project.source_platform}
            </Badge>
            {isHighBudget && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-xs px-4 py-2 shadow-lg border-0 pulse-glow">
                <Star className="w-3 h-3 mr-1.5" />
                PREMIUM
              </Badge>
            )}
            {project.category && (
              <Badge variant="outline" className="font-bold text-xs px-3 py-1.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                {project.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-5 relative z-10">
        <div className="space-y-6">
          {project.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed font-medium">
              {project.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {project.budget && (
              <div className="bg-card border border-border rounded-lg bg-green-50 dark:bg-green-900/20 p-3 hover:shadow-md transition-all duration-200">
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
            
            <div className="bg-card border border-border rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 hover:shadow-md transition-all duration-200">
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
              <div className="bg-card border border-border rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 hover:-translate-y-0.5 transition-all duration-200">
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
              <div className={`bg-card border border-border rounded-lg p-3 transition-all duration-200 ${isUrgent ? 'bg-red-50 dark:bg-red-900/20 hover:shadow-lg' : 'bg-orange-50 dark:bg-orange-900/20 hover:shadow-md'}`}>
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
            <div className="flex flex-wrap gap-3">
              {project.technologies.slice(0, 5).map((tech, index) => (
                <Badge 
                  key={tech} 
                  className="text-xs bg-secondary/80 backdrop-blur-sm border-secondary/50 hover:bg-secondary hover:-translate-y-0.5 transition-all duration-200 font-medium px-3 py-1.5" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 5 && (
                <Badge className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium px-3 py-1.5">
                  +{project.technologies.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-5 bg-card/50 backdrop-blur-sm relative">
        <div className="flex gap-4 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark?.(project.id)}
            className="flex-1 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:-translate-y-0.5 transition-all duration-300"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 transition-all duration-300"
          >
            <a href={project.source_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </a>
          </Button>
          
          <Button
            size="sm"
            onClick={() => onApply?.(project.id)}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-semibold animate-button-press hover-glow"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
