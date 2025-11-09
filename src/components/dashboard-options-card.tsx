'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MessageCircle } from 'lucide-react'

export function DashboardOptionsCard() {
  const allocated = 0
  const total = 8
  const allocatedPercentage = total > 0 ? (allocated / total) * 100 : 0

  return (
    <Card className="relative">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl">Total Bids</CardTitle>
            <CardDescription className="text-base">Bid allocation status</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">1 pool</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Allocated</span>
            <span className="text-sm font-semibold">{allocatedPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={allocatedPercentage} className="h-2.5" />
          <div className="text-sm text-muted-foreground pt-1">{total} Total bids</div>
        </div>
      </CardContent>
      <div className="absolute bottom-4 right-4">
        <button className="p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </Card>
  )
}

