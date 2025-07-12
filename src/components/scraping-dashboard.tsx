'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Activity, Clock, CheckCircle } from 'lucide-react'

interface ScrapingStats {
  platform: string
  total_runs: number
  successful_runs: number
  total_projects_found: number
  total_projects_saved: number
  avg_execution_time_ms: number
  last_run: string
}

export function ScrapingDashboard() {
  const [stats, setStats] = useState<ScrapingStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/scrape/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || [])
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch scraping stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const totalProjects = stats.reduce((sum, stat) => sum + stat.total_projects_saved, 0)
  const totalRuns = stats.reduce((sum, stat) => sum + stat.total_runs, 0)
  const successRate = totalRuns > 0 ? Math.round((stats.reduce((sum, stat) => sum + stat.successful_runs, 0) / totalRuns) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scraping Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor web scraping activities and performance
          </p>
        </div>
        <Button onClick={fetchStats} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projects scraped (last 7 days)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRuns}</div>
            <p className="text-xs text-muted-foreground">
              Scraping executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Successful scraping runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Platforms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.length}</div>
            <p className="text-xs text-muted-foreground">
              Platforms being scraped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Detailed statistics for each scraping platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scraping data available yet. Run your first scraping job to see statistics.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.platform} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium capitalize">{stat.platform}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last run: {stat.last_run ? new Date(stat.last_run).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{stat.total_projects_saved} projects</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.successful_runs}/{stat.total_runs} runs
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {stat.avg_execution_time_ms ? Math.round(stat.avg_execution_time_ms) : 0}ms
                      </div>
                      <div className="text-xs text-muted-foreground">avg time</div>
                    </div>
                    
                    <Badge variant={stat.successful_runs === stat.total_runs ? "default" : "secondary"}>
                      {stat.total_runs > 0 ? Math.round((stat.successful_runs / stat.total_runs) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  )
}
