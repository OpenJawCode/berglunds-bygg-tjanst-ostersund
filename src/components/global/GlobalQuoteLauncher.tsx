'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FileText, X, Phone, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { services } from '@/lib/constants'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'
import QuoteWizard from '@/components/global/QuoteWizard'
import QuoteChat from '@/components/global/QuoteChat'
import { Confetti } from '@/components/ui/Confetti'
import { AnimatedButton } from '@/components/ui/AnimatedButton'

type ModalStep = 'choice' | 'wizard' | 'chat' | 'success'

interface FormData {
  name: string
  email: string
  phone: string
  postal_code: string
  project_type: string
  description: string
}

// Tilt card component
function TiltCard({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -8, y: x * 8 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn(
        'p-6 rounded-2xl border border-border text-left cursor-pointer',
        'bg-white/5 hover:bg-white/10',
        'focus:outline-none focus:ring-4 focus:ring-brand/30',
        className
      )}
    >
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}

export default function GlobalQuoteLauncher() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalStep, setModalStep] = useState<ModalStep>('choice')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    postal_code: '',
    project_type: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Keyboard escape to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          handleClose()
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, isFullscreen])

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const phoneE164 = formatPhoneToE164(data.phone)
      if (!phoneE164 || !isValidSwedishPhone(data.phone)) {
        throw new Error('Ogiltigt telefonnummer')
      }

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: phoneE164,
          source: modalStep === 'wizard' ? 'form' : 'chat',
          agent_id: 'agent_2cddb47efe7325ad729c41f6d2',
        }),
      })

      if (!response.ok) throw new Error('Nätverksfel')
      
      setModalStep('success')
      setShowConfetti(true)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Något gick fel. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsFullscreen(false)
    setModalStep('choice')
    setShowConfetti(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      postal_code: '',
      project_type: '',
      description: '',
    })
  }

  const handleStepChange = (step: ModalStep) => {
    setModalStep(step)
    // Auto-fullscreen for chat mode
    if (step === 'chat') {
      setIsFullscreen(true)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  const modalVariants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { 
      scale: [0.9, 1.03, 1],
      opacity: 1, 
      y: 0,
      transition: {
        scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
        opacity: { duration: 0.3 },
        y: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const }
      }
    },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } },
  }

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <>
      {/* Confetti */}
      <Confetti 
        active={showConfetti && modalStep === 'success'} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'flex items-center gap-3 px-6 py-4 rounded-full',
          'bg-brand text-white font-medium shadow-lg shadow-brand/25',
          'hover:bg-brand-light transition-colors',
          'focus:outline-none focus:ring-4 focus:ring-brand/30'
        )}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">Få en offert</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className={cn(
              'fixed z-50 flex items-center justify-center',
              isFullscreen 
                ? 'inset-0 p-0 bg-black/80 backdrop-blur-md' 
                : 'inset-0 p-4 bg-black/60 backdrop-blur-sm'
            )}
          >
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn(
                'rounded-3xl overflow-hidden',
                'bg-background-dark border border-border',
                'shadow-2xl shadow-black/50',
                isFullscreen 
                  ? 'w-screen h-screen max-w-none rounded-none' 
                  : 'w-full max-w-2xl'
              )}
            >
              {/* Modal Header */}
              <div className={cn(
                'flex items-center justify-between border-b border-border',
                isFullscreen ? 'p-6' : 'p-6'
              )}>
                <div className="flex items-center gap-3">
                  <motion.h2 
                    key={modalStep}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-heading text-xl font-semibold text-white"
                  >
                    {modalStep === 'choice' && 'Välj hur du vill komma igång'}
                    {modalStep === 'wizard' && 'Få en offert'}
                    {modalStep === 'chat' && 'Chatta med vår AI-assistent'}
                    {modalStep === 'success' && 'Tack för din förfrågan!'}
                  </motion.h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* Fullscreen toggle (not for chat - it's auto fullscreen) */}
                  {modalStep !== 'chat' && modalStep !== 'success' && (
                    <motion.button
                      onClick={toggleFullscreen}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label={isFullscreen ? 'Minimera' : 'Maximera'}
                    >
                      <motion.div
                        animate={{ rotate: isFullscreen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-5 h-5 text-white/70" />
                        ) : (
                          <Maximize2 className="w-5 h-5 text-white/70" />
                        )}
                      </motion.div>
                    </motion.button>
                  )}
                  
                  {/* Close button */}
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Stäng"
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className={cn(
                isFullscreen ? 'h-[calc(100vh-80px)]' : 'p-6 min-h-[400px]'
              )}>
                <AnimatePresence mode="wait">
                  {modalStep === 'choice' && (
                    <motion.div
                      key="choice"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Quick Form Card */}
                      <TiltCard onClick={() => handleStepChange('wizard')}>
                        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <FileText className="w-6 h-6 text-brand" />
                          </motion.div>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white mb-2">
                          📝 Snabbt formulär
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          Fyll i 3 fält på 30 sekunder. Vi ringer upp dig.
                        </p>
                        <motion.div 
                          className="flex items-center text-brand text-sm font-medium"
                          whileHover={{ x: 5 }}
                        >
                          Börja nu <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </TiltCard>

                      {/* AI Chat Card */}
                      <TiltCard onClick={() => handleStepChange('chat')}>
                        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <MessageSquare className="w-6 h-6 text-brand" />
                          </motion.div>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white mb-2">
                          💬 AI-chatt
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          Prata med vår AI som hjälper dig steg för steg.
                        </p>
                        <motion.div 
                          className="flex items-center text-brand text-sm font-medium"
                          whileHover={{ x: 5 }}
                        >
                          Starta chatt <ChevronRight className="w-4 h-4 ml-1" />
                        </motion.div>
                      </TiltCard>
                    </motion.div>
                  )}

                  {modalStep === 'wizard' && (
                    <motion.div
                      key="wizard"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={isFullscreen ? 'max-w-2xl mx-auto py-8 px-6' : ''}
                    >
                      <QuoteWizard
                        initialData={formData}
                        onSubmit={handleSubmit}
                        onBack={() => handleStepChange('choice')}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  )}

                  {modalStep === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <QuoteChat
                        onLeadCollected={handleSubmit}
                        onBack={() => {
                          setIsFullscreen(false)
                          handleStepChange('choice')
                        }}
                      />
                    </motion.div>
                  )}

                  {modalStep === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: [0.9, 1.05, 1],
                        transition: {
                          scale: { 
                            duration: 0.6, 
                            ease: [0.34, 1.56, 0.64, 1],
                            times: [0, 0.5, 1]
                          }
                        }
                      }}
                      className="text-center py-12 px-6"
                    >
                      {/* Phone icon with pulsing ring */}
                      <div className="relative w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-6">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-brand/40"
                          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-brand/40"
                          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        />
                        <Phone className="w-8 h-8 text-brand" />
                      </div>
                      
                      {/* Staggered text reveal */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-heading text-2xl font-semibold text-white mb-3"
                      >
                        Vi hör av oss snart!
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-white/70 mb-6 max-w-md mx-auto"
                      >
                        Du får en bekräftelse på e-post inom 15 sekunder. 
                        Vår AI-assistent ringer dig inom 2 minuter för att samla mer detaljer.
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <AnimatedButton onClick={handleClose} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Stäng
                        </AnimatedButton>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}