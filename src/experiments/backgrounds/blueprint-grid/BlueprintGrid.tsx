'use client'

import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isMobile } from '../../lib/experiment-utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BlueprintGridProps {
  intensity?: 'subtle' | 'medium' | 'bold'
  className?: string
  animated?: boolean
}

export function BlueprintGrid({ 
  intensity = 'subtle', 
  className,
  animated = true 
}: BlueprintGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementsRef = useRef<HTMLDivElement>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const mobile = typeof window !== 'undefined' ? isMobile() : false

  const opacityMap = useMemo(() => ({
    subtle: 'opacity-[0.04]',
    medium: 'opacity-[0.07]',
    bold: 'opacity-[0.12]',
  }), [])

  useEffect(() => {
    if (!containerRef.current || isReducedMotion || mobile || !animated) return

    const ctx = gsap.context(() => {
      // Subtle float animation for construction icons
      const elements = containerRef.current?.querySelectorAll('.floating-element')
      if (elements) {
        elements.forEach((el, i) => {
          gsap.to(el, {
            y: -15,
            rotation: 8,
            duration: 4 + i * 0.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
          })
        })
      }

      // Parallax effect on scroll
      gsap.to(containerRef.current, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isReducedMotion, mobile, animated])

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
      {/* Animated Grid Pattern */}
      <svg 
        className={cn('absolute inset-0 w-full h-full', opacityMap[intensity])}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="blueprint-grid" 
            width="48" 
            height="48" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 48 0 L 0 0 0 48" 
              fill="none" 
              stroke="#00B8D4" 
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            {/* Corner dots for blueprint aesthetic */}
            <circle cx="0" cy="0" r="1" fill="#00B8D4" opacity="0.3" />
            <circle cx="48" cy="0" r="1" fill="#00B8D4" opacity="0.3" />
            <circle cx="0" cy="48" r="1" fill="#00B8D4" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>

      {/* Floating Construction Elements - Desktop only */}
      {!mobile && !isReducedMotion && (
        <div ref={elementsRef} className="absolute inset-0">
          {/* Hammer */}
          <svg 
            className="floating-element absolute top-[18%] left-[12%] w-10 h-10 text-[#00B8D4]/15"
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm12 6l-2.3-2.3 2.89-2.87-1.42-1.42L17.3 6.7 15 9h6v6zm-6-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L9 15v-6h6z"/>
          </svg>

          {/* Ruler */}
          <svg 
            className="floating-element absolute top-[62%] right-[18%] w-14 h-5 text-[#00B8D4]/12"
            viewBox="0 0 56 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="0" y="0" width="56" height="20" rx="2" fill="none" />
            <line x1="10" y1="4" x2="10" y2="16" />
            <line x1="20" y1="4" x2="20" y2="16" />
            <line x1="30" y1="4" x2="30" y2="16" />
            <line x1="40" y1="4" x2="40" y2="16" />
            <line x1="50" y1="4" x2="50" y2="16" />
          </svg>

          {/* Triangle */}
          <svg 
            className="floating-element absolute bottom-[28%] left-[22%] w-12 h-12 text-[#00B8D4]/10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 22h20L12 2z"/>
          </svg>

          {/* Square with rounded corners */}
          <svg 
            className="floating-element absolute top-[38%] right-[28%] w-10 h-10 text-[#00B8D4]/14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="4" y="4" width="16" height="16" rx="3" />
          </svg>

          {/* Plus sign */}
          <svg 
            className="floating-element absolute bottom-[15%] right-[15%] w-8 h-8 text-[#00B8D4]/11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default BlueprintGrid
