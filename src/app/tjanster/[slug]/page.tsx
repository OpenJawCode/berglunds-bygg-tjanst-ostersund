import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ArrowRight, Phone, Home, Bath, Building2, Hammer, Trees } from 'lucide-react'
import { services, siteConfig } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

import { servicePageData, relatedServicesMap } from '@/lib/service-data'
import { ProcessTimeline } from '@/components/service-page/ProcessTimeline'
import { ServiceAccordion } from '@/components/service-page/ServiceAccordion'
import { RotCalculator } from '@/components/service-page/RotCalculator'
import { ServiceFAQ } from '@/components/service-page/ServiceFAQ'
import { TrustBadgesStrip } from '@/components/service-page/TrustBadgesStrip'
import { ServiceInlineCTA } from '@/components/service-page/ServiceInlineCTA'
import { ServiceTimelineStats } from '@/components/service-page/ServiceTimelineStats'
import { RelatedServices } from '@/components/service-page/RelatedServices'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Home,
  Bath,
  Building2,
  Hammer,
  Wood: Trees,
}

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug)
  if (!service) return { title: 'Tjänst hittades inte' }

  return {
    title: `${service.title} | Berglunds Byggtjänst Östersund`,
    description: service.description,
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((s) => s.slug === params.slug)
  
  if (!service) {
    notFound()
  }

  const pageData = servicePageData[params.slug]
  const relatedSlugs = relatedServicesMap[params.slug] || []

  return (
    <>
      <main>
        {/* Hero - Light background, kept as is */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
              <Link href="/" className="hover:text-brand transition-colors">Hem</Link>
              <span>/</span>
              <Link href="/tjanster/" className="hover:text-brand transition-colors">Tjänster</Link>
              <span>/</span>
              <span className="text-text">{service.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
                  {service.title}
                </h1>
                <p className="text-xl text-text-muted mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                {service.hasRot && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">ROT-avdrag gäller</span>
                  </div>
                )}

                <Link href="/offert/">
                  <Button size="lg" className="group">
                    Begär offert för {service.title.toLowerCase()}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pattern Section - Process Timeline OR Service Accordion */}
        {pageData.pattern === 'timeline' && pageData.timelineSteps ? (
          <ProcessTimeline steps={pageData.timelineSteps} />
        ) : pageData.pattern === 'accordion' && pageData.accordionItems ? (
          <ServiceAccordion items={pageData.accordionItems} />
        ) : null}

        {/* ROT Calculator */}
        <RotCalculator />

        {/* FAQ Section */}
        <ServiceFAQ faqs={pageData.faqs} />

        {/* Trust Badges Strip */}
        <TrustBadgesStrip />

        {/* Inline Quote CTA */}
        <ServiceInlineCTA />

        {/* Timeline Stats */}
        <ServiceTimelineStats stats={pageData.stats} />

        {/* Related Services */}
        <RelatedServices relatedSlugs={relatedSlugs} />
      </main>
      <Footer />
    </>
  )
}
