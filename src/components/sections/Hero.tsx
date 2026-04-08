'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/constants'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY
        const parallaxSpeed = 0.5
        imageRef.current.style.transform = `translateY(${scrollY * parallaxSpeed}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[20%] -bottom-[20%] will-change-transform"
      >
        <Image
          src="/images/hero/hero-main.jpg"
          alt="Berglunds Byggtjänst - Kvalitetsbyggnation i Östersund"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-4xl">
          {/* ROT Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-up">
            <Check className="w-4 h-4 text-accent" />
            <span className="text-white text-sm font-medium">
              ROT-avdrag gäller – spara 30% på arbetskostnaden
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 animate-fade-up animation-delay-100">
            Kvalitetsbyggnation<br />
            <span className="text-accent">i Östersund</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mb-8 leading-relaxed animate-fade-up animation-delay-200">
            Vi tar hand om hela ditt byggprojekt. Oavsett om du drömmer om ett nytt badrum, 
            planerar en tillbyggnad eller ska bygga nytt – vi finns med dig hela vägen.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap gap-4 mb-10 animate-fade-up animation-delay-300">
            {['En kontaktperson', 'Lokalt förankrade', 'Från planering till färdigt'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/80">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-400">
            <Link href={siteConfig.cta.href}>
              <Button
                size="lg"
                className={cn(
                  'group bg-white text-primary hover:bg-white/90',
                  'shadow-lg shadow-black/20'
                )}
              >
                Få en kostnadsfri offert
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/tjanster/">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10"
              >
                Se våra tjänster
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/60 text-xs uppercase tracking-wider">Scrolla ner</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
