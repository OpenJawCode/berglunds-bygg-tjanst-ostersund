'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isMobile } from '../../lib/experiment-utils'

interface FloatingElementsProps {
  density?: 'low' | 'medium' | 'high'
  colorScheme?: 'teal' | 'mixed'
  className?: string
}

/**
 * Floating Elements Background
 * Abstract geometric shapes that float and parallax on scroll
 * Used in: Om oss "Why Choose Us" dark section
 */
export function FloatingElements({ 
  density = 'medium',
  colorScheme = 'teal',
  className 
}: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const mobile = typeof window !== 'undefined' ? isMobile() : false

  const densityMap = {
    low: 3,
    medium: 6,
    high: 12,
  }

  const elementCount = densityMap[density]
  const color = colorScheme === 'teal' ? '#00B8D4' : '#4A90A4'

  // Generate random positions and sizes
  const elements = Array.from({ length: elementCount }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20, // 20-80px
    left: `${Math.random() * 80 + 10}%`,
    top: `${Math.random() * 80 + 10}%`,
    delay: Math.random() * 2,
    duration: Math.random() * 4 + 4, // 4-8s
    rotation: Math.random() * 360,
    shape: ['triangle', 'circle', 'square', 'line'][Math.floor(Math.random() * 4)] as 'triangle' | 'circle' | 'square' | 'line',
  }))

  useEffect(() => {
    if (!containerRef.current || isReducedMotion || mobile) return

    const ctx = gsap.context(() => {
      // Float animation for each element
      elements.forEach((el, i) => {
        const target = containerRef.current?.querySelector(`[data-float-id="${i}"]`)
        if (!target) return

        gsap.to(target, {
          y: -30,
          rotation: el.rotation + 15,
          duration: el.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: el.delay,
        })

        // Parallax on scroll
        gsap.to(target, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [isReducedMotion, mobile, elements])

  const renderShape = (shape: string, size: number) => {
    const colorWithOpacity = `${color}/${Math.random() * 10 + 5}%` // 5-15% opacity

    switch (shape) {
      case 'circle':
        return <div className="rounded-full" style={{ width: size, height: size, backgroundColor: colorWithOpacity }} />
      case 'square':
        return <div className="rounded-sm" style={{ width: size, height: size, backgroundColor: colorWithOpacity }} />
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: 0.1 }}>
            <path d="M12 2L2 22h20L12 2z" fill={color} />
          </svg>
        )
      case 'line':
        return (
          <div 
            style={{ 
              width: size * 1.5, 
              height: 2, 
              backgroundColor: colorWithOpacity,
              transform: `rotate(${Math.random() * 45 - 22.5}deg)`
            }} 
          />
        )
      default:
        return null
    }
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
      {elements.map((el, i) => (
        <div
          key={el.id}
          data-float-id={i}
          className="absolute transition-transform"
          style={{
            left: el.left,
            top: el.top,
            willChange: 'transform',
          }}
        >
          {renderShape(el.shape, el.size)}
        </div>
      ))}
    </div>
  )
}

export default FloatingElements