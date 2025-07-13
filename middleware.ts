import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  
  // Get user for authentication checks
  const { data: { user } } = await supabase.auth.getUser()
  
  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/auth')
  
  // Redirect authenticated users away from auth pages
  if (user && isAuthPage && !url.pathname.includes('/callback')) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  
  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/bids',
    '/analytics',
    '/calendar',
    '/settings',
    '/profile'
  ]
  
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  )
  
  // Redirect unauthenticated users from protected routes
  if (!user && isProtectedRoute) {
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
