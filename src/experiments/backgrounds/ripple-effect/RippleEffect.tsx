'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '../../lib/experiment-utils'

interface RippleEffectProps {
  intensity?: 'subtle' | 'medium' | 'bold'
  color?: string
  className?: string
}

/**
 * Ripple Effect Background
 * Concentric ripple animation emanating from a point
 * Used in: Kontakt hero section
 */
export function RippleEffect({ 
  intensity = 'medium',
  color = '#00B8D4',
  className 
}: RippleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false

  const rippleCount = intensity === 'subtle' ? 2 : intensity === 'medium' ? 3 : 4

  useEffect(() => {
    if (!containerRef.current || isReducedMotion) return

    const ctx = gsap.context(() => {
      const ripples = containerRef.current?.querySelectorAll('.ripple-ring')
      
      if (ripples) {
        ripples.forEach((ripple, i) => {
          gsap.fromTo(
            ripple,
            { 
              scale: 0, 
              opacity: 0.3,
            },
            {
              scale: 3,
              opacity: 0,
              duration: 3,
              delay: i * 0.8,
              repeat: -1,
              ease: 'power2.out',
            }
          )
        })
      }
    })

    return () => ctx.revert()
  }, [isReducedMotion, rippleCount])

  return (
    <div 
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        'bg-[#F8F6F3]',
        className
      )}
      aria-hidden="true"
    >
      {/* Central pin point */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          width: 12, 
          height: 12,
        }}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        {/* Ripple rings */}
        {Array.from({ length: rippleCount }).map((_, i) => (
          <div
            key={i}
            className="ripple-ring absolute inset-0 rounded-full border-2"
            style={{ 
              borderColor: color,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default RippleEffect