'use client'

import { ExternalLink, Globe, Code, ShoppingCart, Building2, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Website {
  name: string
  url: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  status: 'active' | 'beta' | 'new'
}

const websites: Website[] = [
  {
    name: 'Face Fusion Agent',
    url: 'https://face-fusion-agent.vercel.app',
    description: 'AI-powered face fusion and manipulation tool',
    category: 'AI/ML',
    icon: Code,
    status: 'active'
  },
  {
    name: 'NextJS Supabase',
    url: 'https://nextjs-supabase-kappa-nine.vercel.app',
    description: 'Full-stack web application with authentication',
    category: 'Development',
    icon: Code,
    status: 'active'
  },
  {
    name: 'Manus AI Shop',
    url: 'https://manus-ai-shop.vercel.app',
    description: 'AI-powered e-commerce platform',
    category: 'E-commerce',
    icon: ShoppingCart,
    status: 'active'
  },
  {
    name: 'BidMaster Hub',
    url: 'https://bidmaster-hub.vercel.app/',
    description: 'Project bidding management platform',
    category: 'Business',
    icon: Building2,
    status: 'active'
  },
  {
    name: 'NextJS MCP Template',
    url: 'https://nextjs-mcp-template.vercel.app/',
    description: 'Model Context Protocol template application',
    category: 'Development',
    icon: Code,
    status: 'beta'
  },
  {
    name: 'Friendship Daycare',
    url: 'https://friendshipdaycare.vercel.app/',
    description: 'Childcare and daycare management system',
    category: 'Education',
    icon: Heart,
    status: 'active'
  },
  {
    name: 'Best IT Consulting',
    url: 'https://bestitconsulting.vercel.app/',
    description: 'IT consulting and services platform',
    category: 'Business',
    icon: Building2,
    status: 'active'
  },
  {
    name: 'Best IT Consultants',
    url: 'https://bestitconsultants.vercel.app/',
    description: 'Professional IT consulting services',
    category: 'Business',
    icon: Building2,
    status: 'active'
  }
]

const categoryColors = {
  'AI/ML': 'bg-purple-100 text-purple-800 border-purple-200',
  'Development': 'bg-blue-100 text-blue-800 border-blue-200',
  'E-commerce': 'bg-green-100 text-green-800 border-green-200',
  'Business': 'bg-orange-100 text-orange-800 border-orange-200',
  'Education': 'bg-pink-100 text-pink-800 border-pink-200'
}

const statusColors = {
  'active': 'bg-green-100 text-green-800 border-green-200',
  'beta': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'new': 'bg-blue-100 text-blue-800 border-blue-200'
}

export function ActiveWebsitesList() {
  const openWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const categories = Array.from(new Set(websites.map(site => site.category)))

  return (
    <div className="space-y-6 auto-spacing">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Websites Portfolio</h2>
        <p className="text-gray-600">A collection of live web applications and platforms</p>
        <div className="flex justify-center mt-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="w-3 h-3 mr-1" />
            {websites.length} Active Sites
          </Badge>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant="outline"
            className={`${categoryColors[category as keyof typeof categoryColors]} cursor-default`}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Websites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {websites.map((website, index) => {
          const IconComponent = website.icon
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-gray-200 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{website.name}</CardTitle>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${statusColors[website.status]} text-xs`}
                  >
                    {website.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  {website.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`${categoryColors[website.category as keyof typeof categoryColors]} text-xs`}
                  >
                    {website.category}
                  </Badge>
                  
                  <Button
                    onClick={() => openWebsite(website.url)}
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 font-mono truncate">
                  {website.url}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => {
            const count = websites.filter(site => site.category === category).length
            return (
              <div key={category} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs sm:text-sm text-gray-600">{category}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
        <Button
          onClick={() => websites.forEach(site => openWebsite(site.url))}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Globe className="w-4 h-4" />
          <span>Open All Sites</span>
        </Button>
        
        <Button
          onClick={() => {
            const urls = websites.map(site => site.url).join('\\n')
            navigator.clipboard.writeText(urls)
          }}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Code className="w-4 h-4" />
          <span>Copy URLs</span>
        </Button>
      </div>
    </div>
  )
}
