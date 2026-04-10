'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isMobile } from '../../lib/experiment-utils'

interface DepthLayersProps {
  layers?: number
  className?: string
}

/**
 * Depth Layers Background
 * Multi-layer parallax with gradient depths
 * Used in: Om oss dark section
 */
export function DepthLayers({ 
  layers = 3,
  className 
}: DepthLayersProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const mobileView = typeof window !== 'undefined' ? isMobile() : false

  const layerConfig = [
    { depth: 'back', speed: 0.1, color: 'rgba(26, 26, 26, 1)', gradient: 'radial-gradient(ellipse at 30% 20%, rgba(0, 184, 212, 0.08) 0%, transparent 50%)' },
    { depth: 'mid', speed: 0.3, color: 'rgba(26, 26, 26, 0.95)', gradient: 'radial-gradient(ellipse at 70% 60%, rgba(0, 184, 212, 0.05) 0%, transparent 40%)' },
    { depth: 'front', speed: 0.5, color: 'rgba(26, 26, 26, 0.9)', gradient: 'none' },
  ]

  useEffect(() => {
    if (!containerRef.current || isReducedMotion || mobileView) return

    const ctx = gsap.context(() => {
      // Parallax effect for each layer
      layerConfig.slice(0, layers).forEach((layer, i) => {
        const target = containerRef.current?.querySelector(`[data-layer="${i}"]`)
        if (!target) return

        gsap.to(target, {
          y: -100 * (i + 1),
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
  }, [isReducedMotion, mobileView, layers])

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
      {layerConfig.slice(0, layers).map((layer, i) => (
        <div
          key={i}
          data-layer={i}
          className="absolute inset-0 transition-transform will-change-transform"
          style={{
            background: layer.gradient !== 'none' ? layer.gradient : layer.color,
          }}
        >
          {i === 0 && (
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="depth-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00B8D4" stopOpacity="0.1"/>
                  <stop offset="100%" stopColor="#00B8D4" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#depth-gradient)" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

export default DepthLayers