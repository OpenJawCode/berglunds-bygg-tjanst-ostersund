import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

export const metadata: Metadata = {
  title: 'Referenser | Berglunds Byggtjänst Östersund',
  description: 'Se våra senaste projekt inom takbyte, badrumsrenovering, nybyggnation och ombyggnation i Östersund och Jämtland.',
}

const references = [
  { src: '/images/references/ref-1.jpg', alt: 'Badrumsrenovering Östersund', title: 'Badrumsrenovering', category: 'Badrum', location: 'Östersund' },
  { src: '/images/references/ref-2.jpg', alt: 'Takbyte Jämtland', title: 'Takbyte', category: 'Tak', location: 'Frösön' },
  { src: '/images/references/ref-3.jpg', alt: 'Nybyggnation Östersund', title: 'Nybyggnation', category: 'Nybyggnation', location: 'Östersund' },
  { src: '/images/references/ref-4.jpg', alt: 'Ombyggnation kök', title: 'Köksrenovering', category: 'Ombyggnation', location: 'Lit' },
  { src: '/images/references/ref-5.jpg', alt: 'Snickeriarbete', title: 'Specialsnickeri', category: 'Snickeri', location: 'Östersund' },
  { src: '/images/references/ref-6.jpg', alt: 'Renovering Östersund', title: 'Totalrenovering', category: 'Renovering', location: 'Frösön' },
]

const categories = ['Alla', 'Tak', 'Badrum', 'Nybyggnation', 'Ombyggnation', 'Snickeri', 'Renovering']

export default function ReferencesPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom text-center max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
              Våra projekt
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Se några av våra senaste projekt. Varje bild representerar ett hem vi 
              hjälpt till att förverkliga i Östersund och Jämtland.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <Section background="light" padding="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {references.map((ref, index) => (
              <div
                key={index}
                className={cn(
                  'group relative aspect-[3/4] rounded-2xl overflow-hidden',
                  index === 0 || index === 4 ? 'md:aspect-[3/5]' : ''
                )}
              >
                <Image
                  src={ref.src}
                  alt={ref.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-2 py-1 rounded bg-accent/20 text-accent text-xs font-medium mb-2">
                      {ref.category}
                    </span>
                    <h3 className="text-white font-heading text-xl font-semibold mb-1">
                      {ref.title}
                    </h3>
                    <p className="text-white/70 text-sm">{ref.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-text-muted mb-4">
              Vill du se mer av vårt arbete?
            </p>
            <a
              href={"https://www.instagram.com/berglundsbyggtjanstosd"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                'bg-primary text-white font-medium',
                'hover:bg-primary-light transition-all duration-300'
              )}
            >
              Följ oss på Instagram
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
