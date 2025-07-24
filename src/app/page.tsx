'use client'

import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { ProjectCharts } from "@/components/project-charts"
import { DashboardStats } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Search, Target } from "lucide-react"

// Landing page for non-authenticated users
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your Bidding Game with{' '}
              <span className="text-indigo-600">BidMaster</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover, track, and win more projects across multiple platforms. 
              Your all-in-one solution for freelance project management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools to help you find, track, and win more projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-indigo-600 mb-4" />
                <CardTitle>Project Discovery</CardTitle>
                <CardDescription>
                  Aggregate projects from multiple platforms in one dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Search and filter through thousands of opportunities from 
                  Upwork, Freelancer, Toptal, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-indigo-600 mb-4" />
                <CardTitle>Bid Management</CardTitle>
                <CardDescription>
                  Track your proposals and manage your bidding pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize your bids, set reminders, and track your success 
                  rate across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-indigo-600 mb-4" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Get insights to improve your bidding strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track win rates, analyze trends, and optimize your 
                  approach with detailed analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to win more projects?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of freelancers already using BidMaster
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup" className="flex items-center">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mock data for demonstration
const mockStats = {
  totalProjects: 142,
  activeApplications: 8,
  winRate: 24,
  totalEarnings: 15600
}

// Dashboard for authenticated users
function AuthenticatedDashboard() {
  return (
    <main className="flex-1 space-y-8 p-8 bg-background">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s a summary of your bidding activity.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats stats={mockStats} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your recent bidding actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p>Applied to &quot;React Developer&quot;</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Bookmarked &quot;Full Stack Position&quot;</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Won &quot;WordPress Plugin&quot;</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your key metrics at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">This Week</p>
                  <span className="text-sm font-medium">12 applications</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Win Rate</p>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Avg. Response Time</p>
                  <span className="text-sm font-medium">24 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed metrics on your bidding performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardMetrics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Charts</CardTitle>
              <CardDescription>Visualize your project data and trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectCharts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return user ? <AuthenticatedDashboard /> : <LandingPage />
}
