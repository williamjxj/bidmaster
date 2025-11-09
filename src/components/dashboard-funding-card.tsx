'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function DashboardFundingCard() {
  const successRate = 68
  const successRateChange = -2.1
  const activeBids = 23
  const activeBidsChange = 5.2
  const monthlyRevenue = 12800
  const monthlyRevenueChange = 18.3

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-xl md:text-2xl">Project Pipeline</CardTitle>
        <CardDescription className="text-base">Current project status overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Success Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
            <span className="text-sm font-semibold">{successRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={successRate} className="h-2 flex-1" />
            <span className={`text-xs font-medium ${successRateChange < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {successRateChange > 0 ? '+' : ''}{successRateChange}%
            </span>
          </div>
        </div>

        {/* Active Bids */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Active Bids</span>
            <span className="text-sm font-semibold">{activeBids}</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={(activeBids / 30) * 100} className="h-2 flex-1" />
            <span className="text-xs font-medium text-emerald-600">
              +{activeBidsChange}%
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">This Month</span>
            <span className="text-sm font-semibold">${(monthlyRevenue / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={(monthlyRevenue / 20000) * 100} className="h-2 flex-1" />
            <span className="text-xs font-medium text-emerald-600">
              +{monthlyRevenueChange}%
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm md:text-base text-muted-foreground">23 days left</div>
          <Button size="sm">Update</Button>
        </div>
      </CardContent>
    </Card>
  )
}

