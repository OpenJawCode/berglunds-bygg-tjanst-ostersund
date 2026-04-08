'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function FinalCTA() {
  return (
    <Section background="primary" padding="xl">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Redo att starta ditt projekt?
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed">
          Låt oss hjälpa dig att förverkliga dina byggdrömmar. 
          Kontakta oss idag för en kostnadsfri offert och rådgivning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={siteConfig.cta.href}>
            <Button
              size="lg"
              className={cn(
                'group bg-white text-text hover:bg-white/90',
                'shadow-lg shadow-black/20'
              )}
            >
              Få en kostnadsfri offert
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-full',
              'border-2 border-white/30 text-white font-medium',
              'hover:bg-white/10 transition-all duration-300'
            )}
          >
            <Phone className="w-5 h-5" />
            {siteConfig.phone}
          </a>
        </div>

        <p className="text-white/60 text-sm mt-8">
          Vi återkommer inom 24 timmar
        </p>
      </div>
    </Section>
  )
}
