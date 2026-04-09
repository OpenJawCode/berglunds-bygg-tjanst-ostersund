'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceInlineCTAProps {
  className?: string
}

export function ServiceInlineCTA({ className }: ServiceInlineCTAProps) {
  const trustItems = [
    'ROT-avdrag',
    'Lokalt i Östersund',
    'Fullständig försäkring',
  ]

  return (
    <div className={cn('bg-[#080d12] py-16 md:py-20 relative overflow-hidden', className)}>
      {/* Subtle cyan radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 184, 212, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Heading */}
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-[#e8e4dc] mb-4">
            Redo att komma igång?
          </h2>

          {/* Subheading */}
          <p className="text-[#c8bfa8] text-base md:text-lg mb-8">
            Kostnadsfri offert inom 24 timmar. Ingen bindning.
          </p>

          {/* CTA Button */}
          <Link
            href="/offert/"
            className={cn(
              'group relative inline-flex items-center gap-2',
              'px-8 py-4 rounded-full',
              'bg-brand text-white font-semibold',
              'overflow-hidden',
              'transition-all duration-300',
              'hover:shadow-lg hover:shadow-brand/25',
              'active:scale-[0.98]'
            )}
            style={{
              background:
                'linear-gradient(90deg, #0096AD 0%, #00B8D4 50%, #0096AD 100%)',
              backgroundSize: '200% 100%',
            }}
            onMouseEnter={(e) => {
              import('gsap').then(({ gsap }) => {
                gsap.to(e.currentTarget, {
                  backgroundPosition: '100% 0',
                  duration: 0.4,
                  ease: 'power2.out',
                })
              })
            }}
            onMouseLeave={(e) => {
              import('gsap').then(({ gsap }) => {
                gsap.to(e.currentTarget, {
                  backgroundPosition: '0% 0',
                  duration: 0.4,
                  ease: 'power2.out',
                })
              })
            }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10">Begär offert</span>
            <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Trust micro-line */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-8">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
                <span className="text-[#c8bfa8] text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
