'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Search, TrendingUp, DollarSign } from 'lucide-react'

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
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Search,
      description: 'Projects tracked',
      color: 'text-blue-600'
    },
    {
      title: 'Active Applications',
      value: stats.activeApplications,
      icon: Target,
      description: 'Bids in progress',
      color: 'text-purple-600'
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate}%`,
      icon: TrendingUp,
      description: 'Success rate',
      color: 'text-green-600'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      description: 'From won projects',
      color: 'text-emerald-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface RecentActivity {
  id: string
  type: 'application' | 'win' | 'new_project'
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
      case 'application':
        return 'bg-blue-100 text-blue-800'
      case 'win':
        return 'bg-green-100 text-green-800'
      case 'new_project':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest project activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Badge className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
