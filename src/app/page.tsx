'use client'

import { useAuth } from '@/hooks/useAuth'
import { DashboardSummaryCards } from '@/components/dashboard-summary-cards'
import { ProjectDistributionChart } from '@/components/project-distribution-chart'
import { DashboardActivity } from '@/components/dashboard-activity'
import { DashboardFundingCard } from '@/components/dashboard-funding-card'
import { DashboardOptionsCard } from '@/components/dashboard-options-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Eye, Zap, ArrowRight, Search, Target, BarChart3 } from "lucide-react"
import Link from "next/link"

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-all duration-300">
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
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/auth/signup" className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-accent/50 transition-all duration-300 transform hover:scale-105">
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
      <div className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful tools to help you find, track, and win more projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="fitness-card hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 w-fit mb-4 animate-breathe">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Project Discovery</CardTitle>
                <CardDescription className="text-base">
                  Aggregate projects from multiple platforms in one dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Search and filter through thousands of opportunities from 
                  Upwork, Freelancer, Toptal, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="fitness-card hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 w-fit mb-4 animate-breathe">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Bid Management</CardTitle>
                <CardDescription className="text-base">
                  Track your proposals and manage your bidding pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize your bids, set reminders, and track your success 
                  rate across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="fitness-card hover:shadow-lg transition-all duration-300 hover-lift animate-fade-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 w-fit mb-4 animate-breathe">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Analytics & Insights</CardTitle>
                <CardDescription className="text-base">
                  Get insights to improve your bidding strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Track win rates, analyze trends, and optimize your 
                  approach with detailed analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to win more projects?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers already using BidMaster
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
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

// Dashboard for authenticated users - Cake Equity style
function AuthenticatedDashboard() {
  return (
    <div className="flex-1 bg-background min-h-full">
      {/* Main container with consistent padding */}
      <div className="p-8 md:p-10 lg:p-12 xl:p-14 space-y-10 md:space-y-12 lg:space-y-14">
        {/* Top Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 md:p-6 lg:p-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Eye className="h-5 w-5 text-primary" />
            <span className="text-sm md:text-base font-medium">Have your say on the new BidMaster Dashboard.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline">Check it out</Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Statistics Cards */}
        <div className="space-y-8">
          <DashboardSummaryCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:gap-10 lg:gap-12 lg:grid-cols-3">
          {/* Left: Project Distribution Chart */}
          <div className="lg:col-span-2">
            <ProjectDistributionChart />
          </div>

          {/* Right: Activity Feed */}
          <div>
            <DashboardActivity />
          </div>
        </div>

        {/* Bottom Row: Additional Cards */}
        <div className="grid gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2">
          <DashboardFundingCard />
          <DashboardOptionsCard />
        </div>
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
