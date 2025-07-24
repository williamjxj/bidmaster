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
  Info,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
    <TooltipProvider>
      <Sidebar className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="border-b border-sidebar-border px-8 py-8">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 p-4 rounded-xl group"
              >
                <Link href="/">
                  <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                    <Command className="size-6" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight ml-4">
                    <span className="truncate font-bold text-lg text-sidebar-foreground">BidMaster Hub</span>
                    <span className="truncate text-sm text-muted-foreground">Project Discovery</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-auto bg-primary text-primary-foreground border-primary/20 text-xs px-3 py-1.5 font-medium"
                  >
                    Pro
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-6 py-8">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider mb-6 px-4">
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
                          "group relative flex items-center justify-between rounded-xl px-6 py-4 text-sm font-medium transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg border border-sidebar-border" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Link href={item.url}>
                          <div className="flex items-center min-w-0 flex-1">
                            <div
                              className={cn(
                                "flex items-center justify-center w-6 h-6 transition-colors duration-200",
                                isActive
                                  ? "text-sidebar-accent-foreground"
                                  : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                              )}
                            >
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "truncate transition-colors duration-200 text-sm font-semibold",
                                    isActive
                                      ? "text-sidebar-accent-foreground"
                                      : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                                  )}
                                >
                                  {item.title}
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <Info className="w-3 h-3 text-muted-foreground hover:text-sidebar-accent-foreground cursor-help" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="bg-popover text-popover-foreground text-sm border border-border shadow-lg">
                                    <p>{item.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant}
                              className="ml-3 text-xs h-6 px-3 bg-primary/10 text-primary font-medium"
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
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
          <SidebarGroup className="mt-10">
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider mb-6 flex items-center gap-2 px-4">
              <Zap className="w-4 h-4" />
              Platforms
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="relative">
                        <div className={cn("w-3 h-3 rounded-full", platform.color, platform.pulse && "animate-pulse")} />
                        {platform.status === "active" && (
                          <div
                            className={cn(
                              "absolute inset-0 w-4 h-4 rounded-full animate-ping",
                              platform.color,
                              "opacity-75",
                            )}
                          />
                        )}
                      </div>
                      <span className="ml-4 text-sm font-semibold text-sidebar-foreground truncate">
                        {platform.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {platform.trend !== "0" && (
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            platform.trend.startsWith("+")
                              ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
                              : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
                          )}
                        >
                          {platform.trend}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs h-6 px-3 bg-muted font-medium border-border/50">
                        {platform.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats */}
          <SidebarGroup className="mt-10">
            <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wider mb-6 flex items-center gap-2 px-4">
              <Star className="w-4 h-4" />
              Quick Stats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted group-hover:bg-background transition-all duration-200 shadow-sm">
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <span className="ml-4 text-sm font-medium text-muted-foreground truncate">{stat.label}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-sidebar-foreground">{stat.value}</span>
                      <span className={cn("text-xs font-medium", stat.trendColor)}>{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border px-6 py-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="flex items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-xl p-4">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="relative">
                    <Avatar className="w-11 h-11 ring-2 ring-primary/20 shadow-md">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-sidebar shadow-sm" />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-sm font-semibold text-sidebar-foreground truncate">John Doe</div>
                    <div className="text-xs text-muted-foreground truncate">john@example.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 p-0 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="w-10 h-10 p-0 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
