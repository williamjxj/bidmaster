'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Loading from '../loading'

export default function LoadingDemo() {
  const [showLoading, setShowLoading] = useState(false)

  if (showLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Loading Component Demo</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Click the button below to see our beautiful software outsourcing loading animation in action.
        </p>
        <Button 
          size="lg" 
          onClick={() => setShowLoading(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          Show Loading Animation
        </Button>
        <div className="mt-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
