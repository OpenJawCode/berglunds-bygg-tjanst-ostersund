'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, X, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICE_OPTIONS } from '@/lib/services'
import { haptic } from '@/lib/haptic'

interface StepServicesProps {
  data: {
    services: string[]
    description: string
  }
  onChange: (data: Partial<StepServicesProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

interface ServiceWithDetails {
  value: string
  followUpQuestions: Record<string, string>
}

const SERVICE_DETAILS: Record<string, ServiceWithDetails['followUpQuestions']> = {
  takbyten: {
    area: 'Hur stor är takytan? (kvm)',
    material: 'Vilket takmaterial föredrar du?',
    year: 'Vilket år byggdes huset?',
  },
  badrumsrenovering: {
    size: 'Hur stort är badrummet? (kvm)',
    type: 'Ska det vara helrenovering eller delrenovering?',
    floor: 'Vill du ha våtrumsgolv och kakel?',
  },
  köksrenovering: {
    size: 'Hur stort är köket? (kvm)',
    style: 'Vilken kökstil föredrar du?',
    appliance: 'Ska nya vitvaror ingå?',
  },
  nybyggnation: {
    type: 'Vilken typ av byggnation?',
    size: 'Ungefärlig boyta? (kvm)',
    location: 'Var i Östersund-området?',
  },
  tillbyggnad: {
    type: 'Vilken typ av tillbyggnad?',
    size: 'Ungefärlig tillbyggd yta? (kvm)',
    floor: '1 eller 2 plan?',
  },
  ombyggnation: {
    type: 'Vilken typ av ombyggnation?',
    current: 'Nuvarande planlösning',
    goal: 'Vad vill du uppnå?',
  },
  snickeri: {
    type: 'Vilken typ av snickeriarbete?',
    material: 'Vilket material föredrar du?',
    custom: 'Har du specifika mått eller ritningar?',
  },
  fasad: {
    type: 'Vilken typ av fasadarbete?',
    area: 'Hur stor är fasaden? (kvm)',
    material: 'Vilket material föredrar du?',
  },
}

export default function StepServices({ data, onChange, onNext, onBack }: StepServicesProps) {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(
    data.services[0] || null
  )
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>(
    data.services.slice(1)
  )
  const [showSecondaryOptions, setShowSecondaryOptions] = useState(false)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const handlePrimarySelect = useCallback((value: string) => {
    haptic.selection()
    setSelectedPrimary(value)
    onChange({ services: [value, ...selectedSecondary] })
  }, [selectedSecondary, onChange])

  const handleSecondaryToggle = useCallback((value: string) => {
    haptic.selection()
    if (selectedSecondary.includes(value)) {
      const updated = selectedSecondary.filter(v => v !== value)
      setSelectedSecondary(updated)
      onChange({ services: [selectedPrimary!, ...updated] })
    } else {
      const updated = [...selectedSecondary, value]
      setSelectedSecondary(updated)
      onChange({ services: [selectedPrimary!, ...updated] })
    }
  }, [selectedSecondary, selectedPrimary, onChange])

  const handleContinue = useCallback(() => {
    haptic.success()
    onNext()
  }, [onNext])

  const selectedCount = (selectedPrimary ? 1 : 0) + selectedSecondary.length
  const canContinue = !!selectedPrimary

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-xl font-semibold text-white mb-2"
        >
          Vad behöver du hjälp med?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-sm"
        >
          Välj en huvudtjänst (obligatoriskt) och eventuellt fler
        </motion.p>
      </div>

      {/* Primary Service Selection */}
      <div className="space-y-3">
        <p className="text-sm text-white/60 ml-1">Huvudtjänst <span className="text-red-400">*</span></p>
        <div className="grid grid-cols-1 gap-2">
          {SERVICE_OPTIONS.map((service, index) => {
            const Icon = service.icon
            const isSelected = selectedPrimary === service.value
            
            return (
              <motion.button
                key={service.value}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePrimarySelect(service.value)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200',
                  'border',
                  isSelected
                    ? 'bg-brand/10 border-brand/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  isSelected ? 'bg-brand text-white' : 'bg-white/10 text-white/70'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium text-sm truncate',
                    isSelected ? 'text-white' : 'text-white/80'
                  )}>
                    {service.label}
                  </p>
                  <p className="text-xs text-white/40 truncate">{service.description}</p>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-6 h-6 rounded-full bg-brand flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Secondary Services (Optional) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowSecondaryOptions(!showSecondaryOptions)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-brand transition-colors ml-1"
        >
          <Plus className={cn('w-4 h-4 transition-transform', showSecondaryOptions && 'rotate-45')} />
          Lägg till fler tjänster (valfritt)
        </button>

        <AnimatePresence>
          {showSecondaryOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-2"
            >
              {SERVICE_OPTIONS.filter(s => s.value !== selectedPrimary).map((service) => {
                const Icon = service.icon
                const isSelected = selectedSecondary.includes(service.value)
                
                return (
                  <motion.button
                    key={service.value}
                    type="button"
                    onClick={() => handleSecondaryToggle(service.value)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg text-left text-xs transition-all duration-200',
                      'border',
                      isSelected
                        ? 'bg-brand/10 border-brand/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{service.label}</span>
                    {isSelected && <X className="w-3 h-3 ml-auto" />}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Services Summary */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-brand" />
              <span className="text-sm text-white/80">Valda tjänster ({selectedCount})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPrimary && (
                <span className="px-3 py-1.5 rounded-full bg-brand/20 text-brand text-sm">
                  {SERVICE_OPTIONS.find(s => s.value === selectedPrimary)?.label}
                </span>
              )}
              {selectedSecondary.map(value => (
                <span 
                  key={value}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-sm"
                >
                  {SERVICE_OPTIONS.find(s => s.value === value)?.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Questions based on primary service */}
      <AnimatePresence>
        {selectedPrimary && SERVICE_DETAILS[selectedPrimary] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <p className="text-sm text-white/60 ml-1">Mer information (valfritt)</p>
            {Object.entries(SERVICE_DETAILS[selectedPrimary]).map(([key, question]) => (
              <div 
                key={key}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(expandedQuestion === key ? null : key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm text-white/80">{question}</span>
                  <ChevronRight className={cn(
                    'w-4 h-4 text-white/40 transition-transform',
                    expandedQuestion === key && 'rotate-90'
                  )} />
                </button>
                <AnimatePresence>
                  {expandedQuestion === key && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="px-4 pb-4"
                    >
                      <input
                        type="text"
                        placeholder="Ditt svar..."
                onChange={(e) => {
                  const newValue = e.target.value
                  const existing = data.description || ''
                  // Replace this specific question's answer or append
                  const questionPrefix = question + ': '
                  if (existing.includes(questionPrefix)) {
                    // Replace existing answer for this question
                    const updated = existing.replace(new RegExp(questionPrefix + '.*?(?=\\n|$)'), questionPrefix + newValue)
                    onChange({ description: updated })
                  } else {
                    // Append new answer
                    const separator = existing ? '\n' : ''
                    onChange({ description: existing + separator + questionPrefix + newValue })
                  }
                }}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand/50"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          whileHover={{ scale: canContinue ? 1.02 : 1 }}
          whileTap={{ scale: canContinue ? 0.98 : 1 }}
          className={cn(
            'flex-1 py-3 rounded-xl font-medium transition-all duration-200',
            canContinue
              ? 'bg-brand text-white hover:bg-brand-light'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          )}
        >
          Fortsätt
        </motion.button>
      </div>
    </motion.div>
  )
}