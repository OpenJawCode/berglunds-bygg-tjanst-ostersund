'use client'

import { useState, useCallback } from 'react'
import { Calculator, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCountUp } from '@/components/ui/CountUp'
import Link from 'next/link'

const ROT_RATE = 0.3
const MAX_DEDUCTION = 50000

export function RotCalculator() {
  const [laborCost, setLaborCost] = useState<string>('50000')

  const calculateRot = useCallback((cost: number) => {
    const deduction = Math.min(cost * ROT_RATE, MAX_DEDUCTION)
    const youPay = cost - deduction
    return { deduction, youPay }
  }, [])

  const numericCost = parseInt(laborCost.replace(/\s/g, '') || '0', 10)
  const { deduction, youPay } = calculateRot(numericCost)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE').format(value)
  }

  return (
    <div className="bg-[#080d12] py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-[800px] mx-auto">
          {/* Card */}
          <div
            className={cn(
              'rounded-2xl p-8 md:p-12',
              'bg-[#111820] border border-brand/20'
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-[#e8e4dc]">
                  Räkna ut ditt ROT-avdrag
                </h2>
                <p className="text-[#c8bfa8] text-sm mt-1">
                  Se hur mycket du sparar direkt på fakturan
                </p>
              </div>
            </div>

            {/* Input */}
            <div className="mb-8">
              <label
                htmlFor="labor-cost"
                className="block text-sm font-medium text-[#c8bfa8] mb-3"
              >
                Arbetskostnad (SEK)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="labor-cost"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className={cn(
                    'w-full px-4 py-4 rounded-xl',
                    'bg-[#0d1117] border border-white/10',
                    'text-[#e8e4dc] text-lg font-heading',
                    'focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50',
                    'transition-all duration-200',
                    'placeholder:text-[#c8bfa8]/50'
                  )}
                  placeholder="Ange arbetskostnad"
                  min="0"
                  step="1000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c8bfa8] text-sm">
                  kr
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* You Save */}
              <div
                className={cn(
                  'rounded-xl p-6',
                  'bg-[#00B8D4]/10 border border-brand/20'
                )}
              >
                <p className="text-[#c8bfa8] text-sm mb-2">Du sparar</p>
                <p className="font-heading text-3xl md:text-4xl font-bold text-brand">
                  <AnimatedCountUp
                    end={deduction}
                    prefix=""
                    suffix=" kr"
                    duration={1.5}
                    startOnView={false}
                  />
                </p>
              </div>

              {/* You Pay */}
              <div
                className={cn(
                  'rounded-xl p-6',
                  'bg-[#0d1117] border border-white/10'
                )}
              >
                <p className="text-[#c8bfa8] text-sm mb-2">Du betalar</p>
                <p className="font-heading text-3xl md:text-4xl font-bold text-[#e8e4dc]">
                  <AnimatedCountUp
                    end={youPay}
                    prefix=""
                    suffix=" kr"
                    duration={1.5}
                    startOnView={false}
                  />
                </p>
              </div>
            </div>

            {/* Fine print */}
            <p className="text-[#c8bfa8]/70 text-xs mb-8">
              ROT-avdrag gäller arbete, inte material. Max 50 000 kr/person/år.
              Vi hanterar ansökan åt dig.
            </p>

            {/* CTA */}
            <Link
              href="/offert/"
              className={cn(
                'group relative flex items-center justify-center gap-2',
                'w-full md:w-auto px-8 py-4 rounded-full',
                'bg-brand text-white font-semibold',
                'overflow-hidden',
                'transition-all duration-300',
                'hover:shadow-lg hover:shadow-brand/25',
                'active:scale-[0.98]'
              )}
              style={{
                background:
                  'linear-gradient(90deg, #0096AD 0%, #00B8D4 50%, #0096AD 100%)',
                backgroundSize: '200% 100%',
              }}
              onMouseEnter={(e) => {
                import('gsap').then(({ gsap }) => {
                  gsap.to(e.currentTarget, {
                    backgroundPosition: '100% 0',
                    duration: 0.4,
                    ease: 'power2.out',
                  })
                })
              }}
              onMouseLeave={(e) => {
                import('gsap').then(({ gsap }) => {
                  gsap.to(e.currentTarget, {
                    backgroundPosition: '0% 0',
                    duration: 0.4,
                    ease: 'power2.out',
                  })
                })
              }}
            >
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10">
                Få en offert med ROT-avdrag inkluderat
              </span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
