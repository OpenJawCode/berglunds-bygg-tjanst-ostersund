import type { Metadata } from 'next'
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
  preload: true,
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Berglunds Byggtjänst Östersund | Kvalitetsbyggnation i Jämtland',
  description: 'Vi bygger ditt drömhem i Östersund och Jämtland. Takbyte, badrumsrenovering, nybyggnation och ombyggnation med ROT-avdrag. Begär en kostnadsfri offert idag!',
  keywords: ['byggfirma Östersund', 'byggtjänst Jämtland', 'takbyte', 'badrumsrenovering', 'nybyggnation', 'ROT-avdrag', 'hantverkare Östersund'],
  openGraph: {
    title: 'Berglunds Byggtjänst Östersund',
    description: 'Kvalitetsbyggnation i Östersund och Jämtland. Från idé till inflyttning.',
    type: 'website',
    locale: 'sv_SE',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Berglunds Byggtjänst Östersund',
  image: 'https://berglundsbyggtjanst.se/brand/logo-horizontal.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Namn 110',
    addressLocality: 'Frösön',
    postalCode: '832 93',
    addressRegion: 'Jämtland',
    addressCountry: 'SE',
  },
  telephone: '+46703218827',
  email: 'infoberglundsbyggtjanstosd@gmail.com',
  priceRange: '$$',
  openingHours: 'Mo-Fr 07:00-17:00',
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 63.1792,
      longitude: 14.6357,
    },
    geoRadius: '50000',
  },
  areaServed: 'Östersund och Jämtland',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={`${cinzel.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
