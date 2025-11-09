"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { Target, Search, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Zap, Trophy, Activity } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalProjects: number
    activeApplications: number
    winRate: number
    totalEarnings: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Projects Discovered",
      value: stats.totalProjects.toLocaleString(),
      icon: Search,
      description: "Projects tracked across platforms",
      gradient: "from-blue-500 to-blue-600",
      glowColor: "shadow-blue-500/25",
      change: "+12%",
      changeType: "positive" as const,
      progress: 85,
    },
    {
      title: "Active Bids",
      value: stats.activeApplications,
      icon: Zap,
      description: "Proposals in progress",
      gradient: "from-purple-500 to-purple-600",
      glowColor: "shadow-purple-500/25",
      change: "+5",
      changeType: "positive" as const,
      progress: 67,
    },
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      icon: Trophy,
      description: "Success achievement rate",
      gradient: "from-emerald-500 to-emerald-600",
      glowColor: "shadow-emerald-500/25",
      change: "-2.1%",
      changeType: "negative" as const,
      progress: stats.winRate,
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: "Earnings from completed projects",
      gradient: "from-amber-500 to-amber-600",
      glowColor: "shadow-amber-500/25",
      change: "+18.3%",
      changeType: "positive" as const,
      progress: 92,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="fitness-card relative overflow-hidden group hover-lift animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${stat.gradient} ${stat.glowColor} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {stat.value}
                  </div>
                  <div
                    className={`flex items-center gap-1 md:gap-2 text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full ${
                      stat.changeType === "positive" 
                        ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400" 
                        : "text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                
                {/* Progress ring visual */}
                <div className="relative w-12 h-12 md:w-16 md:h-16">
                  <svg className="w-12 h-12 md:w-16 md:h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${stat.progress * 1.76} 176`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="text-primary" />
                        <stop offset="100%" className="text-secondary" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      {stat.progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.description}
                </p>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface RecentActivity {
  id: string
  type: "application" | "win" | "new_project"
  title: string
  description: string
  timestamp: string
  status?: string
}

interface RecentActivityProps {
  activities: RecentActivity[]
}

function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityConfig = (type: string) => {
    switch (type) {
      case "application":
        return {
          gradient: "from-blue-500 to-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          textColor: "text-blue-700 dark:text-blue-400",
          borderColor: "border-blue-200 dark:border-blue-800",
          icon: Target,
          emoji: "🎯"
        }
      case "win":
        return {
          gradient: "from-emerald-500 to-emerald-600",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
          textColor: "text-emerald-700 dark:text-emerald-400",
          borderColor: "border-emerald-200 dark:border-emerald-800",
          icon: Trophy,
          emoji: "🏆"
        }
      case "new_project":
        return {
          gradient: "from-purple-500 to-purple-600",
          bgColor: "bg-purple-50 dark:bg-purple-950/20",
          textColor: "text-purple-700 dark:text-purple-400",
          borderColor: "border-purple-200 dark:border-purple-800",
          icon: Zap,
          emoji: "⚡"
        }
      default:
        return {
          gradient: "from-gray-500 to-gray-600",
          bgColor: "bg-gray-50 dark:bg-gray-950/20",
          textColor: "text-gray-700 dark:text-gray-400",
          borderColor: "border-gray-200 dark:border-gray-800",
          icon: Activity,
          emoji: "📋"
        }
    }
  }

  return (
    <Card className="fitness-card">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary shadow-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <CardDescription className="text-sm font-medium">Your latest project activities</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const config = getActivityConfig(activity.type)
              const IconComponent = config.icon
              
              return (
                <div
                  key={activity.id}
                  className="group relative p-4 rounded-xl hover:bg-accent/50 transition-all duration-300 border border-border/20 hover:border-primary/20 hover:shadow-md"
                >
                  {/* Gradient accent line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient} rounded-l-xl`} />
                  
                  <div className="flex items-start gap-4 ml-2">
                    <div className={`p-3 rounded-xl ${config.bgColor} ${config.borderColor} border shadow-sm`}>
                      <IconComponent className={`h-5 w-5 ${config.textColor}`} />
                    </div>
                    
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3">
                        <Badge className={`text-xs px-3 py-1 font-bold ${config.bgColor} ${config.textColor} ${config.borderColor} border`}>
                          {config.emoji} {activity.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {activity.timestamp}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-foreground leading-tight">
                        {activity.title}
                      </h4>
                      
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        {activity.description}
                      </p>
                      
                      {activity.status && (
                        <div className="pt-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
