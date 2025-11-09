'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Download } from 'lucide-react'

// Simple donut chart component
function DonutChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const angle = (percentage / 100) * 360
          const largeArcFlag = angle > 180 ? 1 : 0
          
          const x1 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180)
          const y1 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180)
          const x2 = 50 + 50 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
          const y2 = 50 + 50 * Math.sin(((currentAngle + angle) * Math.PI) / 180)

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`,
          ].join(' ')

          currentAngle += angle

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          )
        })}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">142</div>
          <div className="text-xs text-muted-foreground">Projects</div>
        </div>
      </div>
    </div>
  )
}

export function ProjectDistributionChart() {
  // Using Ocean Breeze theme colors
  const distributionData = [
    { label: 'Upwork', value: 68.42, color: '#3b82f6' }, // Primary blue
    { label: 'Freelancer', value: 10.52, color: '#10b981' }, // Secondary green
    { label: 'Toptal', value: 21.05, color: '#8b5cf6' }, // Accent purple
  ]

  const topStakeholders = [
    { name: 'Upwork Projects', initials: 'UP', percentage: 68.42, color: 'bg-primary text-primary-foreground' },
    { name: 'Freelancer Projects', initials: 'FL', percentage: 10.52, color: 'bg-secondary text-secondary-foreground' },
    { name: 'Toptal Projects', initials: 'TO', percentage: 21.05, color: 'bg-accent text-accent-foreground' },
  ]

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl">Project Distribution</CardTitle>
            <CardDescription className="text-base">Projects by platform in your portfolio</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center lg:items-start">
          <div className="flex-shrink-0">
            <DonutChart data={distributionData} />
          </div>
          
          <div className="flex-1 space-y-8 w-full">
            <div className="flex items-center gap-4 pb-6 border-b">
              <Button variant="outline" size="sm" className="text-xs">
                Fully Diluted
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Undiluted
              </Button>
            </div>

            <div className="space-y-6">
              <div className="text-base font-semibold text-muted-foreground uppercase tracking-wide">Top Platforms</div>
              <div className="space-y-5">
                {topStakeholders.map((stakeholder) => (
                  <div key={stakeholder.name} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className={`${stakeholder.color} text-xs font-semibold`}>
                        {stakeholder.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate">{stakeholder.name}</span>
                        <span className="text-muted-foreground font-semibold ml-2 flex-shrink-0">{stakeholder.percentage}%</span>
                      </div>
                      <Progress value={stakeholder.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

