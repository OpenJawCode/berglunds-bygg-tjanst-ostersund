'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Phone, ChevronLeft, CheckCircle, AlertCircle, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { ServiceSelect } from '@/components/ui/ServiceSelect'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
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
  content: 'Hej! Jag är Berglunds AI-assistent 👋\n\nJag hjälper dig att komma igång med din offert. Berätta lite om vad du vill bygga eller renovera, så guidar jag dig vidare.',
  timestamp: new Date(),
}

const SERVICES = [
  { value: 'takbyten', label: 'Takbyten' },
  { value: 'badrumsrenovering', label: 'Badrumsrenovering' },
  { value: 'köksrenovering', label: 'Köksrenovering' },
  { value: 'nybyggnation', label: 'Nybyggnation' },
  { value: 'tillbyggnad', label: 'Tillbyggnad' },
  { value: 'ombyggnation', label: 'Ombyggnation' },
  { value: 'snickeri', label: 'Snickeriarbeten' },
  { value: 'fasad', label: 'Fasadarbeten' },
  { value: 'annat', label: 'Annat' },
]

export default function QuoteChat({ onLeadCollected, onBack }: QuoteChatProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<Partial<LeadData>>({})
  const [showGetQuote, setShowGetQuote] = useState(false)
  const [chatState, setChatState] = useState<ChatState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showShortcutHint, setShowShortcutHint] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractLeadInfo = (text: string) => {
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
      updated.project_type = foundProject
    }

    if (text.length > 20 && !updated.description) {
      updated.description = text.slice(0, 200)
    }

    setLeadData(updated)
    const hasEnough = !!(updated.name && updated.phone && updated.project_type)
    setShowGetQuote(hasEnough)

    return updated
  }

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setChatState('sending')
    setErrorMessage(null)

    extractLeadInfo(input)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
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
              role: 'assistant',
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
    const service = SERVICES.find(s => s.value === value)
    if (service) {
      setLeadData(prev => ({ ...prev, project_type: value }))
      setInput(prev => prev + (prev ? ' ' : '') + `Jag vill ha ${service.label.toLowerCase()}. `)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand" />
            </div>
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d1117]"
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
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
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand text-white rounded-br-md'
                    : 'bg-white/10 text-white rounded-bl-md'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={cn('text-xs mt-1', msg.role === 'user' ? 'text-white/70' : 'text-white/40')}>
                  {msg.timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Typing Indicator */}
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

      {/* Service Quick Select */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="pb-3"
      >
        <ServiceSelect
          value={leadData.project_type || ''}
          onChange={handleServiceSelect}
          placeholder="Välj tjänst..."
        />
      </motion.div>

      {/* Get Quote CTA */}
      <AnimatePresence>
        {showGetQuote && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="pb-2"
          >
            <AnimatedButton
              onClick={handleGetQuote}
              className="w-full"
              variant="primary"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Få offert & bli uppringd
            </AnimatedButton>
            <p className="text-xs text-white/50 text-center mt-2">
              Vi ringer inom 2 minuter till {leadData.phone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="pt-4 border-t border-white/10">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowShortcutHint(true)}
            onBlur={() => setShowShortcutHint(false)}
            placeholder="Skriv ditt meddelande..."
            rows={1}
            className={cn(
              'flex-1 px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/40',
              'focus:outline-none focus:ring-2 focus:ring-brand/30',
              chatState === 'error' ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-brand',
              'resize-none max-h-32'
            )}
          />
          
          {/* Keyboard Shortcut Hint */}
          <AnimatePresence>
            {showShortcutHint && input.trim() && !isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-8 right-0 px-2 py-1 bg-white/10 rounded-lg text-xs text-white/60"
              >
                ↵ Enter för att skicka
              </motion.div>
            )}
          </AnimatePresence>

          {/* Send Button with State Animations */}
          <AnimatedButton
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="relative overflow-hidden"
            variant="primary"
            size="md"
            chatState={chatState}
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
              ) : chatState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.div>
              ) : chatState === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ x: [-5, 5, -5, 5, 0] }}
                  animate={{ x: 0 }}
                  exit={{ x: 0 }}
                >
                  <AlertCircle className="w-4 h-4" />
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
        <p className="text-xs text-white/40 text-center mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI:n kan göra misstag. Kontrollera viktig info.
        </p>
      </div>
    </div>
  )
}