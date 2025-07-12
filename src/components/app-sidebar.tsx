"use client"

import { Calendar, Home, Inbox, Search, Settings, Command, MoreHorizontal, Target, Activity, TrendingUp } from "lucide-react"
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

// Navigation items with dynamic badges
const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Search,
    badge: "23",
    badgeVariant: "secondary" as const,
  },
  {
    title: "My Bids",
    url: "/bids",
    icon: Inbox,
    badge: "5",
    badgeVariant: "default" as const,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
]

// Platform data with colors and counts
const platforms = [
  { 
    name: "Upwork", 
    count: 12, 
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50"
  },
  { 
    name: "Freelancer", 
    count: 8, 
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50"
  },
  { 
    name: "Toptal", 
    count: 3, 
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50"
  },
]

// Quick stats for sidebar
const quickStats = [
  {
    label: "Success Rate",
    value: "68%",
    icon: Target,
    color: "text-green-600"
  },
  {
    label: "Active Bids",
    value: "23",
    icon: Activity,
    color: "text-blue-600"
  },
  {
    label: "This Month",
    value: "$12.8k",
    icon: TrendingUp,
    color: "text-purple-600"
  }
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BidMaster</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">Project Discovery</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={item.badgeVariant} className="ml-auto">
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
          <SidebarGroupLabel>Platforms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platforms.map((platform) => (
                <SidebarMenuItem key={platform.name}>
                  <SidebarMenuButton className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`size-3 rounded-full ${platform.color}`} />
                      <span className="ml-2">{platform.name}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {platform.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-sidebar-accent">
                  <div className="flex items-center">
                    <stat.icon className={`size-3 ${stat.color}`} />
                    <span className="ml-2 text-xs text-sidebar-foreground/70">{stat.label}</span>
                  </div>
                  <span className="text-xs font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="size-6">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">John Doe</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">john@example.com</span>
                </div>
              </div>
              <MoreHorizontal className="size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
