"use client"

import { Calendar, Home, Inbox, Search, Settings, Command, MoreHorizontal, Target, Activity, TrendingUp, BarChart3, Zap, Bell, Star } from "lucide-react"
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
import Link from "next/link"

// Navigation items with dynamic badges and enhanced icons
const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Search,
    badge: "23",
    badgeVariant: "secondary" as const,
    gradient: "from-green-500 to-teal-600",
  },
  {
    title: "My Bids",
    url: "/bids",
    icon: Inbox,
    badge: "5",
    badgeVariant: "default" as const,
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    badge: null,
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    badge: null,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
    gradient: "from-gray-500 to-gray-600",
  },
  {
    title: "UI Showcase",
    url: "/shadcn-showcase",
    icon: Zap,
    badge: "NEW",
    badgeVariant: "default" as const,
    gradient: "from-violet-500 to-purple-600",
  },
]

// Platform data with enhanced styling
const platforms = [
  { 
    name: "Upwork", 
    count: 12, 
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    pulse: true,
    trend: "+2"
  },
  { 
    name: "Freelancer", 
    count: 8, 
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    pulse: false,
    trend: "+1"
  },
  { 
    name: "Toptal", 
    count: 3, 
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    pulse: false,
    trend: "0"
  },
]

// Enhanced quick stats
const quickStats = [
  {
    label: "Success Rate",
    value: "68%",
    icon: Target,
    color: "text-green-600",
    trend: "-2.1%",
    trendColor: "text-red-500"
  },
  {
    label: "Active Bids",
    value: "23",
    icon: Activity,
    color: "text-blue-600",
    trend: "+5.2%",
    trendColor: "text-green-500"
  },
  {
    label: "This Month",
    value: "$12.8k",
    icon: TrendingUp,
    color: "text-purple-600",
    trend: "+18.3%",
    trendColor: "text-green-500"
  }
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-700/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900 dark:text-white">BidMaster</span>
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">Project Discovery</span>
                </div>
                <Badge variant="outline" className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
                  Pro
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 rounded-lg mb-1 hover-lift animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <Link href={item.url} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-md bg-gradient-to-r ${item.gradient} group-hover:shadow-lg transition-all duration-200 animate-glow`}>
                          <item.icon className="size-3 text-white animate-bounce" />
                        </div>
                        <span className="ml-3 font-medium group-hover:text-gradient">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={item.badgeVariant} className="ml-auto shadow-sm animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Platform Status */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
            <Zap className="size-3 animate-pulse" />
            Platforms
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platforms.map((platform, index) => (
                <SidebarMenuItem key={platform.name}>
                  <SidebarMenuButton className="group flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 rounded-lg mb-1 hover-lift animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center">
                      <div className={`size-3 rounded-full ${platform.color} ${platform.pulse ? 'animate-pulse' : ''} shadow-sm animate-glow`} />
                      <span className="ml-3 font-medium">{platform.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.trend !== "0" && (
                        <span className={`text-xs ${platform.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} animate-bounce`}>
                          {platform.trend}
                        </span>
                      )}
                      <Badge variant="outline" className="ml-auto shadow-sm animate-pulse">
                        {platform.count}
                      </Badge>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
            <Star className="size-3" />
            Quick Stats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 group">
                  <div className="flex items-center">
                    <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-all duration-200">
                      <stat.icon className={`size-3 ${stat.color}`} />
                    </div>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                    <span className={`text-xs ${stat.trendColor}`}>{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-700/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="size-8 ring-2 ring-blue-500/20">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                </div>
                <div className="ml-3 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900 dark:text-white">John Doe</span>
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">john@example.com</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="size-3 text-gray-400" />
                <MoreHorizontal className="size-4 text-gray-400" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
