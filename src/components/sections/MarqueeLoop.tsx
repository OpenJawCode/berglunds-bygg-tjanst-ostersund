'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const marqueeItems = [
  'Lokalt i Östersund',
  'ROT-avdrag 30%',
  'Fullständig ansvarsförsäkring',
  'Kostnadsfri offert',
  'Från idé till inflyttning',
  'Jämtlands hantverk',
]

export default function MarqueeLoop() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scroller = container.querySelector('.marquee-content') as HTMLElement
    if (!scroller) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    scroller.style.animation = 'marquee 40s linear infinite'
  }, [])

  return (
    <div
      ref={containerRef}
      className="hide-mobile overflow-hidden py-4 bg-primary/5 border-y border-primary/10"
    >
      <div className="marquee-content flex items-center gap-8 whitespace-nowrap">
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex items-center gap-3 text-xs font-medium uppercase tracking-widest',
              'text-primary'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {item}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  )
}
