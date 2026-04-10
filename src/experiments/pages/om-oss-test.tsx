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
import { MessageCircle, Heart, Shield, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// Experiment variants for Om oss page
type ExperimentVariant = 'blueprint' | 'texture' | 'floating' | 'particles' | 'depth' | 'ripple' | 'none'

const variants: { id: ExperimentVariant; label: string; description: string }[] = [
  { id: 'none', label: 'None (Current)', description: 'No background effect' },
  { id: 'blueprint', label: 'Blueprint Grid', description: 'Grid pattern with floating construction icons' },
  { id: 'texture', label: 'Texture Reveal', description: 'Material texture overlay' },
  { id: 'floating', label: 'Floating Elements', description: 'Geometric shapes with parallax' },
  { id: 'particles', label: 'Particles', description: 'Drifting dust particles (canvas)' },
  { id: 'depth', label: 'Depth Layers', description: 'Multi-layer gradient parallax' },
]

const values = [
  {
    icon: MessageCircle,
    title: 'Ärlig kommunikation',
    description: 'Inga dolda kostnader eller överraskningar. Vi säger som det är, och vi säger det i tid.',
  },
  {
    icon: Heart,
    title: 'Respekt för ditt hem',
    description: 'Vi städar efter oss varje dag och är varsamma med din egendom.',
  },
  {
    icon: Shield,
    title: 'Hållbar kvalitet',
    description: 'Vi bygger för att hålla i generationer, inte bara idag.',
  },
  {
    icon: User,
    title: 'Personligt ansvar',
    description: 'Du når alltid samma person som känner ditt projekt.',
  },
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
        <div className="flex flex-wrap gap-2 max-w-2xl">
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

export default function OmOssExperiment() {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentVariant>('blueprint')

  const renderBackground = (section: 'hero' | 'values' | 'dark') => {
    // Different backgrounds for different sections
    if (section === 'hero') {
      switch (selectedExperiment) {
        case 'blueprint':
          return <BlueprintGrid intensity="subtle" />
        case 'ripple':
          return <RippleEffect intensity="medium" />
        default:
          return null
      }
    }
    
    if (section === 'values') {
      switch (selectedExperiment) {
        case 'texture':
          return <div className="absolute inset-0 bg-white" />
        default:
          return null
      }
    }
    
    if (section === 'dark') {
      switch (selectedExperiment) {
        case 'floating':
          return <FloatingElements density="medium" />
        case 'particles':
          return <Particles density="medium" />
        case 'depth':
          return <DepthLayers layers={3} />
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
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#00B8D4]/10 text-[#00B8D4] text-xs font-medium uppercase tracking-wider mb-4">
                Om oss
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6">
                Byggt med passion i Östersund
              </h1>
              <p className="text-lg text-[#6B6B6B] mb-6 leading-relaxed">
                Berglunds Byggtjänst grundades med en enkel vision: att leverera kvalitetsbyggnation 
                med personlig service. Vi är ett lokalt team i Östersund som brinner för att skapa 
                hem där människor trivs.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mb-6">
                Med stolthet utför vi byggarbeten i hela länet – från fjäll till stad – där vi 
                kombinerar gediget hantverk med moderna lösningar.
              </p>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#E5E2DE]">
              <div className="absolute inset-0 flex items-center justify-center text-[#6B6B6B]">
                [Hero Image Placeholder]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        {renderBackground('values')}
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#00B8D4] text-sm font-medium uppercase tracking-wider">
              Våra värderingar
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-2">
              Så arbetar vi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              
              return (
                <div
                  key={value.title}
                  className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-[#E5E2DE] hover:shadow-lg hover:border-[#00B8D4]/20 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#00B8D4]/5 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-7 h-7 text-[#00B8D4]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[#1A1A1A] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-[#6B6B6B] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dark Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        {renderBackground('dark')}
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Varför välja oss?
              </h2>
              
              <div className="space-y-6">
                {[
                  { title: 'Lokalt förankrade', desc: 'Vi känner Östersund och Jämtland.' },
                  { title: 'Fullständig ansvarsförsäkring', desc: 'Trygghet för dig som kund.' },
                  { title: 'ROT-avdrag', desc: 'Vi hjälper dig att utnyttja skattereduktionen.' },
                  { title: 'En kontaktperson', desc: 'Du slipper jonglera med olika hantverkare.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#00B8D4] mt-2 flex-shrink-0" />
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
                <div className="text-4xl font-heading font-bold text-[#00B8D4] mb-2">100%</div>
                <p className="text-white/70 text-sm">Lokalt ägt och drivet</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="text-4xl font-heading font-bold text-white mb-2">24h</div>
                <p className="text-white/70 text-sm">Återkoppling på förfrågan</p>
              </div>
              <div className="col-span-2 bg-[#00B8D4]/10 backdrop-blur-sm rounded-3xl p-6 border border-[#00B8D4]/20">
                <p className="text-white/90 text-center">
                  "Vi är inte nöjda förrän du är nöjd."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 relative">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
              Vill du veta mer?
            </h2>
            <p className="text-[#6B6B6B] text-lg mb-8">
              Tveka inte att kontakta oss.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}