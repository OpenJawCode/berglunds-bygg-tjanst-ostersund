'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Calendar, Home, Coins, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BUDGET_OPTIONS, TIMELINE_OPTIONS, PROPERTY_OWNER_OPTIONS } from './LeadScoring'
import { haptic } from '@/lib/haptic'

interface StepDetailsProps {
  data: {
    budget?: string
    timeline?: string
    isPropertyOwner?: boolean
  }
  onChange: (data: Partial<StepDetailsProps['data']>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepDetails({ data, onChange, onNext, onBack }: StepDetailsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    data.budget ? 'budget' : data.timeline ? 'timeline' : data.isPropertyOwner !== undefined ? 'property' : null
  )

  const handleBudgetSelect = useCallback((value: string) => {
    haptic.selection()
    onChange({ budget: value })
    setExpandedSection('timeline')
  }, [onChange])

  const handleTimelineSelect = useCallback((value: string) => {
    haptic.selection()
    onChange({ timeline: value })
    setExpandedSection('property')
  }, [onChange])

  const handlePropertySelect = useCallback((value: 'yes' | 'no' | 'planning') => {
    haptic.selection()
    onChange({ isPropertyOwner: value === 'yes' })
    setExpandedSection(null)
  }, [onChange])

  const handleContinue = useCallback(() => {
    haptic.success()
    onNext()
  }, [onNext])

  const completedCount = [
    data.budget ? 1 : 0,
    data.timeline ? 1 : 0,
    data.isPropertyOwner !== undefined ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-xl font-semibold text-white mb-2"
        >
          Berätta mer om ditt projekt
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-sm"
        >
          Detta hjälper oss att ge dig en mer exakt offert
        </motion.p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i < completedCount ? 'bg-brand' : 'bg-white/20'
              )}
            />
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'budget' ? null : 'budget')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              data.budget ? 'bg-brand/20 text-brand' : 'bg-white/10 text-white/40'
            )}>
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Budget</p>
              <p className="text-white/40 text-xs">
                {data.budget 
                  ? BUDGET_OPTIONS.find(o => o.value === data.budget)?.label 
                  : 'Välj en option'}
              </p>
            </div>
          </div>
          {data.budget && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-brand flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'budget' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleBudgetSelect(option.value)}
                    className={cn(
                      'p-3 rounded-lg text-xs text-left transition-all duration-200',
                      'border',
                      data.budget === option.value
                        ? 'bg-brand/10 border-brand/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Section */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'timeline' ? null : 'timeline')}
          disabled={!data.budget}
          className={cn(
            'w-full flex items-center justify-between p-4 text-left transition-colors',
            !data.budget && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              data.timeline ? 'bg-brand/20 text-brand' : 'bg-white/10 text-white/40'
            )}>
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Tidsplan</p>
              <p className="text-white/40 text-xs">
                {data.timeline 
                  ? TIMELINE_OPTIONS.find(o => o.value === data.timeline)?.label 
                  : data.budget ? 'Välj en option' : 'Välj budget först'}
              </p>
            </div>
          </div>
          {data.timeline && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-brand flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'timeline' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 pb-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTimelineSelect(option.value)}
                    className={cn(
                      'p-3 rounded-lg text-xs text-left transition-all duration-200',
                      'border',
                      data.timeline === option.value
                        ? 'bg-brand/10 border-brand/30 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property Ownership Section */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedSection(expandedSection === 'property' ? null : 'property')}
          disabled={!data.timeline}
          className={cn(
            'w-full flex items-center justify-between p-4 text-left transition-colors',
            !data.timeline && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              data.isPropertyOwner !== undefined ? 'bg-brand/20 text-brand' : 'bg-white/10 text-white/40'
            )}>
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Ägare av fastigheten?</p>
              <p className="text-white/40 text-xs">
                {data.isPropertyOwner !== undefined 
                  ? (data.isPropertyOwner ? 'Ja, jag äger' : 'Nej') 
                  : data.timeline ? 'Välj en option' : 'Välj tidsplan först'}
              </p>
            </div>
          </div>
          {data.isPropertyOwner !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-brand flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'property' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 pb-4 space-y-2"
            >
              {PROPERTY_OWNER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePropertySelect(option.value as 'yes' | 'no' | 'planning')}
                  className={cn(
                    'w-full p-3 rounded-lg text-xs text-left transition-all duration-200',
                    'border',
                    (data.isPropertyOwner === true && option.value === 'yes') ||
                    (data.isPropertyOwner === false && option.value === 'no') ||
                    (data.isPropertyOwner === undefined && option.value === 'planning')
                      ? 'bg-brand/10 border-brand/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-brand/10 border border-brand/20 rounded-xl p-4 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <div className="text-xs text-white/70">
          <p className="font-medium text-white mb-1">ROT-avdrag</p>
          <p>Som fastighetsägare kan du få 30% rabatt genom ROT-avdrag på arbetskostnaden.</p>
        </div>
      </motion.div>

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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl font-medium bg-brand text-white hover:bg-brand-light transition-all duration-200"
        >
          Fortsätt
        </motion.button>
      </div>
    </motion.div>
  )
}