'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Search, FileText, DollarSign, TrendingUp, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SummaryCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tooltip?: string
}

function SummaryCard({ label, value, icon: Icon, tooltip }: SummaryCardProps) {
  const content = (
    <Card className="border shadow-sm">
      <CardContent className="flex items-center justify-between py-5 md:py-6 lg:py-7">
        <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
          <div className="p-3.5 rounded-lg bg-muted flex-shrink-0">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold truncate">{value}</div>
            <div className="text-sm md:text-base text-muted-foreground mt-2 truncate">{label}</div>
          </div>
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-md hover:bg-muted flex-shrink-0 ml-4">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )

  return tooltip ? (
    <TooltipProvider>{content}</TooltipProvider>
  ) : content
}

export function DashboardSummaryCards() {
  const stats = [
    {
      label: 'Active Projects',
      value: '142',
      icon: Users,
      tooltip: 'Total number of projects you are currently tracking',
    },
    {
      label: 'Total Projects',
      value: '1,247',
      icon: Search,
      tooltip: 'Total projects discovered across all platforms',
    },
    {
      label: 'Active Bids',
      value: '23',
      icon: FileText,
      tooltip: 'Number of proposals currently in progress',
    },
    {
      label: 'Total Revenue',
      value: '$15,600',
      icon: DollarSign,
      tooltip: 'Total earnings from completed projects',
    },
    {
      label: 'Avg. Bid Value',
      value: '$2,631',
      icon: TrendingUp,
      tooltip: 'Average value per successful bid',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
      {stats.map((stat) => (
        <SummaryCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

