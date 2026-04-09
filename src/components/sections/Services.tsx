'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Home, Bath, Building2, Hammer, Trees } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { services } from '@/lib/constants'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Home,
  Bath,
  Building2,
  Hammer,
  Wood: Trees,
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const cards = sectionRef.current?.querySelectorAll('.service-card')
    cards?.forEach((card, index) => {
      card.classList.add('opacity-0')
      ;(card as HTMLElement).style.animationDelay = `${index * 100}ms`
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Section background="light" padding="xl">
      <div ref={sectionRef}>
        <SectionHeader
          eyebrow="Vad vi gör"
          title="Våra tjänster"
          description="Oavsett om du behöver hjälp med ett litet snickeriarbete eller en större nybyggnation, har vi kompetensen och erfarenheten att leverera resultat som överträffar dina förväntningar."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Home
            
            return (
                <Link
                key={service.slug}
                href={`/tjanster/${service.slug}/`}
                className={cn(
                  'service-card group block bg-white rounded-3xl p-6 md:p-8',
                  'border border-[#E5E2DE] shadow-sm',
                  'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                  'hover:shadow-xl hover:shadow-earth/5 hover:-translate-y-2 hover:border-earth/20',
                  'opacity-0'
                )}
              >
                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                  'bg-earth/5 text-earth',
                  'transition-all duration-300 group-hover:bg-earth group-hover:text-white',
                  'group-hover:scale-110 group-hover:rotate-3'
                )}>
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-semibold text-text mb-3 group-hover:text-earth transition-colors">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {service.shortDescription}
                </p>
                
                {/* Features Preview */}
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-text-secondary leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-earth/60 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-earth font-medium text-sm group/link">
                  <span>Läs mer</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/tjanster/"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-full',
              'bg-brand text-white font-medium',
              'hover:bg-brand-light transition-all duration-300',
              'hover:shadow-lg hover:shadow-brand/25',
              'active:scale-[0.98]'
            )}
          >
            Se alla tjänster
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </Section>
  )
}
