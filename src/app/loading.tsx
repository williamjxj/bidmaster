'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Target, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  Briefcase,
  Globe,
  Star
} from 'lucide-react'

// Loading phases for better UX
const loadingPhases = [
  { 
    text: "Connecting to freelance networks...", 
    icon: Globe,
    progress: 25,
    colorClass: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  { 
    text: "Analyzing project requirements...", 
    icon: Target,
    progress: 50,
    colorClass: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  { 
    text: "Matching skilled developers...", 
    icon: Users,
    progress: 75,
    colorClass: "bg-gradient-to-r from-green-500 to-green-600"
  },
  { 
    text: "Preparing bid dashboard...", 
    icon: Briefcase,
    progress: 100,
    colorClass: "bg-gradient-to-r from-orange-500 to-orange-600"
  }
]

// Mock project data for skeleton loading
const mockProjects = [
  { platform: "Upwork", budget: "$5,000", status: "new", tech: ["React", "Node.js"] },
  { platform: "Freelancer", budget: "$3,200", status: "applied", tech: ["Vue.js", "PHP"] },
  { platform: "Toptal", budget: "$8,500", status: "in-progress", tech: ["Next.js", "Python"] }
]

export default function Loading() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading phases
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev < loadingPhases.length - 1) {
          return prev + 1
        } else {
          clearInterval(phaseInterval)
          setTimeout(() => setShowContent(true), 500)
          return prev
        }
      })
    }, 1200)

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const targetProgress = loadingPhases[currentPhase]?.progress || 0
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress)
        }
        return prev
      })
    }, 50)

    return () => {
      clearInterval(phaseInterval)
      clearInterval(progressInterval)
    }
  }, [currentPhase])

  const currentPhaseData = loadingPhases[currentPhase]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          // Use stable values based on index for SSR
          const baseX = (i * 30) % 100
          const baseY = (i * 40) % 100
          const duration = 3 + (i % 3)
          const delay = i * 0.2
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              animate={{
                x: [0, baseX, 0],
                y: [0, baseY, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay
              }}
              style={{
                left: `${(i * 15) % 100}%`,
                top: `${(i * 20) % 100}%`,
              }}
            />
          )
        })}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Main Loading Section */}
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo and Branding */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Briefcase className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BidMaster
                </h1>
                <p className="text-muted-foreground text-lg">Software Outsourcing Platform</p>
              </div>
            </div>

            {/* Dynamic Loading Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`p-3 rounded-xl ${currentPhaseData?.colorClass || 'bg-gradient-to-r from-gray-500 to-gray-600'} shadow-lg`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {currentPhaseData?.icon && (
                    <currentPhaseData.icon className="w-6 h-6 text-white" />
                  )}
                </motion.div>
                <div className="text-left">
                  <p className="text-lg font-medium text-foreground">
                    {currentPhaseData?.text || "Loading..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {progress}% complete
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${currentPhaseData?.colorClass || 'bg-gradient-to-r from-gray-500 to-gray-600'} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Skeleton Content Preview */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: showContent ? 1 : 0.7, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Target, label: "Projects", value: "2,847", bgClass: "bg-blue-100 dark:bg-blue-900/20", textClass: "text-blue-600 dark:text-blue-400" },
                { icon: TrendingUp, label: "Active Bids", value: "23", bgClass: "bg-green-100 dark:bg-green-900/20", textClass: "text-green-600 dark:text-green-400" },
                { icon: DollarSign, label: "Revenue", value: "$12.8K", bgClass: "bg-purple-100 dark:bg-purple-900/20", textClass: "text-purple-600 dark:text-purple-400" },
                { icon: Star, label: "Success Rate", value: "68%", bgClass: "bg-orange-100 dark:bg-orange-900/20", textClass: "text-orange-600 dark:text-orange-400" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-card border border-border p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgClass}`}>
                        {showContent ? (
                          <stat.icon className={`w-5 h-5 ${stat.textClass}`} />
                        ) : (
                          <Skeleton className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        {showContent ? (
                          <>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </>
                        ) : (
                          <>
                            <Skeleton className="h-4 w-16 mb-1" />
                            <Skeleton className="h-6 w-12" />
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Project Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="space-y-4">
                      {/* Project Header */}
                      <div className="flex items-center justify-between">
                        {showContent ? (
                          <>
                            <Badge className="bg-green-100 text-green-800 font-semibold">
                              {project.platform}
                            </Badge>
                            <Badge variant={project.status === 'new' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-12" />
                          </>
                        )}
                      </div>

                      {/* Project Title */}
                      {showContent ? (
                        <h3 className="font-semibold text-lg">
                          Modern Web Application Development
                        </h3>
                      ) : (
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-3/4" />
                        </div>
                      )}

                      {/* Project Details */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {showContent ? (
                          <>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {project.budget}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              2 days ago
                            </div>
                          </>
                        ) : (
                          <>
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2">
                        {showContent ? (
                          project.tech.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))
                        ) : (
                          <>
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-14" />
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {showContent ? (
                          <>
                            <div className="flex-1 h-9 bg-primary/10 rounded-md flex items-center justify-center">
                              <span className="text-sm font-medium">View Details</span>
                            </div>
                            <div className="flex-1 h-9 bg-blue-600 rounded-md flex items-center justify-center">
                              <span className="text-sm font-medium text-white">Apply Now</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Skeleton className="flex-1 h-9" />
                            <Skeleton className="flex-1 h-9" />
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Team Member Avatars */}
            <motion.div
              className="flex items-center justify-center gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <p className="text-sm text-muted-foreground">Trusted by developers worldwide</p>
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                  >
                    {showContent ? (
                      <Avatar className="w-8 h-8 border-2 border-white ring-2 ring-blue-100">
                        <AvatarFallback className="text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Skeleton className="w-8 h-8 rounded-full" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Loading Complete Animation */}
          <AnimatePresence>
            {currentPhase === loadingPhases.length - 1 && progress >= 100 && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="text-center space-y-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      scale: { duration: 0.6 },
                      rotate: { duration: 1 }
                    }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-600">Ready to Go!</h2>
                  <p className="text-muted-foreground">Welcome to your bid management dashboard</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
