'use client'

import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface FloatingActionButtonProps {
  onClick?: () => void
  className?: string
}

export function FloatingActionButton({ onClick, className = '' }: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Button
        onClick={onClick}
        size="lg"
        className="group relative overflow-hidden rounded-full w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-float border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background ripple effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300" />
        
        {/* Animated icon */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isHovered ? (
            <Sparkles className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Plus className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" />
          )}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl animate-pulse" />
        
        {/* Hover particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.1s'}} />
            <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.3s'}} />
            <div className="absolute bottom-3 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.7s'}} />
          </div>
        )}
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          Add New Project
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  )
}
