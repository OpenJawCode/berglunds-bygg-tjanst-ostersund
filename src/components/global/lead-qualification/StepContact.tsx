'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'
import { haptic } from '@/lib/haptic'

interface StepContactProps {
  data: {
    name: string
    email: string
    phone: string
  }
  onChange: (data: Partial<StepContactProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepContact({ data, onChange, onNext, onBack }: StepContactProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback((field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Namn krävs'
        if (value.trim().length < 2) return 'Namnet är för kort'
        return null
      case 'phone':
        if (!value.trim()) return 'Telefonnummer krävs'
        if (!isValidSwedishPhone(value)) return 'Ange ett giltigt svenskt nummer (070-123 45 67)'
        return null
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ange en giltig e-postadress'
        return null
      default:
        return null
    }
  }, [])

  const handleChange = useCallback((field: keyof typeof data, value: string) => {
    onChange({ [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [onChange, errors])

  const handleBlur = useCallback((field: keyof typeof data) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, data[field])
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [validateField, data])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    let hasErrors = false
    
    for (const field of ['name', 'phone'] as const) {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        hasErrors = true
      }
    }
    
    setErrors(newErrors)
    setTouched({ name: true, phone: true, email: true })
    
    if (!hasErrors) {
      haptic.success()
      onNext()
    } else {
      haptic.error()
    }
  }, [data, validateField, onNext])

  const isValid = data.name.trim().length >= 2 && isValidSwedishPhone(data.phone)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-xl font-semibold text-white mb-2"
        >
          Vem är du?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-sm"
        >
          Vi behöver dina kontaktuppgifter för att kontakta dig
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-white/80 ml-1">
            Namn <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
              data.name && isValid ? 'text-emerald-400' : 'text-white/40'
            )}>
              <User className="w-5 h-5" />
            </div>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Ditt fullständiga namn"
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/40',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all',
                touched.name && errors.name 
                  ? 'border-red-500/50 focus:border-red-500/50' 
                  : data.name && isValid 
                    ? 'border-emerald-500/30 focus:border-emerald-500/30'
                    : 'border-white/10 focus:border-brand/50'
              )}
            />
            <AnimatePresence>
              {touched.name && data.name && !errors.name && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {touched.name && errors.name && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5 text-red-400 text-xs ml-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm text-white/80 ml-1">
            Telefon <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
              data.phone && isValidSwedishPhone(data.phone) ? 'text-emerald-400' : 'text-white/40'
            )}>
              <Phone className="w-5 h-5" />
            </div>
            <input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="070-123 45 67"
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/40',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all',
                touched.phone && errors.phone 
                  ? 'border-red-500/50 focus:border-red-500/50' 
                  : data.phone && isValidSwedishPhone(data.phone)
                    ? 'border-emerald-500/30 focus:border-emerald-500/30'
                    : 'border-white/10 focus:border-brand/50'
              )}
            />
            <AnimatePresence>
              {touched.phone && data.phone && !errors.phone && isValidSwedishPhone(data.phone) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {touched.phone && errors.phone && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5 text-red-400 text-xs ml-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-white/40 text-xs ml-1">Vi ringer dig inom 2 minuter</p>
        </div>

        {/* Email Field (Optional) */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-white/80 ml-1">
            E-post <span className="text-white/40">(valfritt)</span>
          </label>
          <div className="relative">
            <div className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 text-white/40'
            )}>
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="din@epost.se"
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/40',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all',
                touched.email && errors.email 
                  ? 'border-red-500/50 focus:border-red-500/50' 
                  : data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
                    ? 'border-emerald-500/30 focus:border-emerald-500/30'
                    : 'border-white/10 focus:border-brand/50'
              )}
            />
          </div>
          <AnimatePresence>
            {touched.email && errors.email && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5 text-red-400 text-xs ml-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Honeypot field (hidden from users, traps bots) */}
        <input
          type="text"
          name="website"
          value=""
          onChange={() => {}}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              'flex-1 py-3 rounded-xl text-white/70 hover:text-white',
              'border border-white/10 hover:border-white/20',
              'transition-all duration-200'
            )}
          >
            Tillbaka
          </button>
          <motion.button
            type="submit"
            disabled={!isValid}
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium transition-all duration-200',
              isValid
                ? 'bg-brand text-white hover:bg-brand-light'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            )}
          >
            Fortsätt
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}