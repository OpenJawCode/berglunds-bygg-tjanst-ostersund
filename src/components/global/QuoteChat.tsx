'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Phone, ChevronLeft, CheckCircle, AlertCircle, Sparkles, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { ServiceSelect } from '@/components/ui/ServiceSelect'
import { ImageUploadButton, ImagePreview } from '@/components/ui/ImageUpload'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'
import { haptic } from '@/lib/haptic'
import { SERVICE_OPTIONS } from '@/lib/services'

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(amount)
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  image?: string
  sources?: Array<{
    title: string
    type: string
    costRange: [number, number]
    costAfterRot: number
    rotAvdrag: number
    score: number
    timeEstimate: string
    squareMeters: number
  }>
  costEstimate?: {
    range: [number, number]
    median: number
    rotDeduction: number
    costAfterRot: number
    confidence: 'low' | 'medium' | 'high'
    basedOn: string[]
    explanation: string
  } | null
}

interface LeadData {
  name: string
  email: string
  phone: string
  postal_code: string
  project_type: string
  description: string
}

interface QuoteChatProps {
  onLeadCollected: (data: LeadData) => Promise<void>
  onBack: () => void
}

type ChatState = 'idle' | 'sending' | 'success' | 'error'

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: 'Hej! Jag är Berglunds AI-assistent 👋\n\nJag hjälper dig att komma igång med din offert. Du kan:\n\n📷 Ladda upp en bild på ditt projekt\n💬 Beskriva vad du behöver hjälp med\n\nBerätta om ditt projekt så guidar jag dig vidare!',
  timestamp: new Date(),
}

