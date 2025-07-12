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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div
                  className={`flex items-center gap-1 text-base font-medium ${
                    stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
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
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <CardDescription className="text-base">Your latest project activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.length === 0 ? (
            <p className="text-base text-gray-500 text-center py-6">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <Badge className={`text-sm px-3 py-1 ${getActivityColor(activity.type)}`}>
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-base font-medium text-gray-900">{activity.title}</p>
                  <p className="text-base text-gray-600">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
