'use client'

import { ShieldCheck, MapPin, Receipt, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrustBadgesStripProps {
  className?: string
}

export function TrustBadgesStrip({ className }: TrustBadgesStripProps) {
  const badges = [
    {
      icon: ShieldCheck,
      text: 'Fullständig ansvarsförsäkring',
    },
    {
      icon: MapPin,
      text: 'Lokalt i Östersund & Jämtland',
    },
    {
      icon: Receipt,
      text: 'ROT-avdrag — vi hanterar ansökan',
    },
    {
      icon: Star,
      text: 'Kostnadsfri besiktning',
    },
  ]

  return (
    <div className={cn('bg-[#080d12] py-6', className)}>
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div key={badge.text} className="flex items-center">
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-3.5 h-3.5 text-brand"
                    strokeWidth={1.5}
                  />
                  <span className="text-[11px] text-[#c8bfa8] whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
                {index < badges.length - 1 && (
                  <span className="text-brand/40 mx-2">·</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
