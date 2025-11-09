'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, TrendingUp, FileText, CheckCircle2, ChevronRight } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'action' | 'offer' | 'announcement'
  label: string
  value: string | null
  trend?: 'up' | 'down'
}

export function DashboardActivity() {
  const activityItems: ActivityItem[] = [
    { id: '1', type: 'action', label: 'ACTION ITEMS', value: '1', trend: undefined },
    { id: '2', type: 'offer', label: 'Bids submitted', value: '12', trend: 'up' },
    { id: '3', type: 'offer', label: 'Bids won', value: '3', trend: 'up' },
    { id: '4', type: 'announcement', label: 'Projects discovered', value: '24', trend: 'up' },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'action':
        return Bell
      case 'offer':
        return FileText
      case 'announcement':
        return TrendingUp
      default:
        return CheckCircle2
    }
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-xl md:text-2xl">Activity</CardTitle>
        <CardDescription className="text-base">Last 30 days vs Previous</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activityItems.map((item) => {
            const Icon = getIcon(item.type)
            return (
              <div key={item.id} className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="p-3.5 rounded-lg bg-muted flex-shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm md:text-base font-medium text-muted-foreground">{item.label}</div>
                    {item.value && (
                      <div className="text-3xl md:text-4xl font-bold mt-2">{item.value}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.trend && (
                    <>
                      {item.trend === 'up' && (
                        <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12%
                        </Badge>
                      )}
                    </>
                  )}
                  {item.type === 'action' && (
                    <Button variant="ghost" size="sm" className="gap-1">
                      View
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

