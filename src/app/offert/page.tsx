import { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { services, siteConfig } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Check, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Få en offert | Berglunds Byggtjänst Östersund',
  description: 'Begär en kostnadsfri offert för ditt byggprojekt. Vi återkommer inom 24 timmar med ett förslag anpassat efter dina behov.',
}

export default function OffertPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom text-center max-w-3xl">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-text mb-6">
              Få en kostnadsfri offert
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Berätta om ditt projekt så återkommer vi inom 24 timmar med en 
              offert anpassad efter dina behov och budget.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <Section background="light" padding="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <div>
              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                    Namn <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-border',
                      'bg-white text-text',
                      'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                      'transition-all duration-200'
                    )}
                    placeholder="Ditt namn"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                      E-post <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border border-border',
                        'bg-white text-text',
                        'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                        'transition-all duration-200'
                      )}
                      placeholder="din@email.se"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
                      Telefon <span className="text-error">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border border-border',
                        'bg-white text-text',
                        'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                        'transition-all duration-200'
                      )}
                      placeholder="070-123 45 67"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-text mb-2">
                    Adress <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-border',
                      'bg-white text-text',
                      'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                      'transition-all duration-200'
                    )}
                    placeholder="Gatuadress, postnummer, ort"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-text mb-2">
                    Typ av tjänst <span className="text-error">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-border',
                      'bg-white text-text',
                      'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                      'transition-all duration-200'
                    )}
                  >
                    <option value="">Välj tjänst</option>
                    {services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.title}
                      </option>
                    ))}
                    <option value="other">Annat (ange i meddelande)</option>
                  </select>
                </div>

                {/* Customer Type */}
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Typ av kund <span className="text-error">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerType"
                        value="private"
                        defaultChecked
                        className="w-4 h-4 text-brand focus:ring-brand"
                      />
                      <span className="text-text">Privatperson</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerType"
                        value="company"
                        className="w-4 h-4 text-brand focus:ring-brand"
                      />
                      <span className="text-text">Företag</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                    Meddelande
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-border',
                      'bg-white text-text resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand',
                      'transition-all duration-200'
                    )}
                    placeholder="Beskriv ditt projekt, tidsplan, budget, etc."
                  />
                </div>

                {/* Submit */}
                <Button type="submit" size="lg" className="w-full">
                  Skicka förfrågan
                </Button>

                <p className="text-xs text-text-muted text-center">
                  Genom att skicka formuläret godkänner du att vi sparar dina uppgifter 
                  för att kunna kontakta dig angående din förfrågan.
                </p>
              </form>
            </div>

            {/* Info */}
            <div className="lg:pl-12">
              <div className="bg-white rounded-3xl p-8 border border-border mb-8">
                <h2 className="font-heading text-xl font-semibold text-text mb-6">
                  Vad händer nu?
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Check, title: 'Vi granskar din förfrågan', desc: 'Vanligtvis inom några timmar.' },
                    { icon: Phone, title: 'Vi ringer dig', desc: 'För att ställa kompletterande frågor.' },
                    { icon: Mail, title: 'Du får offerten', desc: 'Skriftlig offert inom 24 timmar.' },
                    { icon: Clock, title: 'Du bestämmer', desc: 'Ingen köptvång, ta den tid du behöver.' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand/5 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text">{step.title}</h3>
                        <p className="text-text-muted text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent/5 rounded-3xl p-8 border border-accent/20">
                <h3 className="font-heading text-lg font-semibold text-text mb-4">
                  Snabbare svar?
                </h3>
                <p className="text-text-muted mb-4">
                  Om du har brådskande frågor är du välkommen att ringa oss direkt.
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-full',
                    'bg-brand text-white font-medium',
                    'hover:bg-brand-light transition-colors'
                  )}
                >
                  <Phone className="w-5 h-5" />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
