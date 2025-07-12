"use client"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Command,
  MoreHorizontal,
  Target,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  Bell,
  Star,
  Briefcase,
  DollarSign,
  Clock,
  Plus,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Navigation items with dynamic badges and enhanced icons
const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
    description: "Overview & analytics",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Search,
    badge: "23",
    badgeVariant: "secondary" as const,
    description: "Browse opportunities",
  },
  {
    title: "My Bids",
    url: "/bids",
    icon: Inbox,
    badge: "5",
    badgeVariant: "default" as const,
    description: "Active applications",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    badge: null,
    description: "Performance insights",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    badge: null,
    description: "Schedule & deadlines",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
    description: "Account preferences",
  },
]

// Platform data with enhanced styling
const platforms = [
  {
    name: "Upwork",
    count: 12,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
    pulse: true,
    trend: "+2",
    status: "active",
  },
  {
    name: "Freelancer",
    count: 8,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    pulse: false,
    trend: "+1",
    status: "active",
  },
  {
    name: "Toptal",
    count: 3,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    pulse: false,
    trend: "0",
    status: "idle",
  },
]

// Enhanced quick stats
const quickStats = [
  {
    label: "Success Rate",
    value: "68%",
    icon: Target,
    color: "text-emerald-600",
    trend: "-2.1%",
    trendColor: "text-red-500",
  },
  {
    label: "Active Bids",
    value: "23",
    icon: Activity,
    color: "text-blue-600",
    trend: "+5.2%",
    trendColor: "text-emerald-500",
  },
  {
    label: "This Month",
    value: "$12.8k",
    icon: TrendingUp,
    color: "text-purple-600",
    trend: "+18.3%",
    trendColor: "text-emerald-500",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 p-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 p-3"
            >
              <Link href="/">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
                  <Command className="size-5" />
                </div>
                <div className="grid flex-1 text-left leading-tight ml-3">
                  <span className="truncate font-bold text-lg text-gray-900 dark:text-white">BidMaster</span>
                  <span className="truncate text-sm text-gray-500 dark:text-gray-400">Project Discovery</span>
                </div>
                <Badge
                  variant="outline"
                  className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none text-xs px-2 py-1"
                >
                  Pro
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navMain.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "group relative flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800",
                        isActive && "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                      )}
                    >
                      <Link href={item.url}>
                        <div className="flex items-center min-w-0 flex-1">
                          <div
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-lg transition-colors duration-200",
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300",
                            )}
                          >
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="ml-4 min-w-0 flex-1">
                            <div
                              className={cn(
                                "truncate transition-colors duration-200 text-base font-medium",
                                isActive
                                  ? "text-blue-700 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100",
                              )}
                            >
                              {item.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant}
                            className="ml-3 text-sm h-6 px-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Platform Status */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Platforms
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="relative">
                      <div className={cn("w-3 h-3 rounded-full", platform.color, platform.pulse && "animate-pulse")} />
                      {platform.status === "active" && (
                        <div
                          className={cn(
                            "absolute inset-0 w-3 h-3 rounded-full animate-ping",
                            platform.color,
                            "opacity-75",
                          )}
                        />
                      )}
                    </div>
                    <span className="ml-4 text-base font-medium text-gray-700 dark:text-gray-300 truncate">
                      {platform.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {platform.trend !== "0" && (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          platform.trend.startsWith("+")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {platform.trend}
                      </span>
                    )}
                    <Badge variant="outline" className="text-sm h-6 px-2 bg-gray-50 dark:bg-gray-800 font-medium">
                      {platform.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Quick Stats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-200">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 truncate">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                    <span className={cn("text-sm font-medium", stat.trendColor)}>{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 rounded-xl p-4">
              <div className="flex items-center min-w-0 flex-1">
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2 ring-blue-500/20">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-base">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-base font-semibold text-gray-900 dark:text-white truncate">John Doe</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">john@example.com</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 p-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer transition-colors">
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <div className="w-8 h-8 p-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BidMaster
              </h1>
              <p className="text-muted-foreground text-xl">Software Outsourcing Platform</p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your freelance workflow with intelligent bid management, 
            project tracking, and performance analytics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Target, label: "Active Projects", value: "2,847", color: "blue" },
            { icon: TrendingUp, label: "Success Rate", value: "89%", color: "green" },
            { icon: DollarSign, label: "Total Revenue", value: "$127K", color: "purple" },
            { icon: Zap, label: "Avg Response", value: "2.4h", color: "orange" }
          ].map((stat, index) => (
            <Card key={index} className="card-floating p-6 hover-lift-gentle">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              platform: "Upwork",
              title: "E-commerce Platform Development",
              budget: "$5,000 - $8,000",
              status: "Active",
              tech: ["React", "Node.js", "MongoDB"],
              deadline: "2 weeks"
            },
            {
              platform: "Freelancer",
              title: "Mobile App UI/UX Design",
              budget: "$2,500 - $4,000",
              status: "Bidding",
              tech: ["Figma", "React Native", "TypeScript"],
              deadline: "1 week"
            },
            {
              platform: "Toptal",
              title: "AI Integration Project",
              budget: "$10,000 - $15,000",
              status: "In Review",
              tech: ["Python", "TensorFlow", "FastAPI"],
              deadline: "3 weeks"
            }
          ].map((project, index) => (
            <Card key={index} className="neo-card p-6 hover-lift-strong">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800 font-semibold">
                    {project.platform}
                  </Badge>
                  <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg leading-tight">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {project.budget}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.deadline}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1">
                    {project.status === 'Active' ? 'Manage' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="neo-button">
              <Plus className="w-5 h-5 mr-2" />
              Create New Bid
            </Button>
            <Button size="lg" variant="outline" className="hover-lift-gentle">
              <Search className="w-5 h-5 mr-2" />
              Browse Projects
            </Button>
            <Button size="lg" variant="outline" className="hover-lift-gentle">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
          
          {/* Demo Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Component Demos</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/loading-demo">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Loading Animation Demo
                </Button>
              </Link>
              <Link href="/shadcn-showcase">
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                  Shadcn/UI Showcase
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
