'use client'

import { useAuth } from '@/hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { ProjectCharts } from "@/components/project-charts"
import { DashboardStats } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Search, Target, Zap } from "lucide-react"

// Landing page for non-authenticated users
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-32 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-300" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-700" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                <Zap className="w-4 h-4" />
                Power Up Your Freelancing Game
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black text-foreground mb-6 tracking-tight">
                Crush Your{' '}
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Freelance Goals
                </span>
                {' '}with BidMaster
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
                Track projects like fitness goals, optimize your bid performance, and achieve freelance success. 
                Your all-in-one platform for dominating multiple freelance platforms.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/auth/signup" className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-accent/50 transition-all duration-300">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
            
            {/* Stats preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-primary">15K+</div>
                <div className="text-sm font-medium text-muted-foreground">Projects Tracked</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-secondary">92%</div>
                <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-black text-amber-500">$2M+</div>
                <div className="text-sm font-medium text-muted-foreground">Total Earnings</div>
              </div>
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
    <div className="flex-1 space-y-8 bg-background min-h-full">
      {/* Hero Dashboard Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-slate-200 shadow-lg" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(248, 250, 252, 1) 100%)'
      }}>
        {/* Animated background elements */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full blur-xl animate-pulse" style={{
          background: 'rgba(59, 130, 246, 0.1)'
        }} />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full blur-lg animate-pulse" style={{
          background: 'rgba(16, 185, 129, 0.1)',
          animationDelay: '500ms'
        }} />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl shadow-lg" style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
              }}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">
                    Performance Dashboard
                  </h1>
                  <p className="text-base text-muted-foreground font-medium">
                    Track your freelancing journey and smash your goals! 💪
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="px-4 py-2 text-sm font-bold text-white border-0 shadow-md" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}>
                  <Target className="w-4 h-4 mr-2" />
                  On Track
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-sm font-bold">
                  🔥 Hot Streak: 5 days
                </Badge>
              </div>
            </div>
            
            {/* Quick action button */}
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3">
              <Search className="w-4 h-4 mr-2" />
              Find Projects
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <DashboardStats stats={mockStats} />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2 shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-base">A log of your recent bidding actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
                    <p className="font-medium">Applied to &quot;React Developer&quot;</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
                    <p className="font-medium">Bookmarked &quot;Full Stack Position&quot;</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-border/60 transition-colors">
                    <p className="font-medium">Won &quot;WordPress Plugin&quot;</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
                <CardDescription className="text-base">Your key metrics at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground font-medium">This Week</p>
                  <span className="text-sm font-bold">12 applications</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground font-medium">Win Rate</p>
                  <span className="text-sm font-bold">25%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <p className="text-muted-foreground font-medium">Avg. Response Time</p>
                  <span className="text-sm font-bold">24 hours</span>
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
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Analytics & Charts</CardTitle>
              <CardDescription className="text-base">Visualize your project data and trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectCharts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
