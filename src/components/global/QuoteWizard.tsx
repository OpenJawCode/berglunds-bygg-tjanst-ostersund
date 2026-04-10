'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react'
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

type SubmitState = 'idle' | 'submitting' | 'success'

// Animated Input Field Component
function AnimatedField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className={cn(
        'block text-sm font-medium mb-2 transition-colors',
        isFocused ? 'text-white' : 'text-white/90'
      )}>
        {label} {required && <span className="text-error">*</span>}
      </label>
      <motion.div
        animate={{
          boxShadow: isFocused ? '0 0 0 3px rgba(0, 184, 212, 0.2)' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, x: -5 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-error text-sm mt-1 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Submit Button with Morph Animation
function SubmitButton({ isSubmitting, submitState }: { isSubmitting: boolean; submitState: SubmitState }) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      whileHover={!isSubmitting ? { scale: 1.02 } : undefined}
      whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium',
        'bg-brand text-white hover:bg-brand-400',
        'transition-all duration-300',
        isSubmitting && 'opacity-70 cursor-not-allowed'
      )}
    >
      <AnimatePresence mode="wait">
        {submitState === 'submitting' ? (
          <motion.div
            key="loading"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Skickar...</span>
          </motion.div>
        ) : submitState === 'success' ? (
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Skickat!</span>
          </motion.div>
        ) : (
          <motion.div
            key="submit"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <span>Skicka förfrågan</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
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
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

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
      setSubmitState('submitting')
      await onSubmit(formData)
      setSubmitState('success')
    }
  }

  const steps = [
    { num: 1, title: 'Projekt', desc: 'Vad vill du bygga?' },
    { num: 2, title: 'Kontakt', desc: 'Hur når vi dig?' },
    { num: 3, title: 'Beskrivning', desc: 'Berätta mer' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step >= s.num
                    ? 'bg-brand text-white'
                    : 'bg-white/10 text-white/50'
                )}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {step > s.num ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  s.num
                )}
              </motion.div>
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
              <motion.div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  step > s.num ? 'bg-brand' : 'bg-white/10'
                )}
                layout
                transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <AnimatedField
              label="Vilken typ av tjänst?"
              required
              error={errors.project_type}
            >
              <select
                value={formData.project_type}
                onChange={(e) => updateField('project_type', e.target.value)}
                onFocus={(e) => e.target.parentElement?.classList.add('focused')}
                onBlur={(e) => e.target.parentElement?.classList.remove('focused')}
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
            </AnimatedField>

            <AnimatedField
              label="Postnummer"
              required
              error={errors.postal_code}
            >
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
            </AnimatedField>

            <AnimatedField label="Kort beskrivning (valfritt)">
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="T.ex. 'Takläcka på södra sidan' eller 'Vill renovera badrummet'"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white/5 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </AnimatedField>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <AnimatedField
              label="Namn"
              required
              error={errors.name}
            >
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
            </AnimatedField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatedField
                label="E-post"
                required
                error={errors.email}
              >
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
              </AnimatedField>

              <AnimatedField
                label="Telefon"
                required
                error={errors.phone}
              >
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
              </AnimatedField>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 rounded-xl p-4 space-y-3"
            >
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
            </motion.div>

            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-border bg-white/5 text-brand focus:ring-brand" />
              <span className="text-sm text-white/70">
                Jag godkänner att Berglunds Byggtjänst sparar mina uppgifter för att hantera min förfrågan.
                <a href="/integritetspolicy" className="text-brand hover:underline ml-1">Läs mer</a>
              </span>
            </motion.label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        className="flex items-center justify-between pt-4 border-t border-white/10"
        layout
      >
        <AnimatePresence mode="wait">
          {step > 1 ? (
            <motion.button
              key="back"
              type="button"
              onClick={handlePrev}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              whileHover={{ x: -3 }}
              className="inline-flex items-center gap-1 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Tillbaka
            </motion.button>
          ) : (
            <motion.button
              key="cancel"
              type="button"
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="inline-flex items-center gap-1 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
            >
              Avbryt
            </motion.button>
          )}
        </AnimatePresence>

        {step < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-brand text-white hover:bg-brand-400 transition-colors"
          >
            Nästa <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <SubmitButton isSubmitting={isSubmitting} submitState={submitState} />
        )}
      </motion.div>
    </form>
  )
}