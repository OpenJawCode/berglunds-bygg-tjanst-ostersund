'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Bot, AlertTriangle, CheckCircle, X, ChevronLeft, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'
import { haptic } from '@/lib/haptic'
import { 
  LeadData, 
  LeadScore, 
  calculateLeadScore, 
  getCategoryAction 
} from './lead-qualification/LeadScoring'
import StepContact from './lead-qualification/StepContact'
import StepServices from './lead-qualification/StepServices'
import StepDetails from './lead-qualification/StepDetails'
import StepImage from './lead-qualification/StepImage'

interface LeadQualificationProps {
  onComplete: (data: {
    leadData: LeadData
    score: LeadScore
  }) => void
  onBack: () => void
}

type Step = 'contact' | 'services' | 'details' | 'image' | 'result'

interface StepState {
  contact: {
    name: string
    email: string
    phone: string
  }
  services: {
    services: string[]
    description: string
  }
  details: {
    budget?: string
    timeline?: string
    isPropertyOwner?: boolean
  }
  image: {
    images: Array<{ file: File; preview: string }>
  }
}

const initialState: StepState = {
  contact: {
    name: '',
    email: '',
    phone: '',
  },
  services: {
    services: [],
    description: '',
  },
  details: {
    budget: undefined,
    timeline: undefined,
    isPropertyOwner: undefined,
  },
  image: {
    images: [],
  },
}

