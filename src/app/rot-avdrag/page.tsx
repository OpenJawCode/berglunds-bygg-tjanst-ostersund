import { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Section, SectionHeader } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { Check, Calculator, ArrowRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'ROT-avdrag | Berglunds Byggtjänst Östersund',
  description: 'Utnyttja ROT-avdraget och spara 30% på arbetskostnaden vid reparation och underhåll av din bostad. Vi hjälper dig med allt pappersarbete.',
}

const benefits = [
  {
    title: '30% tillbaka',
    description: 'Få tillbaka 30% av arbetskostnaden direkt på fakturan.',
  },
  {
    title: 'Max 50 000 kr/år',
    description: 'Du kan få maximalt 50 000 kr per person och år i skattereduktion.',
  },
  {
    title: 'Vi sköter pappret',
    description: 'Vi hjälper dig med all administration och ansökan till Skatteverket.',
  },
  {
    title: 'Gäller de flesta jobb',
    description: 'ROT-avdrag gäller för reparation och underhåll i bostaden.',
  },
]

const faqs = [
  {
    question: 'Vad är ROT-avdrag?',
    answer: 'ROT står för Renovering, Ombyggnad och Tillbyggnad. Det är en skattereduktion som privatpersoner kan få för arbetskostnaden vid reparation och underhåll av bostaden. Du får 30% av arbetskostnaden i skattereduktion.',
  },
  {
    question: 'Vem kan få ROT-avdrag?',
    answer: 'För att få ROT-avdrag måste du äga och vara skriven på den bostad där arbetet utförs. Bostaden måste vara minst ett halvår gammal. Du kan också få ROT-avdrag för ett fritidshus som du äger.',
  },
  {
    question: 'Hur mycket kan jag få i ROT-avdrag?',
    answer: 'Du kan få maximalt 50 000 kr per person och år i ROT-avdrag. Det motsvarar en arbetskostnad på cirka 167 000 kr. Är ni två ägare kan ni få totalt 100 000 kr i avdrag.',
  },
  {
    question: 'Vad ingår inte i ROT-avdrag?',
    answer: 'Materialkostnader, resor och utrustning ingår inte i ROT-avdraget. Endast själva arbetskostnaden ger rätt till avdrag. Det gäller också att arbetet ska vara reparation eller underhåll – nybyggnation ger inte rätt till ROT-avdrag (men kan ibland ge rätt till RUT-avdrag).',
  },
  {
    question: 'Hur går det till i praktiken?',
    answer: 'När vi skickar fakturan drar vi av 30% från arbetskostnaden direkt. Du betalar alltså bara 70% av arbetskostnaden till oss. Vi begär sedan utbetalning av de resterande 30% från Skatteverket. Det enda du behöver göra är att skriva på ett samtycke och intyga att du äger bostaden.',
  },
]

const eligibleServices = [
  'Takbyte och takreparationer',
  'Badrumsrenovering',
  'Köksrenovering',
  'Ombyggnation',
  'Tillbyggnad',
  'Fönsterbyte',
  'Trapprenovering',
  'Golvslipning',
  'Målning och tapetsering',
  'VVS-arbeten',
  'Elarbeten (via samarbetspartner)',
]

export default function RotAvdragPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light">
          <div className="container-custom text-center max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider mb-4">
              Skatteavdrag
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
              Sänk kostnaden med{' '}
              <span className="text-accent">ROT-avdrag</span>
            </h1>
            <p className="text-xl text-text-muted leading-relaxed">
              Som privatperson har du rätt till skattereduktion för arbetskostnaden 
              vid reparation och underhåll av bostaden. Vi hjälper dig att utnyttja 
              detta och sköter all administration.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <Section background="light" padding="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={cn(
                  'bg-white rounded-2xl p-6 border border-border',
                  'hover:shadow-lg hover:border-primary/20 transition-all duration-300'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  {index === 0 ? (
                    <span className="text-accent font-heading font-bold text-lg">30%</span>
                  ) : index === 1 ? (
                    <span className="text-accent font-heading font-bold text-lg">50k</span>
                  ) : index === 2 ? (
                    <Check className="w-6 h-6 text-accent" />
                  ) : (
                    <Calculator className="w-6 h-6 text-accent" />
                  )}
                </div>
                <h3 className="font-heading text-lg font-semibold text-text mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-muted text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Example Calculation */}
        <Section background="dark" padding="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                Så här fungerar det
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Med ROT-avdrag betalar du bara 70% av arbetskostnaden. Här är ett exempel 
                på hur mycket du kan spara på en badrumsrenovering:
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Arbetskostnad</span>
                  <span className="text-white font-semibold">150 000 kr</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70">Material</span>
                  <span className="text-white font-semibold">75 000 kr</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10 text-accent">
                  <span className="font-medium">ROT-avdrag (30%)</span>
                  <span className="font-bold">- 45 000 kr</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-white font-semibold">Totalt att betala</span>
                  <span className="text-accent font-heading text-2xl font-bold">180 000 kr</span>
                </div>
              </div>

              <p className="text-white/60 text-sm mt-6">
                * Du sparar 45 000 kr jämfört med utan ROT-avdrag!
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="font-heading text-xl font-semibold text-white mb-6">
                Tjänster som ger ROT-avdrag
              </h3>
              <ul className="space-y-3">
                {eligibleServices.map((service) => (
                  <li key={service} className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section background="light" padding="xl">
          <SectionHeader
            eyebrow="Vanliga frågor"
            title="Allt du behöver veta om ROT-avdrag"
          />

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  'bg-white rounded-2xl p-6 border border-border',
                  'hover:shadow-md transition-shadow duration-300'
                )}
              >
                <h3 className="font-heading text-lg font-semibold text-text mb-3 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-text-muted leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <Section background="primary" padding="xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Vill du veta mer?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Kontakta oss så hjälper vi dig att räkna ut hur mycket du kan spara 
              med ROT-avdrag på just ditt projekt.
            </p>
            <Link href="/offert/">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Få en offert med ROT-avdrag
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
