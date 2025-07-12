'use client'

import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  particleColor?: string
  particleSize?: number
  speed?: number
}

export function ParticleBackground({
  className = '',
  particleCount = 50,
  particleColor = '#3b82f6',
  particleSize = 2,
  speed = 0.5
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    updateSize()

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      decay: number

      constructor() {
        this.x = Math.random() * (canvas?.width || 0)
        this.y = Math.random() * (canvas?.height || 0)
        this.vx = (Math.random() - 0.5) * speed
        this.vy = (Math.random() - 0.5) * speed
        this.life = 1
        this.decay = Math.random() * 0.01 + 0.005
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life -= this.decay

        // Wrap around screen
        if (canvas) {
          if (this.x < 0) this.x = canvas.width
          if (this.x > canvas.width) this.x = 0
          if (this.y < 0) this.y = canvas.height
          if (this.y > canvas.height) this.y = 0
        }

        // Reset particle if life is depleted
        if (this.life <= 0) {
          this.x = Math.random() * (canvas?.width || 0)
          this.y = Math.random() * (canvas?.height || 0)
          this.life = 1
        }
      }

      draw() {
        if (ctx) {
          ctx.save()
          ctx.globalAlpha = this.life
          ctx.fillStyle = particleColor
          ctx.beginPath()
          ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw particles
        particles.forEach(particle => {
          particle.update()
          particle.draw()
        })

        // Draw connections between nearby particles
        particles.forEach((particle, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[j].x - particle.x
            const dy = particles[j].y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.save()
              ctx.globalAlpha = (100 - distance) / 100 * 0.2
              ctx.strokeStyle = particleColor
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
              ctx.restore()
            }
          }
        })
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [particleCount, particleColor, particleSize, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}
