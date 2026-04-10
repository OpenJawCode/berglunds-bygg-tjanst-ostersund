'use client'

import { useState } from 'react'
import { 
  BlueprintGrid, 
  TextureReveal, 
  FloatingElements, 
  RippleEffect,
  Particles,
  DepthLayers 
} from '../backgrounds'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react'
import { cn } from '@/lib/utils'

// Experiment variants for Kontakt page
type ExperimentVariant = 'ripple' | 'grid' | 'texture' | 'particles' | 'none'

const variants: { id: ExperimentVariant; label: string }[] = [
  { id: 'none', label: 'None (Current)' },
  { id: 'ripple', label: 'Ripple Effect' },
  { id: 'grid', label: 'Blueprint Grid' },
  { id: 'texture', label: 'Texture Reveal' },
  { id: 'particles', label: 'Particles' },
]

interface ExperimentSelectorProps {
  selected: ExperimentVariant
  onChange: (v: ExperimentVariant) => void
}

function ExperimentSelector({ selected, onChange }: ExperimentSelectorProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#E5E2DE] p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
            Test Backgrounds
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#00B8D4]/10 text-[#00B8D4]">
            Sandbox
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onChange(v.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                selected === v.id
                  ? 'bg-[#00B8D4] text-white shadow-md'
                  : 'bg-[#F8F6F3] text-[#1A1A1A] hover:bg-[#E5E2DE]'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function KontaktExperiment() {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentVariant>('ripple')

  const renderBackground = (section: 'hero' | 'cards' | 'map') => {
    if (section === 'hero') {
      switch (selectedExperiment) {
        case 'ripple':
          return <RippleEffect intensity="medium" />
        case 'grid':
          return <BlueprintGrid intensity="subtle" />
        default:
          return null
      }
    }
    
    if (section === 'cards') {
      switch (selectedExperiment) {
        case 'texture':
          return <div className="absolute inset-0" />
        default:
          return null
      }
    }
    
    if (section === 'map') {
      switch (selectedExperiment) {
        case 'particles':
          return <Particles density="low" />
        default:
          return null
      }
    }
    
    return null
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <ExperimentSelector 
        selected={selectedExperiment} 
        onChange={setSelectedExperiment} 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative">
        {renderBackground('hero')}
        <div className="container-custom text-center max-w-3xl relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6">
            Kontakta oss
          </h1>
          <p className="text-xl text-[#6B6B6B] leading-relaxed">
            Har du frågor eller vill diskutera ditt projekt? 
            Vi finns här för att hjälpa dig.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        {renderBackground('cards')}
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Phone */}
            <a
              href="tel:0703218827"
              className={cn(
                'group bg-white rounded-3xl p-8 border border-[#E5E2DE]',
                'hover:shadow-lg hover:border-[#00B8D4]/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00B8D4]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00B8D4] group-hover:text-white transition-colors">
                <Phone className="w-8 h-8 text-[#00B8D4] group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">Telefon</h3>
              <p className="text-[#00B8D4] font-medium">070 321 88 27</p>
            </a>

            {/* Email */}
            <a
              href="mailto:infoberglundsbyggtjanstosd@gmail.com"
              className={cn(
                'group bg-white rounded-3xl p-8 border border-[#E5E2DE]',
                'hover:shadow-lg hover:border-[#00B8D4]/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00B8D4]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00B8D4] group-hover:text-white transition-colors">
                <Mail className="w-8 h-8 text-[#00B8D4] group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">E-post</h3>
              <p className="text-[#00B8D4] font-medium text-sm break-all">infoberglundsbyggtjanstosd@gmail.com</p>
            </a>

            {/* Address */}
            <a
              href="https://maps.app.goo.gl/6TUa2dAS3Jiysqvo8"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group bg-white rounded-3xl p-8 border border-[#E5E2DE]',
                'hover:shadow-lg hover:border-[#00B8D4]/20 transition-all duration-300',
                'text-center'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00B8D4]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00B8D4] group-hover:text-white transition-colors">
                <MapPin className="w-8 h-8 text-[#00B8D4] group-hover:text-white" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">Adress</h3>
              <p className="text-[#00B8D4] font-medium">Namn 110, 832 93 Frösön</p>
            </a>
          </div>

          {/* Map & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="rounded-3xl overflow-hidden h-[400px] bg-gray-100 relative">
              {renderBackground('map')}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1693.778050939772!2d14.61635!3d63.1956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466f200123456789%3A0x1234567890abcdef!2sFr%C3%B6s%C3%B6n%2C%20%C3%96stersund!5e0!3m2!1ssv!2sse!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'relative', zIndex: 10 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Berglunds Byggtjänst Östersund - Hitta till oss"
              />
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] mb-4">
                  Öppettider
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-[#E5E2DE]">
                    <span className="text-[#6B6B6B]">Måndag - Fredag</span>
                    <span className="font-medium">07:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#E5E2DE]">
                    <span className="text-[#6B6B6B]">Lördag - Söndag</span>
                    <span className="font-medium">Stängt</span>
                  </div>
                </div>
                <p className="text-[#6B6B6B] text-sm mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Vi återkommer inom 24 timmar på förfrågningar
                </p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold text-[#1A1A1A] mb-4">
                  Följ oss
                </h2>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/people/Berglunds-Byggtjänst-Östersund/61554649092027"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-[#00B8D4]/5 text-[#00B8D4]',
                      'hover:bg-[#00B8D4] hover:text-white transition-colors'
                    )}
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/berglundsbyggtjanstosd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-[#00B8D4]/5 text-[#00B8D4]',
                      'hover:bg-[#00B8D4] hover:text-white transition-colors'
                    )}
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>

              <div className="bg-[#008A9C]/5 rounded-2xl p-6 border border-[#008A9C]/20">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                  Snabbast svar?
                </h3>
                <p className="text-[#6B6B6B] mb-4">
                  För offertförfrågningar, använd gärna vårt offertformulär.
                </p>
                <a
                  href="/offert/"
                  className="inline-flex items-center gap-2 text-[#00B8D4] font-medium hover:underline"
                >
                  Gå till offertformuläret →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}