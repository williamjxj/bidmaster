'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  ripple?: boolean
  glow?: boolean
  pulse?: boolean
}

export function EnhancedButton({
  children,
  className,
  ripple = true,
  glow = false,
  pulse = false,
  onClick,
  ...props
}: EnhancedButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }
    
    onClick?.(event)
  }

  return (
    <Button
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        glow && 'hover:shadow-lg hover:shadow-blue-500/25',
        pulse && 'animate-pulse',
        'hover:scale-105 active:scale-95',
        'focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s linear'
          }}
        />
      ))}
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </Button>
  )
}

// Add ripple keyframe to global CSS
const rippleKeyframes = `
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = rippleKeyframes
  document.head.appendChild(style)
}
