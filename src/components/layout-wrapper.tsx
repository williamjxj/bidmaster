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
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/" className="text-base font-poppins">
                    BidMaster Hub
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base font-medium font-poppins">
                    {getPageTitle(pathname)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto bg-gray-50/50">{children}</main>
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
