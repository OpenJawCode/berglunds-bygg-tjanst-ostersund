import Link from 'next/link'
import { Home, ArrowRight, Hammer } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Sidan hittades inte | Berglunds Byggtjänst Östersund',
  description: 'Tyvärr finns inte sidan du letar efter. Gå tillbaka till startsidan eller kontakta oss för hjälp.',
}

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-[80vh] flex items-center justify-center pt-20 bg-background-light">
        <div className="container-custom text-center">
          <div className="max-w-xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 mb-6">
              <Hammer className="w-10 h-10 text-brand" />
            </div>
            
            {/* Error Code */}
            <h1 className="font-heading text-8xl md:text-9xl font-bold text-brand mb-4">
              404
            </h1>
            
            {/* Title */}
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-text mb-4">
              Sidan hittades inte
            </h2>
            
            {/* Description */}
            <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
              Tyvärr finns inte sidan du letar efter. Den kan ha flyttats eller tagits bort.
            </p>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Tillbaka till startsidan
                </Button>
              </Link>
              <Link href="/offert/">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
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
