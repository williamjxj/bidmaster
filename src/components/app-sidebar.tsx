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
