import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Activity, DollarSign, Sparkles, Eye, Clock, ArrowUpRight, ArrowDownRight, Zap, Shield, Rocket } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-blue-100 text-lg">
                  Welcome back! Here&apos;s what&apos;s happening with your projects.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Active Projects</p>
                  <p className="text-2xl font-bold">2,847</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Activity className="w-5 h-5 text-purple-200" />
                <div>
                  <p className="text-sm text-purple-200">Active Bids</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <Clock className="w-5 h-5 text-indigo-200" />
                <div>
                  <p className="text-sm text-indigo-200">Success Rate</p>
                  <p className="text-2xl font-bold">68%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Projects</CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">2,847</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Active Bids</CardTitle>
              <div className="p-2 bg-green-500/20 rounded-full">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">23</div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Success Rate</CardTitle>
              <div className="p-2 bg-red-500/20 rounded-full">
                <Target className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">68%</div>
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" />
                -2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Monthly Revenue</CardTitle>
              <div className="p-2 bg-purple-500/20 rounded-full">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">$12,847</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +18.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-full group-hover:bg-orange-500/30 transition-colors">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-800 dark:text-orange-200">Modern Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Sleek, responsive design with modern components and smooth animations for an enhanced user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-500/20 rounded-full group-hover:bg-teal-500/30 transition-colors">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-teal-800 dark:text-teal-200">Enhanced Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-teal-700 dark:text-teal-300">
                Advanced security features with encrypted data storage and secure authentication protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 rounded-full group-hover:bg-indigo-500/30 transition-colors">
                  <Rocket className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-800 dark:text-indigo-200">High Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Optimized for speed with advanced caching, lazy loading, and efficient data processing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
