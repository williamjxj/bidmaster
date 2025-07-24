'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  
  // Show loading spinner during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Check if current page is an auth page
  const isAuthPage = pathname.startsWith('/auth')
  
  // For auth pages or non-authenticated users, show simple layout
  if (isAuthPage || !user) {
    return <>{children}</>
  }

  // For authenticated users, show full dashboard layout
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-4 justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors p-2" />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    BidMaster Hub
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-sm font-semibold text-foreground">
                    {getPageTitle(pathname)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto bg-muted/30 p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return 'Dashboard'
  
  const pageMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'bids': 'Bids', 
    'analytics': 'Analytics',
    'calendar': 'Calendar',
    'settings': 'Settings',
    'profile': 'Profile'
  }
  
  return pageMap[segments[0]] || segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
}