export default function LeadQualification({ onComplete, onBack }: LeadQualificationProps) {
  const [currentStep, setCurrentStep] = useState<Step>('contact')
  const [stepState, setStepState] = useState<StepState>(initialState)
  const [score, setScore] = useState<LeadScore | null>(null)

  // Calculate score whenever state changes
  useEffect(() => {
    const leadData: LeadData = {
      name: stepState.contact.name,
      email: stepState.contact.email,
      phone: stepState.contact.phone,
      postal_code: '',
      services: stepState.services.services,
      description: stepState.services.description,
      budget: stepState.details.budget,
      timeline: stepState.details.timeline,
      isPropertyOwner: stepState.details.isPropertyOwner,
      hasImages: stepState.image.images.length > 0,
    }
    
    const calculatedScore = calculateLeadScore(leadData)
    setScore(calculatedScore)
  }, [stepState])

  const updateContact = useCallback((data: Partial<StepState['contact']>) => {
    setStepState(prev => ({
      ...prev,
      contact: { ...prev.contact, ...data },
    }))
  }, [])

  const updateServices = useCallback((data: Partial<StepState['services']>) => {
    setStepState(prev => ({
      ...prev,
      services: { ...prev.services, ...data },
    }))
  }, [])

  const updateDetails = useCallback((data: Partial<StepState['details']>) => {
    setStepState(prev => ({
      ...prev,
      details: { ...prev.details, ...data },
    }))
  }, [])

  const updateImage = useCallback((data: Partial<StepState['image']>) => {
    setStepState(prev => ({
      ...prev,
      image: { ...prev.image, ...data },
    }))
  }, [])

  const goToNextStep = useCallback(() => {
    haptic.light()
    const steps: Step[] = ['contact', 'services', 'details', 'image', 'result']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }, [currentStep])

  const goToPrevStep = useCallback(() => {
    haptic.light()
    const steps: Step[] = ['contact', 'services', 'details', 'image', 'result']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    } else {
      onBack()
    }
  }, [currentStep, onBack])

  const handleComplete = useCallback(() => {
    const leadData: LeadData = {
      name: stepState.contact.name,
      email: stepState.contact.email,
      phone: stepState.contact.phone,
      postal_code: '',
      services: stepState.services.services,
      description: stepState.services.description,
      budget: stepState.details.budget,
      timeline: stepState.details.timeline,
      isPropertyOwner: stepState.details.isPropertyOwner,
      hasImages: stepState.image.images.length > 0,
    }

    const finalScore = calculateLeadScore(leadData)
    onComplete({ leadData, score: finalScore })
  }, [stepState, onComplete])

  // If lead is BLOCKED, show message but don't complete yet
  if (score?.category === 'BLOCKED' && currentStep === 'result') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-6"
      >
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-white mb-2">
          Tack för din förfrågan
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Vi har mottagit dina uppgifter och kommer att kontakta dig inom 24 timmar.
        </p>
        <AnimatedButton onClick={onBack} variant="outline" className="border-white/20">
          Stäng
        </AnimatedButton>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {['contact', 'services', 'details', 'image'].map((step, index) => {
          const stepOrder: Step[] = ['contact', 'services', 'details', 'image']
          const isActive = currentStep === step
          const isCompleted = stepOrder.indexOf(currentStep) > index
          
          return (
            <div key={step} className="flex items-center">
              <div 
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  isActive ? 'bg-brand scale-125' : isCompleted ? 'bg-brand' : 'bg-white/20'
                )}
              />
              {index < 3 && (
                <div className={cn(
                  'w-8 h-0.5 mx-1 transition-all',
                  isCompleted ? 'bg-brand' : 'bg-white/20'
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {currentStep === 'contact' && (
          <StepContact
            key="contact"
            data={stepState.contact}
            onChange={updateContact}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 'services' && (
          <StepServices
            key="services"
            data={stepState.services}
            onChange={updateServices}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 'details' && (
          <StepDetails
            key="details"
            data={stepState.details}
            onChange={updateDetails}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 'image' && (
          <StepImage
            key="image"
            data={stepState.image}
            onChange={updateImage}
            onNext={handleComplete}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 'result' && score && (
          <ResultScreen
            key="result"
            score={score}
            onBack={goToPrevStep}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultScreen({ score, onBack }: { score: LeadScore; onBack: () => void }) {
  const action = getCategoryAction(score.category)

  // HOT leads - show immediate CTA
  if (score.category === 'HOT') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        {/* Animated phone icon */}
        <div className="relative w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand/40"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-brand/40"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
          <Phone className="w-8 h-8 text-brand" />
        </div>

        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-2xl font-semibold text-white mb-3"
        >
          {action.title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/70 mb-6"
        >
          {action.description}
        </motion.p>

        {/* Score breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-4 mb-6 text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Kvalificeringspoäng</span>
            <span className="text-brand font-bold text-lg">{score.total}/35</span>
          </div>
          <div className="flex gap-2">
            {score.breakdown.phone > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Telefon ✓</span>
            )}
            {score.breakdown.validPhone > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Giltig ✓</span>
            )}
            {score.breakdown.budget > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Budget ✓</span>
            )}
            {score.breakdown.timeline > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Tid ✓</span>
            )}
            {score.breakdown.propertyOwner > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Ägare ✓</span>
            )}
            {score.breakdown.images > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Bilder ✓</span>
            )}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          href="tel:070-3218827"
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand text-white font-medium hover:bg-brand-light transition-all"
        >
          <Phone className="w-5 h-5" />
          {action.cta}
        </motion.a>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-white/40 mt-4"
        >
          Öppet: Mån-Fre 07:00-17:00
        </motion.p>
      </motion.div>
    )
  }

  // WARM leads - AI with context
  if (score.category === 'WARM') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-brand" />
        </div>

        <h3 className="font-heading text-xl font-semibold text-white mb-2">
          {action.title}
        </h3>
        <p className="text-white/60 text-sm mb-6">
          {action.description}
        </p>

        {/* Score breakdown */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Kvalificeringspoäng</span>
            <span className="text-brand font-bold">{score.total}/35</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {score.breakdown.phone > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Telefon</span>
            )}
            {score.breakdown.budget > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Budget</span>
            )}
            {score.breakdown.timeline > 0 && (
              <span className="px-2 py-1 rounded bg-brand/20 text-brand text-xs">Tid</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Vi kommer att ringa dig inom 2 minuter</span>
        </div>
      </motion.div>
    )
  }

  // COLD leads - standard AI
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6"
    >
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-white/40" />
      </div>

      <h3 className="font-heading text-xl font-semibold text-white mb-2">
        {action.title}
      </h3>
      <p className="text-white/60 text-sm mb-4">
        {action.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-white/40 justify-center">
        <Sparkles className="w-4 h-4" />
        <span>Vi återkommer inom 24 timmar</span>
      </div>
    </motion.div>
  )
}