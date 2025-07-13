'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { ProjectCharts } from "@/components/project-charts"
import { DashboardStats } from "@/components/dashboard"

// Mock data for demonstration
const mockStats = {
  totalProjects: 142,
  activeApplications: 8,
  winRate: 24,
  totalEarnings: 15600
}

// Original Dashboard Content
function OriginalDashboard() {
  return (
    <div className="space-y-6">
      <DashboardStats stats={mockStats} />
      
      {/* Simple Activity Feed */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Applied to &ldquo;React Developer&rdquo; project</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Bookmarked &ldquo;Full Stack Position&rdquo;</span>
              <span className="text-xs text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Won &ldquo;WordPress Plugin&rdquo; project</span>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
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
              <span className="text-sm font-medium">$2,850</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Dashboard Content
function EnhancedDashboard() {
  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Cards */}
      <DashboardMetrics />
      
      {/* Interactive Charts */}
      <ProjectCharts />
      
      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Recent Projects</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Full Stack Developer - E-commerce Platform</p>
                <p className="text-sm text-muted-foreground">Upwork • $5,000 - $8,000</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">React Native Mobile App</p>
                <p className="text-sm text-muted-foreground">Freelancer • $3,000 - $5,000</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Applied</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">WordPress Plugin Development</p>
                <p className="text-sm text-muted-foreground">Toptal • $2,000 - $3,000</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-3">Platform Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Upwork</span>
              </div>
              <span className="text-sm font-medium">64%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Freelancer</span>
              </div>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Toptal</span>
              </div>
              <span className="text-sm font-medium">8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your BidMaster dashboard - Track projects, manage bids, and monitor your freelance success
        </p>
      </div>
      
      <Tabs defaultValue="enhanced" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="original">Original View</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-6">
          <OriginalDashboard />
        </TabsContent>
        
        <TabsContent value="enhanced" className="mt-6">
          <EnhancedDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
