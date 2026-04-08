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
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
  }, [])

  // Triple the items for seamless loop
  const tripleItems = [...marqueeItems, ...marqueeItems, ...marqueeItems]

  return (
    <div
      ref={containerRef}
      className="hidden md:block overflow-hidden py-4 bg-brand/5 border-y border-brand/10"
    >
      <div className="marquee-track flex items-center animate-marquee hover:[animation-play-state:paused]">
        {tripleItems.map((item, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex items-center gap-3 whitespace-nowrap',
              'text-xs font-medium uppercase tracking-[0.15em]',
              'text-brand px-6'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
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
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  )
}
