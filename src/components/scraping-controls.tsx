'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, RefreshCw } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ScrapingResult {
  success: boolean
  projects: any[]
  platforms: string[]
  message: string
}

export function ScrapingControls() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('web development')
  const [lastResult, setLastResult] = useState<ScrapingResult | null>(null)

  const handleScrape = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          maxResults: 20
        })
      })

      const result = await response.json()

      if (result.success) {
        setLastResult(result)
        toast({
          title: "Success",
          description: result.message
        })
      } else {
        throw new Error(result.error || 'Scraping failed')
      }
    } catch (error) {
      console.error('Scraping error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to scrape projects',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduledScrape = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scrape/scheduled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: `Scheduled scraping completed. ${result.totalScraped} projects scraped.`
        })
      } else {
        throw new Error(result.error || 'Scheduled scraping failed')
      }
    } catch (error) {
      console.error('Scheduled scraping error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to run scheduled scraping',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Manual Scraping
          </CardTitle>
          <CardDescription>
            Scrape projects from active platforms using a custom search term
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter search term (e.g., 'react developer', 'python')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleScrape()}
            />
            <Button 
              onClick={handleScrape} 
              disabled={isLoading || !searchTerm.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Scrape
            </Button>
          </div>

          {lastResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Last Scraping Result</span>
                <Badge variant="secondary">
                  {lastResult.projects.length} projects found
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {lastResult.message}
              </p>
              <div className="flex gap-1">
                {lastResult.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Scheduled Scraping
          </CardTitle>
          <CardDescription>
            Run the scheduled scraping job manually (uses user preferences)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleScheduledScrape} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Run Scheduled Scrape
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
