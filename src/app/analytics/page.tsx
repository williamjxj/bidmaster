'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  PieChart,
  Activity,
  Star,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Globe
} from 'lucide-react'
import { useProjectStats, useBidStats } from '@/hooks/useApi'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const { data: projectStats, isLoading: projectStatsLoading } = useProjectStats()
  const { data: bidStats, isLoading: bidStatsLoading } = useBidStats()

  const timeRangeOptions = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: '1y', label: '1 year' },
  ]

  const isLoading = projectStatsLoading || bidStatsLoading

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const performanceMetrics = [
    {
      title: "Total Projects",
      value: projectStats?.totalProjects || 0,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive" as const,
      description: "Active opportunities"
    },
    {
      title: "Total Bids",
      value: bidStats?.totalBids || 0,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      change: "+8%",
      changeType: "positive" as const,
      description: "Applications submitted"
    },
    {
      title: "Win Rate",
      value: `${bidStats?.successRate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "-2.1%",
      changeType: "negative" as const,
      description: "Success percentage"
    },
    {
      title: "Total Earnings",
      value: `$${bidStats?.totalEarnings?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+18.3%",
      changeType: "positive" as const,
      description: "From accepted bids"
    },
    {
      title: "Average Bid",
      value: `$${bidStats?.averageBidAmount?.toLocaleString() || 0}`,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5.7%",
      changeType: "positive" as const,
      description: "Per application"
    },
    {
      title: "Average Budget",
      value: `$${projectStats?.averageBudget?.toLocaleString() || 0}`,
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+3.2%",
      changeType: "positive" as const,
      description: "Project budgets"
    }
  ]

  const statusBreakdown = [
    { status: 'New', count: projectStats?.new || 0, color: 'bg-blue-100 text-blue-800' },
    { status: 'Bookmarked', count: projectStats?.bookmarked || 0, color: 'bg-yellow-100 text-yellow-800' },
    { status: 'Applied', count: projectStats?.applied || 0, color: 'bg-purple-100 text-purple-800' },
    { status: 'Won', count: projectStats?.won || 0, color: 'bg-green-100 text-green-800' },
    { status: 'Lost', count: projectStats?.lost || 0, color: 'bg-red-100 text-red-800' },
  ]

  const bidBreakdown = [
    { status: 'Draft', count: bidStats?.drafts || 0, color: 'bg-gray-100 text-gray-800' },
    { status: 'Submitted', count: bidStats?.submitted || 0, color: 'bg-blue-100 text-blue-800' },
    { status: 'Accepted', count: bidStats?.accepted || 0, color: 'bg-green-100 text-green-800' },
    { status: 'Rejected', count: bidStats?.rejected || 0, color: 'bg-red-100 text-red-800' },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-description">Performance insights and trends</p>
          </div>
          <div className="flex gap-2">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-container">

        {/* Key Performance Metrics */}
        <div className="panel-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.title} className="stat-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base font-medium text-gray-600">{metric.title}</CardTitle>
                    <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        metric.changeType === "positive" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {metric.changeType === "positive" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Project Status Breakdown
              </CardTitle>
              <CardDescription>Distribution of project statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusBreakdown.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <Badge className={item.color}>{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bid Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Bid Status Breakdown
              </CardTitle>
              <CardDescription>Distribution of bid statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bidBreakdown.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <Badge className={item.color}>{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Insights
              </CardTitle>
              <CardDescription>Key recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Great Progress</span>
                  </div>
                  <p className="text-sm text-emerald-800">
                    You&apos;re actively tracking {projectStats?.totalProjects || 0} projects and have submitted {bidStats?.totalBids || 0} bids.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Opportunity</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Focus on converting more bookmarked projects to applications to improve your pipeline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Activity Summary
              </CardTitle>
              <CardDescription>Recent activity highlights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Total Projects</p>
                    <p className="text-sm text-blue-700">Available opportunities</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{projectStats?.totalProjects || 0}</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-900">Active Bids</p>
                    <p className="text-sm text-purple-700">Pending applications</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{bidStats?.submitted || 0}</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-medium text-emerald-900">Success Rate</p>
                    <p className="text-sm text-emerald-700">Win percentage</p>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{bidStats?.successRate?.toFixed(1) || 0}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}
