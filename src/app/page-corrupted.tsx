'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Activity, DollarSign, Sparkles, Eye, Clock, ArrowUpRight, ArrowDownRight, Zap, Shield, Rocket } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-gradient relative">
        speed={0.3}
      />
      
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        {/* Modern Header with enhanced glass morphism */}
        <div className="glass-card p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white animate-slide-in-bottom">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-morph">
                <Sparkles className="w-8 h-8 animate-heartbeat" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-gradient-rainbow mb-2">Dashboard</h1>
                <p className="text-blue-100 text-xl font-medium animate-fade-in">
                  Welcome back! Here&apos;s what&apos;s happening with your projects.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="card-modern bg-white/10 p-6 hover-glow-primary animate-slide-in-left">
                <div className="flex items-center gap-4">
                  <Eye className="w-6 h-6 text-blue-200 animate-pulse" />
                  <div>
                    <p className="text-sm text-blue-200 font-medium">Active Projects</p>
                    <p className="text-3xl font-bold text-white">2,847</p>
                  </div>
                </div>
              </div>
              <div className="card-modern bg-white/10 p-6 hover-glow-accent animate-slide-in-bottom" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-purple-200 animate-bounce" />
                  <div>
                    <p className="text-sm text-purple-200 font-medium">Active Bids</p>
                    <p className="text-3xl font-bold text-white">23</p>
                  </div>
                </div>
              </div>
              <div className="card-modern bg-white/10 p-6 hover-lift-gentle animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-indigo-200 animate-spin" />
                  <div>
                    <p className="text-sm text-indigo-200 font-medium">Success Rate</p>
                    <p className="text-3xl font-bold text-white">68%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modern Stats Cards */}
        <div className="grid-cards">
          <Card className="card-floating border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover-lift-gentle animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total Projects</CardTitle>
              <div className="p-3 bg-blue-500/20 rounded-xl hover-glow-primary">
                <Target className="h-5 w-5 text-blue-600 animate-wiggle" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold text-blue-900 dark:text-blue-100 mb-2">2,847</div>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 animate-bounce" />
                <span className="font-medium">+12.5% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card className="card-floating border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover-lift-gentle animate-scale-in" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-800 dark:text-green-200">Active Bids</CardTitle>
              <div className="p-3 bg-green-500/20 rounded-xl hover-glow-accent">
                <Activity className="h-5 w-5 text-green-600 animate-bounce" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold text-green-900 dark:text-green-100 mb-2">23</div>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 animate-bounce" />
                <span className="font-medium">+5.2% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card className="card-floating border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 hover-lift-gentle animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-200">Success Rate</CardTitle>
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Target className="h-5 w-5 text-amber-600 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-2">68%</div>
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 animate-bounce" />
                <span className="font-medium">-2.1% from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card className="card-floating border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover-lift-gentle animate-scale-in" style={{animationDelay: '0.3s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-800 dark:text-purple-200">Monthly Revenue</CardTitle>
              <div className="p-3 bg-purple-500/20 rounded-xl hover-glow">
                <DollarSign className="h-5 w-5 text-purple-600 animate-spin" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-4xl font-bold text-purple-900 dark:text-purple-100 mb-2">$12,847</div>
              <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 animate-bounce" />
                <span className="font-medium">+18.3% from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modern Feature Cards */}
        <div className="grid-modern">
          <Card className="neo-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover-lift-strong group animate-slide-in-left">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors animate-breathe">
                  <Zap className="h-7 w-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gradient-modern">Modern Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 dark:text-orange-300 leading-relaxed">
                Sleek, responsive design with modern components and smooth animations for an enhanced user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 hover-lift-strong group animate-slide-in-bottom" style={{animationDelay: '0.1s'}}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-teal-500/20 rounded-xl group-hover:bg-teal-500/30 transition-colors animate-breathe">
                  <Shield className="h-7 w-7 text-teal-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gradient-modern">Enhanced Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-teal-700 dark:text-teal-300 leading-relaxed">
                Advanced security features with encrypted data storage and secure authentication protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="neo-card bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 hover-lift-strong group animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/30 transition-colors animate-breathe">
                  <Rocket className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gradient-modern">High Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
                Optimized for speed with advanced caching, lazy loading, and efficient data processing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => console.log('Add new project')} />
    </div>
  )
}
