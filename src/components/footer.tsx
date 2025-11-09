'use client'

import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>BidMaster Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <span>curated by Mobbin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

