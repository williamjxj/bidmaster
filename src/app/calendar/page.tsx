'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Plus,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    // Use a stable date for SSR, will be updated on client
    return new Date(2025, 0, 1) // January 1, 2025
  })
  const [isClient, setIsClient] = useState(false)

  // Update to actual current date on client side
  useEffect(() => {
    setIsClient(true)
    setCurrentDate(new Date())
  }, [])
  
  // Mock calendar events
  const events = [
    {
      id: 1,
      title: "Project Deadline - E-commerce App",
      date: new Date(2025, 0, 15),
      type: "deadline",
      priority: "high"
    },
    {
      id: 2,
      title: "Follow up on Mobile App Bid",
      date: new Date(2025, 0, 18),
      type: "follow-up",
      priority: "medium"
    },
    {
      id: 3,
      title: "Client Meeting - Web Platform",
      date: new Date(2025, 0, 20),
      type: "meeting",
      priority: "high"
    },
    {
      id: 4,
      title: "Proposal Submission - AI Dashboard",
      date: new Date(2025, 0, 22),
      type: "submission",
      priority: "high"
    },
    {
      id: 5,
      title: "Project Kickoff - CRM System",
      date: new Date(2025, 0, 25),
      type: "kickoff",
      priority: "high"
    }
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertCircle className="h-3 w-3" />
      case 'meeting':
        return <CalendarIcon className="h-3 w-3" />
      case 'submission':
        return <Target className="h-3 w-3" />
      case 'kickoff':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getEventColor = (type: string, priority: string) => {
    const colors = {
      deadline: priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-red-50 text-red-700',
      meeting: priority === 'high' ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700',
      submission: priority === 'high' ? 'bg-purple-100 text-purple-800' : 'bg-purple-50 text-purple-700',
      kickoff: priority === 'high' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700',
      'follow-up': priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-orange-50 text-orange-700'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  const upcomingEvents = events
    .filter(event => isClient ? event.date >= new Date() : event.date >= currentDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Calendar</h1>
            <p className="page-description">Track deadlines, meetings, and important dates</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="panel-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-24"></div>
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const dayEvents = getEventsForDay(day)
                  const isToday = isClient && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 h-24 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                        isToday ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getEventColor(event.type, event.priority)}`}
                          >
                            {getEventIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Next 5 events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${getEventColor(event.type, event.priority)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {event.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <Badge className={`mt-1 ${getEventColor(event.type, event.priority)}`}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <p className="text-sm text-gray-600">Total Events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.type === 'deadline').length}
              </div>
              <p className="text-sm text-gray-600">Project Deadlines</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.type === 'meeting').length}
              </div>
              <p className="text-sm text-gray-600">Scheduled Meetings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.type === 'submission').length}
              </div>
              <p className="text-sm text-gray-600">Proposal Due</p>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  )
}
