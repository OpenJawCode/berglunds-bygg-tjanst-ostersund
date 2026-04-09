import { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { services } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, Home, Bath, Building2, Hammer, Trees, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Våra tjänster | Berglunds Byggtjänst Östersund',
  description: 'Vi erbjuder kompletta byggtjänster i Östersund och Jämtland. Takbyte, badrumsrenovering, nybyggnation, ombyggnation och snickeriarbeten.',
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Home,
  Bath,
  Building2,
  Hammer,
  Wood: Trees,
}

export default function ServicesPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom text-center max-w-3xl">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-text mb-6">
              Våra tjänster
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Oavsett om du behöver hjälp med ett litet snickeriarbete eller en större 
              nybyggnation, har vi kompetensen och erfarenheten att leverera resultat 
              som överträffar dina förväntningar.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <Section background="light" padding="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Home
              
              return (
                <Link
                  key={service.slug}
                  href={`/tjanster/${service.slug}/`}
                  className={cn(
                    'group block bg-white rounded-3xl p-8',
                    'border border-[#E5E2DE] shadow-sm',
                    'hover:shadow-xl hover:border-brand/20 transition-all duration-500',
                    'hover:-translate-y-2'
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                    'bg-brand/5 text-brand',
                    'transition-all duration-300 group-hover:bg-brand group-hover:text-white'
                  )}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h2 className="font-heading text-xl font-semibold text-text mb-3 group-hover:text-brand transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  {/* Features Preview */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-text-muted">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-brand font-medium text-sm">
                    <span>Läs mer</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </Section>

        {/* Process Section */}
        <Section background="light" padding="lg">
          <SectionHeader
            eyebrow="Så arbetar vi"
            title="Vår process"
            description="Från första kontakt till färdigt projekt – så här går det till när du anlitar oss."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Kontakt', desc: 'Du kontaktar oss via formulär eller telefon.' },
              { step: '02', title: 'Besök', desc: 'Vi kommer hem till dig för att se på plats.' },
              { step: '03', title: 'Offert', desc: 'Du får en tydlig offert utan dolda kostnader.' },
              { step: '04', title: 'Byggstart', desc: 'Vi sätter igång och håller dig informerad.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center mx-auto mb-4 font-heading text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-text mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
