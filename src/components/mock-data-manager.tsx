'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, Search, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MockDataSummary {
  total: number
  mock: number
  real: number
  mockPercentage: number
}

interface MockDataAnalysis {
  success: boolean
  summary: MockDataSummary
  mockProjects: any[]
  realProjects: any[]
}

export function MockDataManager() {
  const [analysis, setAnalysis] = useState<MockDataAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCleaningUp, setIsCleaningUp] = useState(false)

  const analyzeData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scrape/cleanup')
      const data = await response.json()
      
      if (data.success) {
        setAnalysis(data)
      } else {
        throw new Error(data.error || 'Failed to analyze data')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to analyze mock data',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cleanupMockData = async (dryRun: boolean = true) => {
    setIsCleaningUp(true)
    try {
      const response = await fetch('/api/scrape/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dryRun })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: dryRun ? "Dry Run Complete" : "Cleanup Complete",
          description: result.message
        })
        
        // Refresh analysis after cleanup
        if (!dryRun) {
          await analyzeData()
        }
      } else {
        throw new Error(result.error || 'Cleanup failed')
      }
    } catch (error) {
      console.error('Cleanup error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to cleanup mock data',
        variant: "destructive"
      })
    } finally {
      setIsCleaningUp(false)
    }
  }

  useEffect(() => {
    analyzeData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Mock Data Management
        </CardTitle>
        <CardDescription>
          Identify and manage mock/fake data in your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {analysis && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.summary.total}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{analysis.summary.mock}</div>
                <div className="text-sm text-muted-foreground">Mock Data</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{analysis.summary.real}</div>
                <div className="text-sm text-muted-foreground">Real Data</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{analysis.summary.mockPercentage}%</div>
                <div className="text-sm text-muted-foreground">Mock Percentage</div>
              </div>
            </div>

            {/* Alert */}
            {analysis.summary.mock > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Found {analysis.summary.mock} mock projects in your database. 
                  These are fake projects created for testing and should be cleaned up before production.
                </AlertDescription>
              </Alert>
            )}

            {analysis.summary.mock === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Great! No mock data found in your database. All projects appear to be real.
                </AlertDescription>
              </Alert>
            )}

            {/* Mock Data Preview */}
            {analysis.mockProjects.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Mock Data Examples:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analysis.mockProjects.slice(0, 5).map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm">
                      <div className="flex-1 truncate">
                        <div className="font-medium truncate">{project.title}</div>
                        <div className="text-xs text-muted-foreground">{project.source_url}</div>
                      </div>
                      <Badge variant="outline" className="text-orange-600">Mock</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => analyzeData()} 
                disabled={isLoading}
                variant="outline"
              >
                <Search className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
              
              {analysis.summary.mock > 0 && (
                <>
                  <Button 
                    onClick={() => cleanupMockData(true)} 
                    disabled={isCleaningUp}
                    variant="outline"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Dry Run Cleanup
                  </Button>
                  
                  <Button 
                    onClick={() => cleanupMockData(false)} 
                    disabled={isCleaningUp}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Mock Data
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {!analysis && isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Analyzing database for mock data...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
