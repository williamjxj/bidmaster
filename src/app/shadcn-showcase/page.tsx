'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Settings, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  Share
} from 'lucide-react'

export default function ShadcnShowcase() {
  const [selectedFramework, setSelectedFramework] = useState("")
  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: true,
    item3: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="container mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shadcn/UI + Radix + Tailwind Integration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete showcase of shadcn/ui components built on Radix UI primitives and styled with Tailwind CSS
          </p>
        </div>

        {/* Component Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Buttons & Actions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Buttons & Actions
              </CardTitle>
              <CardDescription>Various button variants and action components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive" size="sm">Danger</Button>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to favorites</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Form Components
              </CardTitle>
              <CardDescription>Input fields, selects, and checkboxes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Framework</label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Preferences</label>
                <div className="space-y-2">
                  {Object.entries(checkedItems).map(([key, checked]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={checked}
                        onCheckedChange={(value) => 
                          setCheckedItems(prev => ({ ...prev, [key]: !!value }))
                        }
                      />
                      <label 
                        htmlFor={key} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Option {key.slice(-1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Display */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Display
              </CardTitle>
              <CardDescription>Avatars, badges, and user profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Frontend Developer</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">john@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="outline">Next.js</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicators */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Status & Alerts
              </CardTitle>
              <CardDescription>Various status indicators and alert styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Success message</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-50 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Warning message</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 text-blue-800">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">Info message</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Online</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Away</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Offline</span>
              </div>
            </CardContent>
          </Card>

          {/* Dialog Example */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Dialogs & Modals
              </CardTitle>
              <CardDescription>Modal dialogs and overlays</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Tabs Example */}
          <Card className="hover:shadow-lg transition-shadow md:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tabs & Navigation
              </CardTitle>
              <CardDescription>Tabbed interfaces and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Make changes to your account here.
                  </p>
                  <Input placeholder="Name" />
                  <Input placeholder="Username" />
                </TabsContent>
                <TabsContent value="password" className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Change your password here.
                  </p>
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>

        {/* Integration Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Integration Benefits</CardTitle>
            <CardDescription className="text-base">
              How shadcn/ui, Radix UI, and Tailwind CSS work together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900">🎨 Shadcn/UI</h3>
                <p className="text-sm text-blue-700">
                  Pre-built, customizable components with consistent design patterns and excellent developer experience.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-900">🔧 Radix UI</h3>
                <p className="text-sm text-purple-700">
                  Provides the accessible, unstyled primitives that power shadcn/ui components with keyboard navigation and ARIA support.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-indigo-900">💨 Tailwind CSS</h3>
                <p className="text-sm text-indigo-700">
                  Utility-first styling system that provides the design tokens and responsive utilities for all components.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-semibold">Current Configuration:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Radix UI primitives installed and configured</li>
                <li>✅ Tailwind CSS v4 with custom design tokens</li>
                <li>✅ Shadcn/UI components library integrated</li>
                <li>✅ CSS variables for theming support</li>
                <li>✅ TypeScript support for all components</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
