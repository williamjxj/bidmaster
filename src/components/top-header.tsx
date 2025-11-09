'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  HelpCircle,
  Share2,
  UserPlus,
  Rocket,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

export function TopHeader() {
  const { user, signOut } = useAuth()

  const userInitials = user?.email
    ?.split('@')[0]
    .split('.')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'U'

  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Branding and Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">BidMaster</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Free
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Plan</DropdownMenuLabel>
                <DropdownMenuItem>Free Plan</DropdownMenuItem>
                <DropdownMenuItem>Pro Plan</DropdownMenuItem>
                <DropdownMenuItem>Enterprise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="gap-2">
              <Rocket className="h-4 w-4" />
              Find Projects
            </Button>
          </div>
        </div>

        {/* Center: Progress Indicator */}
        <div className="hidden lg:flex items-center gap-3 px-4">
          <div className="flex items-center gap-2 min-w-[200px]">
            <Rocket className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Getting started</span>
                <span className="font-medium">33%</span>
              </div>
              <Progress value={33} className="h-1.5" />
            </div>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              1
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline">Invite team</span>
          </Button>

          <Button size="sm" className="gap-2">
            Upgrade
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Company
            </Button>
            <Button variant="ghost" size="sm">
              Portal
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

