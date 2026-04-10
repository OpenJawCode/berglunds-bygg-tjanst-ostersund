'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FileText, X, Phone, Mail, MapPin, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { services } from '@/lib/constants'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'
import QuoteWizard from '@/components/global/QuoteWizard'
import QuoteChat from '@/components/global/QuoteChat'

type ModalStep = 'choice' | 'wizard' | 'chat' | 'success'

interface FormData {
  name: string
  email: string
  phone: string
  postal_code: string
  project_type: string
  description: string
}

export default function GlobalQuoteLauncher() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalStep, setModalStep] = useState<ModalStep>('choice')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    postal_code: '',
    project_type: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    } catch (error) {
      console.error('Submit error:', error)
      alert('Något gick fel. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setModalStep('choice')
    setFormData({
      name: '',
      email: '',
      phone: '',
      postal_code: '',
      project_type: '',
      description: '',
    })
  }

  return (
    <>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className={cn(
                'w-full max-w-2xl rounded-3xl overflow-hidden',
                'bg-background-dark border border-border',
                'shadow-2xl shadow-black/50'
              )}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-heading text-xl font-semibold text-white">
                  {modalStep === 'choice' && 'Välj hur du vill komma igång'}
                  {modalStep === 'wizard' && 'Få en offert'}
                  {modalStep === 'chat' && 'Chatta med vår AI-assistent'}
                  {modalStep === 'success' && 'Tack för din förfrågan!'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Stäng"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {modalStep === 'choice' && (
                    <motion.div
                      key="choice"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {/* Quick Form Card */}
                      <button
                        onClick={() => setModalStep('wizard')}
                        className={cn(
                          'p-6 rounded-2xl border border-border text-left',
                          'bg-white/5 hover:bg-white/10 transition-all',
                          'group focus:outline-none focus:ring-4 focus:ring-brand/30'
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-brand" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white mb-2">
                          📝 Snabbt formulär
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          Fyll i 3 fält på 30 sekunder. Vi ringer upp dig.
                        </p>
                        <div className="flex items-center text-brand text-sm font-medium">
                          Börja nu <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </button>

                      {/* AI Chat Card */}
                      <button
                        onClick={() => setModalStep('chat')}
                        className={cn(
                          'p-6 rounded-2xl border border-border text-left',
                          'bg-white/5 hover:bg-white/10 transition-all',
                          'group focus:outline-none focus:ring-4 focus:ring-brand/30'
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <MessageSquare className="w-6 h-6 text-brand" />
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-white mb-2">
                          💬 AI-chatt
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          Prata med vår AI som hjälper dig steg för steg.
                        </p>
                        <div className="flex items-center text-brand text-sm font-medium">
                          Starta chatt <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </button>
                    </motion.div>
                  )}

                  {modalStep === 'wizard' && (
                    <motion.div
                      key="wizard"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <QuoteWizard
                        initialData={formData}
                        onSubmit={handleSubmit}
                        onBack={() => setModalStep('choice')}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  )}

                  {modalStep === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-[400px]"
                    >
                      <QuoteChat
                        onLeadCollected={handleSubmit}
                        onBack={() => setModalStep('choice')}
                      />
                    </motion.div>
                  )}

                  {modalStep === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-8 h-8 text-brand" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-white mb-3">
                        Vi hör av oss snart!
                      </h3>
                      <p className="text-white/70 mb-6">
                        Du får en bekräftelse på e-post inom 15 sekunder. 
                        Vår AI-assistent ringer dig inom 2 minuter för att samla mer detaljer.
                      </p>
                      <Button onClick={handleClose} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Stäng
                      </Button>
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
