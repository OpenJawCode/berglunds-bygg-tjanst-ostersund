'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, isMobile } from '../../lib/experiment-utils'

interface TextureRevealProps {
  variant?: 'wood' | 'concrete' | 'steel'
  intensity?: 'subtle' | 'medium' | 'bold'
  className?: string
}

/**
 * Texture Reveal Background
 * Construction material textures that reveal on scroll
 * Used in: Om oss values section
 */
export function TextureReveal({ 
  variant = 'concrete',
  intensity = 'subtle',
  className 
}: TextureRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const isReducedMotion = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const mobile = typeof window !== 'undefined' ? isMobile() : false

  useEffect(() => {
    if (isReducedMotion || mobile) return
    // Animation handled by CSS for hover states
  }, [isReducedMotion, mobile])

  const patterns = {
    wood: {
      svg: (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wood-grain" width="100" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M0 5 Q25 0 50 5 T100 5" fill="none" stroke="#8B5A2B" strokeWidth="0.5" opacity="0.3"/>
              <path d="M0 8 Q25 3 50 8 T100 8" fill="none" stroke="#8B5A2B" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wood-grain)" />
        </svg>
      ),
    },
    concrete: {
      svg: (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="concrete-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="#9E9E9E" opacity="0.15" />
          <rect width="100%" height="100%" filter="url(#concrete-noise)" opacity="0.1" />
        </svg>
      ),
    },
    steel: {
      svg: (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="steel-brush" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#607D8B" stopOpacity="0.1"/>
              <stop offset="50%" stopColor="#90A4AE" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#607D8B" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#steel-brush)" />
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#90A4AE" strokeWidth="0.5" opacity="0.1" />
          <line x1="20" y1="0" x2="0%" y2="20%" stroke="#90A4AE" strokeWidth="0.5" opacity="0.1" />
        </svg>
      ),
    },
  }

  const intensityMap = {
    subtle: 'opacity-50',
    medium: 'opacity-70',
    bold: 'opacity-100',
  }

  const { svg } = patterns[variant]

  return (
    <div 
      ref={containerRef}
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        'bg-white',
        className
      )}
      aria-hidden="true"
    >
      <div className={cn('absolute inset-0 transition-opacity duration-500', intensityMap[intensity])}>
        {svg}
      </div>

      {/* Glow effect on card hover - this would be controlled by parent component */}
      {hoveredCard !== null && (
        <div 
          className={cn(
            'absolute inset-0 bg-[#00B8D4]/5 transition-opacity duration-300',
            'animate-pulse'
          )}
        />
      )}
    </div>
  )
}

// Demo component with card grid to test texture reveal
interface TextureRevealDemoProps {
  onHoverChange?: (index: number | null) => void
}

export function TextureRevealDemo({ onHoverChange }: TextureRevealDemoProps) {
  const demoValues = [
    { title: 'Ärlig kommunikation', desc: 'Inga dolda kostnader' },
    { title: 'Respekt för ditt hem', desc: 'Vi städar efter oss' },
    { title: 'Hållbar kvalitet', desc: 'Byggt för generationer' },
    { title: 'Personligt ansvar', desc: 'Samma kontaktperson' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {demoValues.map((item, index) => (
        <div
          key={index}
          className="relative p-8 rounded-3xl border border-[#E5E2DE] bg-white hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => onHoverChange?.(index)}
          onMouseLeave={() => onHoverChange?.(null)}
        >
          <TextureReveal 
            variant="concrete" 
            intensity={index % 2 === 0 ? 'subtle' : 'medium'} 
          />
          <div className="relative z-10">
            <h3 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-3">
              {item.title}
            </h3>
            <p className="text-[#6B6B6B] leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TextureReveal