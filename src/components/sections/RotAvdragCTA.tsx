'use client'

import Link from 'next/link'
import { ArrowRight, Calculator, Check } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const benefits = [
  'Få tillbaka 30% av arbetskostnaden',
  'Maximalt 50 000 kr per person och år',
  'Vi hjälper dig med allt pappersarbete',
  'Gäller för de flesta av våra tjänster',
]

export default function RotAvdragCTA() {
  return (
    <Section background="dark" padding="xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Content */}
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium uppercase tracking-wider mb-4">
            Skatteavdrag
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Sänk kostnaden med{' '}
            <span className="text-accent">ROT-avdrag</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Som privatperson har du rätt till skattereduktion för arbetskostnaden 
            vid reparation och underhåll av bostaden. Vi hjälper dig att utnyttja 
            detta och sköter all administration.
          </p>

          {/* Benefits List */}
          <ul className="space-y-4 mb-8">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/90">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/rot-avdrag/">
              <Button
                className={cn(
                  'group bg-accent text-white hover:bg-accent-light',
                  'shadow-lg shadow-accent/25'
                )}
              >
                Läs mer om ROT-avdrag
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/offert/">
              <Button
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Räkna på din renovering
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual/Stats */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-heading font-bold text-accent mb-2">
                30%
              </div>
              <p className="text-white/70 text-sm">Tillbaka på arbetskostnaden</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                50k
              </div>
              <p className="text-white/70 text-sm">Maximalt per person och år</p>
            </div>
            <div className="col-span-2 bg-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-accent/20">
              <p className="text-white/90 text-center">
                <span className="font-semibold">Exempel:</span> En badrumsrenovering för 150 000 kr 
                kan med ROT-avdrag kosta dig bara{' '}
                <span className="text-accent font-bold">105 000 kr</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
