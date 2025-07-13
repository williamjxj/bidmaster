'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const projectData = [
  { month: "Jan", upwork: 45, freelancer: 32, toptal: 12 },
  { month: "Feb", upwork: 52, freelancer: 28, toptal: 15 },
  { month: "Mar", upwork: 48, freelancer: 35, toptal: 18 },
  { month: "Apr", upwork: 61, freelancer: 42, toptal: 22 },
  { month: "May", upwork: 55, freelancer: 38, toptal: 19 },
  { month: "Jun", upwork: 67, freelancer: 45, toptal: 25 },
]

function SimpleBarChart({ data }: { data: typeof projectData }) {
  const maxValue = Math.max(...data.flatMap(d => [d.upwork, d.freelancer, d.toptal]))
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="text-sm font-medium">{item.month}</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-16 text-xs">Upwork</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(item.upwork / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs text-right">{item.upwork}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 text-xs">Freelancer</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(item.freelancer / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs text-right">{item.freelancer}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 text-xs">Toptal</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(item.toptal / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs text-right">{item.toptal}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SimpleLineChart({ data }: { data: typeof projectData }) {
  const maxValue = Math.max(...data.flatMap(d => [d.upwork, d.freelancer, d.toptal]))
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Upwork</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Freelancer</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
          <span>Toptal</span>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-4 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="flex-1 flex flex-col justify-end space-y-1">
              <div 
                className="bg-blue-500 w-6 rounded-t"
                style={{ height: `${(item.upwork / maxValue) * 100}%`, minHeight: '2px' }}
              />
              <div 
                className="bg-green-500 w-6 rounded-t"
                style={{ height: `${(item.freelancer / maxValue) * 100}%`, minHeight: '2px' }}
              />
              <div 
                className="bg-purple-500 w-6 rounded-t"
                style={{ height: `${(item.toptal / maxValue) * 100}%`, minHeight: '2px' }}
              />
            </div>
            <div className="text-xs">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProjectCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects by Platform</CardTitle>
          <CardDescription>Distribution of projects across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={projectData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Trends</CardTitle>
          <CardDescription>Monthly project volume by platform</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={projectData} />
        </CardContent>
      </Card>
    </div>
  )
}
