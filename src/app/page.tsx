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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome back! Here&apos;s your project overview.</p>
      </div>

      <div className="tabs-container">
        <Tabs defaultValue="overview" className="w-full">
          <div className="tabs-header">
            <TabsList className="tabs-nav w-full">
              <TabsTrigger value="overview" className="tabs-trigger flex-1">
                📊 Overview
              </TabsTrigger>
              <TabsTrigger value="metrics" className="tabs-trigger flex-1">
                📈 Metrics
              </TabsTrigger>
              <TabsTrigger value="charts" className="tabs-trigger flex-1">
                📊 Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="tabs-content space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <h2 className="text-lg font-semibold text-primary mb-2">📊 Dashboard Overview</h2>
              <p className="text-primary/80 text-sm">Get a comprehensive view of your project activities and recent updates.</p>
            </div>
            <DashboardStats stats={mockStats} />
            
            {/* Simple Activity Feed */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="panel-container">
                <div className="panel-header">
                  <h3 className="panel-title">Recent Activity</h3>
                </div>
                <div className="panel-content">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm">Applied to &ldquo;React Developer&rdquo; project</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm">Bookmarked &ldquo;Full Stack Position&rdquo;</span>
                      <span className="text-xs text-muted-foreground">5 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Won &ldquo;WordPress Plugin&rdquo; project</span>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="panel-container">
                <div className="panel-header">
                  <h3 className="panel-title">Quick Stats</h3>
                </div>
                <div className="panel-content">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="text-sm font-medium">12 applications</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Rate</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Bid Amount</span>
                      <span className="text-sm font-medium">$2,450</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="tabs-content space-y-6">
            <div className="bg-success/5 rounded-lg p-4 border border-success/10">
              <h2 className="text-lg font-semibold text-success mb-2">📈 Performance Metrics</h2>
              <p className="text-success/80 text-sm">Track your key performance indicators and success metrics.</p>
            </div>
            <DashboardMetrics />
          </TabsContent>

          <TabsContent value="charts" className="tabs-content space-y-6">
            <div className="bg-accent/5 rounded-lg p-4 border border-accent/10">
              <h2 className="text-lg font-semibold text-accent mb-2">📊 Analytics & Charts</h2>
              <p className="text-accent/80 text-sm">Visualize your project data with detailed charts and trends.</p>
            </div>
            <ProjectCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
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
