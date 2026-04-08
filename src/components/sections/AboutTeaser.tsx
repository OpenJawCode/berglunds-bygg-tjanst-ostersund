'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Heart, Shield, User } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

const values = [
  {
    icon: MessageCircle,
    title: 'Ärlig kommunikation',
    description: 'Inga dolda kostnader eller överraskningar. Vi säger som det är.',
  },
  {
    icon: Heart,
    title: 'Respekt för ditt hem',
    description: 'Vi städar efter oss och är varsamma med din egendom.',
  },
  {
    icon: Shield,
    title: 'Hållbar kvalitet',
    description: 'Vi bygger för att hålla i generationer, inte bara idag.',
  },
  {
    icon: User,
    title: 'Personligt ansvar',
    description: 'Du når alltid samma person som känner ditt projekt.',
  },
]

export default function AboutTeaser() {
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
      { threshold: 0.1 }
    )

    const items = sectionRef.current?.querySelectorAll('.value-item')
    items?.forEach((item, index) => {
      item.classList.add('opacity-0')
      ;(item as HTMLElement).style.animationDelay = `${index * 100}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Section background="light" padding="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden order-2 lg:order-1">
          <Image
            src="/images/references/ref-6.jpg"
            alt="Berglunds Byggtjänst - Lokalt byggföretag i Östersund"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-4">
            Om oss
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
            Byggt med passion i Östersund
          </h2>
          <p className="text-text-muted text-lg mb-6 leading-relaxed">
            Berglunds Byggtjänst grundades med en enkel vision: att leverera kvalitetsbyggnation 
            med personlig service. Vi är ett lokalt team i Östersund som brinner för att skapa 
            hem där människor trivs.
          </p>
          <p className="text-text-muted mb-8 leading-relaxed">
            För oss är varje projekt unikt. Vi tar oss tid att lyssna på dina önskemål, 
            förstår din budget och levererar alltid mer än vad som förväntas. Ingen 
            standardlösningar – bara genomtänkt hantverk anpassat efter just ditt hem.
          </p>

          {/* Values Grid */}
          <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {values.map((value) => {
              const IconComponent = value.icon
              
              return (
                <div
                  key={value.title}
                  className={cn(
                    'value-item flex items-start gap-3 opacity-0'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text mb-1">
                      {value.title}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <Link
            href="/om-oss/"
            className={cn(
              'inline-flex items-center gap-2 text-primary font-medium',
              'hover:gap-3 transition-all duration-300'
            )}
          >
            Lär känna oss bättre
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </Section>
  )
}
