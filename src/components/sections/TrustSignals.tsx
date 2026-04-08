'use client'

import { useEffect, useRef } from 'react'
import { User, MapPin, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const trustSignals = [
  {
    icon: User,
    title: 'En kontaktperson',
    description: 'Du slipper jonglera med olika hantverkare. En och samma person följer dig genom hela projektet.',
  },
  {
    icon: MapPin,
    title: 'Lokalt förankrade',
    description: 'Vi känner Östersund och Jämtland. Snabb service och vi förstår lokala förhållanden.',
  },
  {
    icon: ClipboardCheck,
    title: 'Från planering till färdigt',
    description: 'Vi tar ansvar för varje detalj – från första skiss till slutbesiktning.',
  },
]

export default function TrustSignals() {
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
      { threshold: 0.2 }
    )

    const items = sectionRef.current?.querySelectorAll('.trust-item')
    items?.forEach((item, index) => {
      item.classList.add('opacity-0')
      ;(item as HTMLElement).style.animationDelay = `${index * 150}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background-light border-y border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {trustSignals.map((signal) => {
            const IconComponent = signal.icon
            
            return (
              <div
                key={signal.title}
                className={cn(
                  'trust-item flex flex-col items-center text-center md:items-start md:text-left',
                  'opacity-0'
                )}
              >
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center mb-5',
                  'bg-primary/5 text-primary'
                )}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-text mb-3">
                  {signal.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {signal.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