export default function QuoteChat({ onLeadCollected, onBack }: QuoteChatProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<Partial<LeadData>>({})
  const [showGetQuote, setShowGetQuote] = useState(false)
  const [chatState, setChatState] = useState<ChatState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showServiceChips, setShowServiceChips] = useState(true)
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageAnalysisResult, setImageAnalysisResult] = useState<{
    description: string
    projectType: string
    damageTypes: string[]
    estimatedScope: string
    materials: string[]
    confidence: number
  } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check if we have enough info for quote
  useEffect(() => {
    const hasEnough = !!(leadData.name && leadData.phone && leadData.project_type)
    setShowGetQuote(hasEnough)
  }, [leadData])

  const extractLeadInfo = useCallback((text: string) => {
    const updated: Partial<LeadData> = { ...leadData }
    
    const nameMatch = text.match(/(?:jag heter|mitt namn är|namn:\s*)([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)?)/i)
    if (nameMatch && nameMatch[1]) updated.name = nameMatch[1].trim()

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) updated.email = emailMatch[0]

    const phoneMatch = text.match(/07[02369]\s?\d{3}\s?\d{2}\s?\d{2}|\+46\s?7[02369]\s?\d{3}\s?\d{2}\s?\d{2}/)
    if (phoneMatch) updated.phone = phoneMatch[0]

    const postalMatch = text.match(/\b\d{3}\s?\d{2}\b/)
    if (postalMatch) updated.postal_code = postalMatch[0]

    const projectKeywords = ['tak', 'badrum', 'kök', 'renovering', 'nybyggnation', 'tillbyggnad', 'snickeri', 'fasad']
    const lowerText = text.toLowerCase()
    const foundProject = projectKeywords.find((kw) => lowerText.includes(kw))
    if (foundProject && !updated.project_type) {
      const serviceMap: Record<string, string> = {
        'tak': 'takbyten',
        'badrum': 'badrumsrenovering',
        'kök': 'köksrenovering',
        'nybyggnation': 'nybyggnation',
        'tillbyggnad': 'tillbyggnad',
        'renovering': 'ombyggnation',
        'snickeri': 'snickeri',
        'fasad': 'fasad'
      }
      updated.project_type = serviceMap[foundProject] || foundProject
    }

    if (text.length > 20 && !updated.description) {
      updated.description = text.slice(0, 200)
    }

    setLeadData(updated)
    return updated
  }, [leadData])

  const handleImageSelect = useCallback(async (file: File, preview: string) => {
    setSelectedImage({ file, preview })
    setShowServiceChips(false)
    
    // Analyze image in the background
    try {
      setIsUploading(true)
      setUploadProgress(10)
      
      const formData = new FormData()
      formData.append('image', file)
      
      setUploadProgress(30)
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      
      setUploadProgress(70)
      
      if (response.ok) {
        const data = await response.json()
        setUploadProgress(100)
        
        if (data.analysis) {
          setImageAnalysisResult(data.analysis)
        }
      }
    } catch (error) {
      console.warn('Image analysis failed (non-critical):', error)
      // Continue without analysis - the image is still attached
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const handleImageRemove = useCallback(() => {
    setSelectedImage(null)
    haptic.light()
  }, [])

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isTyping) return

    haptic.messageSent()

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim() || '(Bild bifogad)',
      timestamp: new Date(),
      image: selectedImage?.preview,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSelectedImage(null)
    setIsTyping(true)
    setChatState('sending')
    setErrorMessage(null)
    setShowServiceChips(false)

    if (input.trim()) {
      extractLeadInfo(input)
    }

    try {
      // Use multimodal API with RAG
      const requestBody: Record<string, unknown> = {
        message: input.trim() || 'Användaren har laddat upp en bild.',
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      }

      // Include image analysis if available
      if (imageAnalysisResult) {
        requestBody.imageAnalysis = imageAnalysisResult
      }

      const response = await fetch('/api/chat/multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 429) {
          setChatState('error')
          setErrorMessage('För många förfrågningar. Vänta en stund och försök igen.')
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant' as const,
              content: 'Jag är lite upptagen just nu. Vänta en stund och försök igen, eller använd vårt formulär för att få en offert.',
              timestamp: new Date(),
            },
          ])
          setIsTyping(false)
          return
        }
        throw new Error(data.error || 'API error')
      }

      setChatState('success')
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || 'Ursäkta, jag kunde inte svara just nu.',
        timestamp: new Date(),
        sources: data.sources || [],
        costEstimate: data.costEstimate || null,
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      setTimeout(() => setChatState('idle'), 2000)
    } catch (error) {
      console.error('Chat error:', error)
      setChatState('error')
      setErrorMessage('Något gick fel. Försök igen.')
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Något gick fel. Försök igen eller använd formuläret istället.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleGetQuote = async () => {
    if (!leadData.name || !leadData.phone || !leadData.project_type) return

    const phoneE164 = formatPhoneToE164(leadData.phone!)
    if (!phoneE164 || !isValidSwedishPhone(leadData.phone!)) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Ogiltigt telefonnummer. Ange formatet 070-123 45 67.',
          timestamp: new Date(),
        },
      ])
      return
    }

    haptic.success()
    await onLeadCollected({
      name: leadData.name!,
      email: leadData.email || '',
      phone: leadData.phone!,
      postal_code: leadData.postal_code || '',
      project_type: leadData.project_type!,
      description: leadData.description || '',
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleServiceSelect = (value: string) => {
    const service = SERVICE_OPTIONS.find(s => s.value === value)
    if (service) {
      setLeadData(prev => ({ ...prev, project_type: value }))
      // Add a system message showing the selection
      const selectionMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: `Jag är intresserad av ${service.label.toLowerCase()}.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, selectionMessage])
      setShowServiceChips(false)
      
      // Trigger AI response
      setIsTyping(true)
      setTimeout(() => {
        const responseMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Perfekt! Jag hjälper dig med ${service.label.toLowerCase()}. Kan du berätta mer om projektet? Till exempel:\n\n• Ungefärlig storlek (kvm)\n• Vilket år byggdes huset?\n• Har du några bilder du kan dela?\n• När önskar du att arbetet ska påbörjas?`,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, responseMessage])
        setIsTyping(false)
      }, 800)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117]" ref={chatContainerRef}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30"
          aria-label="Gå tillbaka"
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand" />
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d1117]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Berglunds AI</p>
            <p className="text-white/50 text-xs">Online · Svarar direkt</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  msg.role === 'user' ? 'bg-brand' : 'bg-white/10'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-brand" />
                )}
              </motion.div>

              {/* Message Bubble */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={cn(
                  'max-w-[80%] space-y-2',
                  msg.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                {/* Image attachment */}
                {msg.image && (
                  <div className={cn(
                    'overflow-hidden rounded-2xl',
                    msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                  )}>
                    <img
                      src={msg.image}
                      alt="Bifogad bild"
                      className="max-w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(msg.image, '_blank')}
                    />
                  </div>
                )}
                
                {/* Text content */}
                <div
                  className={cn(
                    'px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-brand text-white rounded-br-md'
                      : 'bg-white/10 text-white rounded-bl-md'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Cost Estimate Card */}
                {msg.role === 'assistant' && msg.costEstimate && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-brand/10 border border-brand/20 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-brand">kr</span>
                      </div>
                      <span className="text-xs font-medium text-brand">Kostnadsuppskattning</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full ml-auto',
                        msg.costEstimate.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                        msg.costEstimate.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      )}>
                        {msg.costEstimate.confidence === 'high' ? 'Hög' :
                         msg.costEstimate.confidence === 'medium' ? 'Medel' : 'Låg'} säkerhet
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/50">Intervall</span>
                        <p className="text-white font-medium">
                          {formatCurrency(msg.costEstimate.range[0])} - {formatCurrency(msg.costEstimate.range[1])}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/50">Efter ROT-avdrag</span>
                        <p className="text-brand font-medium">{formatCurrency(msg.costEstimate.costAfterRot)}</p>
                      </div>
                      <div>
                        <span className="text-white/50">ROT-avdrag</span>
                        <p className="text-white">{formatCurrency(msg.costEstimate.rotDeduction)}</p>
                      </div>
                      <div>
                        <span className="text-white/50">Baserat på</span>
                        <p className="text-white">{msg.costEstimate.basedOn.length} liknande projekt</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/40 pt-1">
                      ⚠️ Preliminär uppskattning. Kontakta oss för exakt offert.
                    </p>
                  </motion.div>
                )}

                {/* Similar Projects */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-white/40">Liknande projekt:</p>
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-xs text-brand font-medium">{Math.round(source.score * 100)}%</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{source.title}</p>
                          <p className="text-xs text-white/40">
                            {formatCurrency(source.costRange[0])} - {formatCurrency(source.costRange[1])} · {source.timeEstimate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Timestamp */}
                <p className={cn('text-xs', msg.role === 'user' ? 'text-white/50 text-right' : 'text-white/30')}>
                  {msg.timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand" />
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-brand rounded-full"
                      animate={{ 
                        y: [0, -6, 0],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Service Quick Select Chips */}
      <AnimatePresence>
        {showServiceChips && messages.length < 3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-3"
          >
            <p className="text-xs text-white/40 mb-2">Vad behöver du hjälp med?</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {SERVICE_OPTIONS.slice(0, 6).map((service) => {
                const Icon = service.icon
                return (
                  <motion.button
                    key={service.value}
                    type="button"
                    onClick={() => handleServiceSelect(service.value)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap',
                      'bg-white/5 border border-white/10',
                      'hover:bg-white/10 hover:border-brand/30',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-brand/20'
                    )}
                  >
                    <Icon className="w-4 h-4 text-brand" />
                    <span className="text-sm text-white/90">{service.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 pb-3"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 max-w-[200px]">
              <img
                src={selectedImage.preview}
                alt="Vald bild"
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className={cn(
                  'absolute top-1.5 right-1.5 p-1 rounded-full',
                  'bg-black/60 text-white/80 hover:bg-black/80',
                  'transition-colors'
                )}
                aria-label="Ta bort bild"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Get Quote CTA */}
      <AnimatePresence>
        {showGetQuote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-3"
          >
            <div className="bg-brand/10 border border-brand/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1">Redo för offert?</h4>
                  <p className="text-white/60 text-xs mb-3">
                    Vi har samlat in tillräckligt med information. Få en återuppringning inom 2 minuter.
                  </p>
                  <AnimatedButton
                    onClick={handleGetQuote}
                    className="w-full"
                    variant="primary"
                    size="sm"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Få offert & bli uppringd
                  </AnimatedButton>
                </div>
              </div>
              {leadData.phone && (
                <p className="text-xs text-white/40 text-center mt-2">
                  Vi ringer till: {leadData.phone}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked Input Area */}
      <div className="border-t border-white/10 bg-[#0d1117] p-4">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          {/* Image Upload Button */}
          <ImageUploadButton
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            isUploading={isUploading}
          />
          
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ditt meddelande..."
              rows={1}
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50',
                'transition-all duration-200',
                chatState === 'error' ? 'border-red-500/50' : 'border-white/10',
                'min-h-[48px] max-h-[120px]'
              )}
              style={{ height: 'auto' }}
              aria-label="Skriv ditt meddelande"
            />
          </div>
          
          {/* Send Button */}
          <AnimatedButton
            onClick={sendMessage}
            disabled={(!input.trim() && !selectedImage) || isTyping}
            className="flex-shrink-0"
            variant="primary"
            size="md"
            chatState={chatState}
            aria-label="Skicka meddelande"
          >
            <AnimatePresence mode="wait">
              {chatState === 'sending' ? (
                <motion.div
                  key="sending"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Send className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedButton>
        </div>
        
        {/* Footer */}
        <p className="text-xs text-white/30 text-center mt-3 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI:n kan göra misstag. Kontrollera viktig info.
          {selectedImage && (
            <>
              <span className="mx-1">·</span>
              <ImageIcon className="w-3 h-3" />
              Bild kommer att analyseras
            </>
          )}
        </p>
      </div>
    </div>
  )
}
