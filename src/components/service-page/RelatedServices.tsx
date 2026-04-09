'use client'

import Link from 'next/link'
import {
  Home,
  Bath,
  Building2,
  Hammer,
  Trees,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { services } from '@/lib/constants'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } =
  {
    Home,
    Bath,
    Building2,
    Hammer,
    Wood: Trees,
  }

interface RelatedServicesProps {
  relatedSlugs: string[]
  className?: string
}

export function RelatedServices({
  relatedSlugs,
  className,
}: RelatedServicesProps) {
  const relatedServices = services.filter((s) => relatedSlugs.includes(s.slug))

  return (
    <div className={cn('bg-[#080d12] py-16 md:py-20', className)}>
      <div className="container-custom">
        {/* Header */}
        <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#e8e4dc] mb-8 text-center">
          Relaterade tjänster
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[700px] mx-auto">
          {relatedServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Home

            return (
              <Link
                key={service.slug}
                href={`/tjanster/${service.slug}/`}
                className={cn(
                  'group block rounded-2xl p-6',
                  'bg-[#111820] border border-white/5',
                  'transition-all duration-300',
                  'hover:border-brand/20 hover:bg-[#111820]/80',
                  'hover:-translate-y-1'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    'bg-brand/10 text-brand',
                    'transition-all duration-300',
                    'group-hover:bg-brand group-hover:text-white',
                    'group-hover:scale-110'
                  )}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg font-semibold text-[#e8e4dc] mb-2 group-hover:text-brand transition-colors">
                  {service.title}
                </h3>
                <p className="text-[#c8bfa8] text-sm mb-4">
                  {service.shortDescription}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-1 text-brand text-sm font-medium">
                  Läs mer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
