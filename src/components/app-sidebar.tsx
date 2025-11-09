"use client"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
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
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Navigation items with fitness-inspired theming
const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
    description: "Performance overview",
    gradient: "from-blue-500 to-blue-600",
    emoji: "🏠",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Search,
    badge: "23",
    badgeVariant: "secondary" as const,
    description: "Discover opportunities",
    gradient: "from-purple-500 to-purple-600",
    emoji: "🔍",
  },
  {
    title: "My Bids",
    url: "/bids",
    icon: Inbox,
    badge: "5",
    badgeVariant: "default" as const,
    description: "Active proposals",
    gradient: "from-amber-500 to-amber-600",
    emoji: "⚡",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    badge: null,
    description: "Performance metrics",
    gradient: "from-emerald-500 to-emerald-600",
    emoji: "📊",
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    badge: null,
    description: "Schedule & goals",
    gradient: "from-rose-500 to-rose-600",
    emoji: "📅",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
    description: "Profile & preferences",
    gradient: "from-slate-500 to-slate-600",
    emoji: "⚙️",
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
        <SidebarHeader className="border-b border-sidebar-border px-4 md:px-6 py-4 md:py-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 p-3 md:p-4 rounded-2xl group"
              >
                <Link href="/">
                  <div className="flex aspect-square size-12 md:size-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <Zap className="size-6 md:size-7" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight ml-3 md:ml-4">
                    <span className="truncate font-black text-lg md:text-xl text-sidebar-foreground tracking-tight">
                      BidMaster
                    </span>
                    <span className="truncate text-xs md:text-sm text-muted-foreground font-bold">
                      💪 Freelance Fitness
                    </span>
                  </div>
                  <Badge
                    className="ml-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 text-xs px-3 py-1.5 font-bold shadow-md"
                  >
                    ⚡ PRO
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-5 md:px-7" style={{ paddingTop: '0.2rem', paddingBottom: '0.2rem' }}>
          {/* Main Navigation */}
          <SidebarGroup className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm">
            <SidebarGroupLabel className="text-muted-foreground font-black text-xs uppercase tracking-widest mb-5 md:mb-6 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Journey
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navMain.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group relative flex items-center justify-between rounded-2xl px-4 md:px-5 py-2 md:py-3 text-sm font-bold transition-all duration-300 min-h-[3rem]",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-lg hover:scale-[1.02]",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          isActive 
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground shadow-lg border border-primary/20 scale-[1.02]" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Link href={item.url} className="flex items-center min-w-0 flex-1 gap-4 md:gap-5">
                          {/* Icon with gradient background */}
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-300 shadow-sm flex-shrink-0",
                            isActive 
                              ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="text-sm opacity-60 font-black">
                                {item.emoji}
                              </span>
                              <span className={cn(
                                "truncate transition-colors duration-200 font-black text-base tracking-wide",
                                isActive
                                  ? "text-foreground"
                                  : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                              )}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge
                                  className={cn(
                                    "text-xs h-6 px-2.5 font-black shadow-sm",
                                    isActive 
                                      ? `bg-gradient-to-r ${item.gradient} text-white border-0` 
                                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary border-0"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium opacity-80">
                              {item.description}
                            </div>
                          </div>
                          
                          {isActive && (
                            <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${item.gradient} shadow-lg flex-shrink-0`} />
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
          <SidebarGroup className="mt-10 bg-card border border-border rounded-xl shadow-sm">
            <SidebarGroupLabel className="text-muted-foreground font-black text-xs uppercase tracking-widest mb-5 md:mb-6 flex items-center gap-2 px-6 md:px-7 lg:px-8 pt-5 md:pt-6">
              <Zap className="w-4 h-4" />
              💡 Active Platforms
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-6 md:px-7 lg:px-8 pb-5 md:pb-6">
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between py-2 md:py-3 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group min-h-[3rem]"
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
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
                      <span className="text-sm font-semibold text-sidebar-foreground truncate">
                        {platform.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {platform.trend !== "0" && (
                        <span
                          className={cn(
                            "text-xs font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap",
                            platform.trend.startsWith("+")
                              ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
                              : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
                          )}
                        >
                          {platform.trend}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs h-6 px-2.5 bg-muted font-medium border-border/50 whitespace-nowrap">
                        {platform.count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats */}
          <SidebarGroup className="mt-10 bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm">
            <SidebarGroupLabel className="text-muted-foreground font-black text-xs uppercase tracking-widest mb-5 md:mb-6 flex items-center gap-2">
              <Star className="w-4 h-4" />
              🏆 Performance Stats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 group min-h-[3rem]"
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
