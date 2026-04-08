import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { MessageCircle, Heart, Shield, User, MapPin, Phone, Mail } from 'lucide-react'
import { siteConfig } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Om oss | Berglunds Byggtjänst Östersund',
  description: 'Lär känna Berglunds Byggtjänst. Vi är ett lokalt byggföretag i Östersund som brinner för kvalitetsbyggnation och personlig service.',
}

const values = [
  {
    icon: MessageCircle,
    title: 'Ärlig kommunikation',
    description: 'Inga dolda kostnader eller överraskningar. Vi säger som det är, och vi säger det i tid. Du vet alltid vad som pågår i ditt projekt.',
  },
  {
    icon: Heart,
    title: 'Respekt för ditt hem',
    description: 'Vi städar efter oss varje dag och är varsamma med din egendom. Ditt hem är lika värdefullt för oss som det är för dig.',
  },
  {
    icon: Shield,
    title: 'Hållbar kvalitet',
    description: 'Vi bygger för att hålla i generationer, inte bara idag. Vårt arbete ska stå sig i många år framöver.',
  },
  {
    icon: User,
    title: 'Personligt ansvar',
    description: 'Du når alltid samma person som känner ditt projekt. Ingen att skicka runt mellan olika kontaktpersoner.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-4">
                  Om oss
                </span>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
                  Byggt med passion i Östersund
                </h1>
                <p className="text-lg text-text-muted mb-6 leading-relaxed">
                  Berglunds Byggtjänst grundades med en enkel vision: att leverera kvalitetsbyggnation 
                  med personlig service. Vi är ett lokalt team i Östersund som brinner för att skapa 
                  hem där människor trivs.
                </p>
                <p className="text-text-muted leading-relaxed mb-6">
                  Med stolthet utför vi byggarbeten i hela länet – från fjäll till stad – där vi 
                  kombinerar gediget hantverk med moderna lösningar. För oss är varje projekt unikt. 
                  Vi tar oss tid att lyssna på dina önskemål, förstår din budget och levererar alltid 
                  mer än vad som förväntas.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Inga standardlösningar – bara genomtänkt hantverk anpassat efter just ditt hem.
                </p>
              </div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/references/ref-6.jpg"
                  alt="Berglunds Byggtjänst - Lokalt byggföretag i Östersund"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <Section background="light" padding="xl">
          <SectionHeader
            eyebrow="Våra värderingar"
            title="Så arbetar vi"
            description="Våra fyra kärnvärden genomsyrar allt vi gör – från första mötet till slutbesiktning."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              
              return (
                <div
                  key={value.title}
                  className={cn(
                    'flex items-start gap-6 p-8 rounded-3xl',
                    'bg-white border border-border',
                    'hover:shadow-lg hover:border-primary/20 transition-all duration-300'
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-text mb-3">
                      {value.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Why Choose Us */}
        <Section background="dark" padding="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Varför välja oss?
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Lokalt förankrade', desc: 'Vi känner Östersund och Jämtland. Snabb service och vi förstår lokala förhållanden.' },
                  { title: 'Fullständig ansvarsförsäkring', desc: 'Trygghet för dig som kund. Vi har alla försäkringar som krävs.' },
                  { title: 'ROT-avdrag', desc: 'Vi hjälper dig att utnyttja skattereduktionen och sköter all administration.' },
                  { title: 'En kontaktperson', desc: 'Du slipper jonglera med olika hantverkare. Samma person genom hela projektet.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="text-4xl font-heading font-bold text-accent mb-2">100%</div>
                <p className="text-white/70 text-sm">Lokalt ägt och drivet</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="text-4xl font-heading font-bold text-white mb-2">24h</div>
                <p className="text-white/70 text-sm">Återkoppling på förfrågan</p>
              </div>
              <div className="col-span-2 bg-accent/10 backdrop-blur-sm rounded-3xl p-6 border border-accent/20">
                <p className="text-white/90 text-center">
                  "Vi är inte nöjda förrän du är nöjd. Det är vårt löfte till dig."
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Contact CTA */}
        <Section background="light" padding="lg">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text mb-6">
              Vill du veta mer?
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Tveka inte att kontakta oss om du har frågor eller vill diskutera ditt projekt.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                  'bg-primary text-white font-medium',
                  'hover:bg-primary-light transition-all duration-300'
                )}
              >
                <Phone className="w-5 h-5" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                  'border-2 border-primary text-primary font-medium',
                  'hover:bg-primary hover:text-white transition-all duration-300'
                )}
              >
                <Mail className="w-5 h-5" />
                Skicka e-post
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
