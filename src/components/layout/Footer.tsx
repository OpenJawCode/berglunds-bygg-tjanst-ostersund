import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import { siteConfig, services } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="bg-background-dark text-white">
      <div className="container-custom">
        {/* Main Footer */}
        <div className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <img 
                src="/logo-original.png" 
                alt="Berglunds Byggtjänst Östersund"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Kvalitetsbyggnation i Östersund och Jämtland. 
              Från idé till inflyttning – vi bygger ditt drömhem.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'bg-white/10 hover:bg-white/20 transition-colors'
                )}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  'bg-white/10 hover:bg-white/20 transition-colors'
                )}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tjänster */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Tjänster</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/tjanster/${service.slug}/`}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Snabblänkar</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Hem
                </Link>
              </li>
              <li>
                <Link href="/referenser/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Referenser
                </Link>
              </li>
              <li>
                <Link href="/om-oss/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="/rot-avdrag/" className="text-white/70 hover:text-white transition-colors text-sm">
                  ROT-avdrag
                </Link>
              </li>
              <li>
                <Link href="/offert/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Få en offert
                </Link>
              </li>
              <li>
                <Link href="/kontakt/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-6">Kontakta oss</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="break-all">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/6TUa2dAS3Jiysqvo8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/70 hover:text-white transition-colors"
                >
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{siteConfig.address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} Berglunds Byggtjänst Östersund. Alla rättigheter reserverade.
            </p>
            <p>
              Byggt med omsorg i Jämtland
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
