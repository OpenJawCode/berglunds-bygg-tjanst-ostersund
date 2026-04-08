import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { services, siteConfig } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight, Phone, Home, Bath, Building2, Hammer, Trees } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

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

  const otherServices = services.filter((s) => s.slug !== params.slug).slice(0, 3)

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Hem</Link>
              <span>/</span>
              <Link href="/tjanster/" className="hover:text-primary transition-colors">Tjänster</Link>
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

        {/* Features */}
        <Section background="light" padding="lg">
          <SectionHeader
            title="Vad ingår?"
            description={`Vi erbjuder kompletta lösningar inom ${service.title.toLowerCase()}. Här är vad du kan förvänta dig:`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4 p-6 rounded-2xl',
                  'bg-white border border-[#E5E2DE]',
                  'hover:shadow-lg hover:border-primary/20 transition-all duration-300'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="text-text font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="primary" padding="lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Vill du veta mer om {service.title.toLowerCase()}?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Kontakta oss för en kostnadsfri konsultation. Vi hjälper dig att 
              förverkliga dina planer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/offert/">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Få en offert
                  <ArrowRight className="w-5 h-5 ml-2" />
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
                Ring oss
              </a>
            </div>
          </div>
        </Section>

        {/* Related Services */}
        <Section background="light" padding="lg">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-text mb-8 text-center">
            Andra tjänster
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherServices.map((otherService) => (
              <Link
                key={otherService.slug}
                href={`/tjanster/${otherService.slug}/`}
                className={cn(
                  'group block bg-white rounded-2xl p-6',
                  'border border-[#E5E2DE]',
                  'hover:shadow-lg hover:border-primary/20 transition-all duration-300'
                )}
              >
                <h3 className="font-heading text-lg font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                  {otherService.title}
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  {otherService.shortDescription}
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  Läs mer
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
