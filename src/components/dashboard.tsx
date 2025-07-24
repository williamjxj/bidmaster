"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Search, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"

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
      title: "Total Projects",
      value: stats.totalProjects.toLocaleString(),
      icon: Search,
      description: "Projects tracked",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Active Applications",
      value: stats.activeApplications,
      icon: Target,
      description: "Bids in progress",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+5",
      changeType: "positive" as const,
    },
    {
      title: "Win Rate",
      value: `${stats.winRate}%`,
      icon: TrendingUp,
      description: "Success rate",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "-2.1%",
      changeType: "negative" as const,
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: "From won projects",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+18.3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="relative overflow-hidden border-border/50 hover:border-border/80 transition-all duration-300 hover:shadow-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} ring-1 ring-inset ring-white/20 shadow-sm`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${
                    stat.changeType === "positive" 
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" 
                      : "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 font-medium">{stat.description}</p>
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

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "win":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "new_project":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return "📝"
      case "win":
        return "🎉"
      case "new_project":
        return "🚀"
      default:
        return "📋"
    }
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        <CardDescription className="text-base">Your latest project activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-base text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-5 p-5 rounded-xl hover:bg-gray-50/80 transition-colors duration-200 border border-transparent hover:border-border/30"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <Badge className={`text-sm px-4 py-1.5 font-medium ${getActivityColor(activity.type)}`}>
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-base text-gray-600">{activity.description}</p>
                  <p className="text-sm text-gray-500 font-medium">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
