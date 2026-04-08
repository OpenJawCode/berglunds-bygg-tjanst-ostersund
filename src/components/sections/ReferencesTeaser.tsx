'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'

const references = [
  { src: '/images/references/ref-1.jpg', alt: 'Badrumsrenovering Östersund', title: 'Badrumsrenovering', category: 'Badrum', location: 'Östersund' },
  { src: '/images/references/ref-2.jpg', alt: 'Takbyte Jämtland', title: 'Takbyte', category: 'Tak', location: 'Frösön' },
  { src: '/images/references/ref-3.jpg', alt: 'Nybyggnation Östersund', title: 'Nybyggnation', category: 'Nybyggnation', location: 'Östersund' },
  { src: '/images/references/ref-4.jpg', alt: 'Ombyggnation kök', title: 'Köksrenovering', category: 'Ombyggnation', location: 'Lit' },
  { src: '/images/references/ref-5.jpg', alt: 'Snickeriarbete', title: 'Specialsnickeri', category: 'Snickeri', location: 'Östersund' },
  { src: '/images/references/ref-6.jpg', alt: 'Renovering Östersund', title: 'Totalrenovering', category: 'Renovering', location: 'Frösön' },
]

export default function ReferencesTeaser() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

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

    const items = sectionRef.current?.querySelectorAll('.ref-item')
    items?.forEach((item, index) => {
      item.classList.add('opacity-0')
      ;(item as HTMLElement).style.animationDelay = `${index * 100}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Section background="light" padding="xl">
        <div ref={sectionRef}>
          <SectionHeader
            eyebrow="Vårt arbete"
            title="Referenser"
            description="Se några av våra senaste projekt. Varje bild representerar ett hem vi hjälpt till att förverkliga."
          />

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {references.map((ref, index) => (
              <button
                key={index}
                onClick={() => setLightboxImage(ref.src)}
                className={cn(
                  'ref-item group relative aspect-[3/4] rounded-2xl overflow-hidden',
                  'opacity-0 cursor-pointer',
                  index === 0 || index === 3 ? 'md:aspect-[3/5]' : ''
                )}
              >
                <Image
                  src={ref.src}
                  alt={ref.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-2 py-1 rounded bg-accent/20 text-accent text-xs font-medium mb-2">
                      {ref.category}
                    </span>
                    <h3 className="text-white font-heading text-xl font-semibold mb-1">
                      {ref.title}
                    </h3>
                    <p className="text-white/70 text-sm">{ref.location}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/referenser/"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                'bg-primary text-white font-medium',
                'hover:bg-primary-light transition-all duration-300',
                'hover:shadow-lg hover:shadow-primary/25'
              )}
            >
              Se alla referenser
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl aspect-[3/4] max-h-[85vh]">
            <Image
              src={lightboxImage}
              alt="Förstoring"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
