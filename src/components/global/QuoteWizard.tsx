'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { services } from '@/lib/constants'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'

interface FormData {
  name: string
  email: string
  phone: string
  postal_code: string
  project_type: string
  description: string
}

interface QuoteWizardProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  onBack: () => void
  isSubmitting?: boolean
}

export default function QuoteWizard({
  initialData = {},
  onSubmit,
  onBack,
  isSubmitting = false,
}: QuoteWizardProps) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    postal_code: initialData.postal_code || '',
    project_type: initialData.project_type || '',
    description: initialData.description || '',
  })

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 1) {
      if (!formData.project_type) {
        newErrors.project_type = 'Välj en tjänst'
      }
      if (!formData.postal_code || !/^\d{3}\s?\d{2}$/.test(formData.postal_code)) {
        newErrors.postal_code = 'Ange giltigt postnummer (t.ex. 831 40)'
      }
    }

    if (stepNum === 2) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Ange ditt namn'
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Ange giltig e-post'
      }
      if (!formData.phone || !isValidSwedishPhone(formData.phone)) {
        newErrors.phone = 'Ange giltigt mobilnummer (t.ex. 070-123 45 67)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(3)) {
      await onSubmit(formData)
    }
  }

  const steps = [
    { num: 1, title: 'Projekt', desc: 'Vad vill du bygga?' },
    { num: 2, title: 'Kontakt', desc: 'Hur når vi dig?' },
    { num: 3, title: 'Beskrivning', desc: 'Berätta mer' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step >= s.num
                    ? 'bg-brand text-white'
                    : 'bg-white/10 text-white/50'
                )}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={cn(
                  'text-xs mt-2 hidden sm:block',
                  step >= s.num ? 'text-white' : 'text-white/50'
                )}
              >
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  step > s.num ? 'bg-brand' : 'bg-white/10'
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Vilken typ av tjänst? <span className="text-error">*</span>
              </label>
              <select
                value={formData.project_type}
                onChange={(e) => updateField('project_type', e.target.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white/5 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                  errors.project_type ? 'border-error' : 'border-border'
                )}
              >
                <option value="">Välj tjänst</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug} className="bg-background-dark">
                    {service.title}
                  </option>
                ))}
                <option value="other" className="bg-background-dark">Annat</option>
              </select>
              {errors.project_type && (
                <p className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.project_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Postnummer <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, '').slice(0, 5)
                  if (value.length > 3) value = `${value.slice(0, 3)} ${value.slice(3)}`
                  updateField('postal_code', value)
                }}
                placeholder="831 40"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                  errors.postal_code ? 'border-error' : 'border-border'
                )}
              />
              {errors.postal_code && (
                <p className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.postal_code}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Kort beskrivning (valfritt)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="T.ex. 'Takläcka på södra sidan' eller 'Vill renovera badrummet'"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/5 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Namn <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ditt fullständiga namn"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                  errors.name ? 'border-error' : 'border-border'
                )}
              />
              {errors.name && (
                <p className="text-error text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  E-post <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="namn@email.se"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40',
                    'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                    errors.email ? 'border-error' : 'border-border'
                  )}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Telefon <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, '').slice(0, 10)
                    if (value.length > 3 && value.length <= 6) {
                      value = `${value.slice(0, 3)}-${value.slice(3)}`
                    } else if (value.length > 6) {
                      value = `${value.slice(0, 3)}-${value.slice(3, 6)} ${value.slice(6)}`
                    }
                    updateField('phone', value)
                  }}
                  placeholder="070-123 45 67"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40',
                    'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                    errors.phone ? 'border-error' : 'border-border'
                  )}
                />
                {errors.phone && (
                  <p className="text-error text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-white mb-3">Sammanfattning</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-white/60">Tjänst:</span>
                <span className="text-white">
                  {services.find((s) => s.slug === formData.project_type)?.title || formData.project_type}
                </span>
                <span className="text-white/60">Postnummer:</span>
                <span className="text-white">{formData.postal_code}</span>
                <span className="text-white/60">Namn:</span>
                <span className="text-white">{formData.name}</span>
                <span className="text-white/60">Telefon:</span>
                <span className="text-white">{formData.phone}</span>
                <span className="text-white/60">E-post:</span>
                <span className="text-white">{formData.email}</span>
              </div>
              {formData.description && (
                <>
                  <span className="text-white/60">Beskrivning:</span>
                  <span className="text-white">{formData.description}</span>
                </>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-border bg-white/5 text-brand focus:ring-brand" />
              <span className="text-sm text-white/70">
                Jag godkänner att Berglunds Byggtjänst sparar mina uppgifter för att hantera min förfrågan.
                <a href="/integritetspolicy" className="text-brand hover:underline ml-1">Läs mer</a>
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={handlePrev} className="text-white hover:bg-white/10">
            <ChevronLeft className="w-4 h-4 mr-1" /> Tillbaka
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
            Avbryt
          </Button>
        )}

        {step < 3 ? (
          <Button type="button" onClick={handleNext} className="bg-brand hover:bg-brand-light">
            Nästa <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="bg-brand hover:bg-brand-light">
            {isSubmitting ? 'Skickar...' : 'Skicka förfrågan'}
          </Button>
        )}
      </div>
    </form>
  )
}
