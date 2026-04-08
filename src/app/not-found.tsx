import Link from 'next/link'
import { Home, ArrowRight } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container-custom text-center">
          <div className="max-w-xl mx-auto">
            <h1 className="font-heading text-8xl md:text-9xl font-bold text-primary mb-4">
              404
            </h1>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text mb-4">
              Sidan hittades inte
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Tyvärr finns inte sidan du letar efter. Den kan ha flyttats eller tagits bort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Tillbaka till startsidan
                </Button>
              </Link>
              <Link href="/offert/">
                <Button size="lg" variant="secondary">
                  Begär en offert
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
