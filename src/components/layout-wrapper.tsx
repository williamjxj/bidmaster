'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopHeader } from "@/components/top-header"
import { Footer } from "@/components/footer"

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
        <TopHeader />
        <main className="flex-1 overflow-auto bg-background min-h-[calc(100vh-4rem)]">
          <div className="w-full">
            {children}
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
