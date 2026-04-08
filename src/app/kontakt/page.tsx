import { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/constants'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kontakt | Berglunds Byggtjänst Östersund',
  description: 'Kontakta Berglunds Byggtjänst i Östersund. Telefon, e-post och adress. Vi återkommer så snart vi kan.',
}

export default function KontaktPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom text-center max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
              Kontakta oss
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Har du frågor eller vill diskutera ditt projekt? 
              Vi finns här för att hjälpa dig.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <Section background="light" padding="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className={cn(
                'group bg-white rounded-3xl p-8 border border-border',
                'hover:shadow-lg hover:border-brand/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                <Phone className="w-8 h-8 text-brand group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">Telefon</h3>
              <p className="text-brand font-medium">{siteConfig.phone}</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}`}
              className={cn(
                'group bg-white rounded-3xl p-8 border border-border',
                'hover:shadow-lg hover:border-brand/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                <Mail className="w-8 h-8 text-brand group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">E-post</h3>
              <p className="text-brand font-medium text-sm break-all">{siteConfig.email}</p>
            </a>

            {/* Address */}
            <a
              href="https://maps.app.goo.gl/6TUa2dAS3Jiysqvo8"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group bg-white rounded-3xl p-8 border border-border',
                'hover:shadow-lg hover:border-brand/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                <MapPin className="w-8 h-8 text-brand group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-text mb-2">Adress</h3>
              <p className="text-brand font-medium">{siteConfig.address}</p>
            </a>
          </div>

          {/* Map & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden h-[400px] bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1693.778050939772!2d14.61635!3d63.1956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466f200123456789%3A0x1234567890abcdef!2sFr%C3%B6s%C3%B6n%2C%20%C3%96stersund!5e0!3m2!1ssv!2sse!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Berglunds Byggtjänst Östersund - Hitta till oss"
              />
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-text mb-4">
                  Öppettider
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted">Måndag - Fredag</span>
                    <span className="font-medium">07:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted">Lördag - Söndag</span>
                    <span className="font-medium">Stängt</span>
                  </div>
                </div>
                <p className="text-text-muted text-sm mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Vi återkommer inom 24 timmar på förfrågningar
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-text mb-4">
                  Följ oss
                </h2>
                <div className="flex gap-4">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-brand/5 text-brand',
                      'hover:bg-brand hover:text-white transition-colors'
                    )}
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-brand/5 text-brand',
                      'hover:bg-brand hover:text-white transition-colors'
                    )}
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div className="bg-accent/5 rounded-2xl p-6 border border-accent/20">
                <h3 className="font-heading text-lg font-semibold text-text mb-2">
                  Snabbast svar?
                </h3>
                <p className="text-text-muted mb-4">
                  För offertförfrågningar, använd gärna vårt offertformulär.
                </p>
                <a
                  href="/offert/"
                  className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
                >
                  Gå till offertformuläret →
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
