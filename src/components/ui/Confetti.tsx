'use client'

import { useEffect, useRef } from 'react'

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  width: number
  height: number
  color: string
  opacity: number
  gravity: number
  drag: number
}

const COLORS = ['#00B8D4', '#00C8E6', '#0096AD', '#10B981', '#F59E0B', '#e8e4dc', '#33C6DC']

export function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      onComplete?.()
      return
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 40

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
      const velocity = 4 + Math.random() * 6
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]

      particles.push({
        x: width / 2,
        y: height / 2 - 50,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        width: 4 + Math.random() * 6,
        height: 8 + Math.random() * 12,
        color,
        opacity: 1,
        gravity: 0.15,
        drag: 0.98,
      })
    }

    particlesRef.current = particles
    startTimeRef.current = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      if (elapsed > 3000) {
        ctx.clearRect(0, 0, width, height)
        onComplete?.()
        return
      }

      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.rotation += p.rotationSpeed

        // Fade out in last second
        if (elapsed > 2000) {
          p.opacity = Math.max(0, 1 - (elapsed - 2000) / 1000)
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}