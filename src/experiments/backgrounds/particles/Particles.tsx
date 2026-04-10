'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isMobile } from '../../lib/experiment-utils'

interface ParticlesProps {
  density?: 'low' | 'medium' | 'high'
  color?: string
  className?: string
}

/**
 * Particles Background
 * Lightweight particle drift effect (construction dust aesthetic)
 * Used in: Om oss dark section
 */
export function Particles({ 
  density = 'medium',
  color = '#00B8D4',
  className 
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const mobileView = typeof window !== 'undefined' ? isMobile() : false

  const particleCount = density === 'low' ? 20 : density === 'medium' ? 40 : 80

  useEffect(() => {
    if (!canvasRef.current || isReducedMotion || mobileView) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth
        canvas.height = containerRef.current.offsetHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle class - needs ctx passed to it
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.3 + 0.1
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around
        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fillStyle = color
        context.globalAlpha = this.opacity
        context.fill()
      }
    }

    // Create particles
    const particles = Array.from({ length: particleCount }, () => new Particle(canvas.width, canvas.height))

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height)
        particle.draw(ctx)
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [isReducedMotion, mobileView, particleCount, color])

  // Fallback: simple CSS animation for reduced motion or mobile
  if (isReducedMotion || mobileView) {
    return (
      <div 
        ref={containerRef}
        className={cn(
          'absolute inset-0 overflow-hidden pointer-events-none',
          'bg-[#1A1A1A]',
          className
        )}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${color} 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        'bg-[#1A1A1A]',
        className
      )}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

export default Particles