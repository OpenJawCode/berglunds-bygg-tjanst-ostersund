'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Phone, Mail, MapPin, ChevronLeft, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
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

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: 'Hej! Jag är Berglunds AI-assistent 👋\n\nJag hjälper dig att komma igång med din offert. Berätta lite om vad du vill bygga eller renovera, så guidar jag dig vidare.',
  timestamp: new Date(),
}

export default function QuoteChat({ onLeadCollected, onBack }: QuoteChatProps) {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<Partial<LeadData>>({})
  const [showGetQuote, setShowGetQuote] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const extractLeadInfo = (text: string) => {
    const updated: Partial<LeadData> = { ...leadData }
    
    // Extract name (simple heuristic: capitalized words after "jag heter" or similar)
    const nameMatch = text.match(/(?:jag heter|mitt namn är|namn:\s*)([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)?)/i)
    if (nameMatch && nameMatch[1]) updated.name = nameMatch[1].trim()

    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) updated.email = emailMatch[0]

    // Extract phone (Swedish format)
    const phoneMatch = text.match(/07[02369]\s?\d{3}\s?\d{2}\s?\d{2}|\+46\s?7[02369]\s?\d{3}\s?\d{2}\s?\d{2}/)
    if (phoneMatch) updated.phone = phoneMatch[0]

    // Extract postal code
    const postalMatch = text.match(/\b\d{3}\s?\d{2}\b/)
    if (postalMatch) updated.postal_code = postalMatch[0]

    // Extract project type keywords
    const projectKeywords = ['tak', 'badrum', 'kök', 'renovering', 'nybyggnation', 'tillbyggnad', 'snickeri', 'fasad']
    const lowerText = text.toLowerCase()
    const foundProject = projectKeywords.find((kw) => lowerText.includes(kw))
    if (foundProject && !updated.project_type) {
      updated.project_type = foundProject
    }

    // Store description if not set
    if (text.length > 20 && !updated.description) {
      updated.description = text.slice(0, 200)
    }

    setLeadData(updated)

    // Check if we have enough info to show "Get quote"
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

    // Extract lead info from user message
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
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || 'Ursäkta, jag kunde inte svara just nu.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Berglunds AI</p>
            <p className="text-white/50 text-xs">Online · Svarar direkt</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div
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
              </div>
              <div
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand" />
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Get Quote CTA */}
      <AnimatePresence>
        {showGetQuote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pb-2"
          >
            <Button onClick={handleGetQuote} className="w-full bg-brand hover:bg-brand-light">
              <Phone className="w-4 h-4 mr-2" />
              Få offert & bli uppringd
            </Button>
            <p className="text-xs text-white/50 text-center mt-2">
              Vi ringer inom 2 minuter till {leadData.phone}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv ditt meddelande..."
            rows={1}
            className={cn(
              'flex-1 px-4 py-3 rounded-xl border border-border bg-white/5 text-white placeholder-white/40',
              'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
              'resize-none max-h-32'
            )}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-brand hover:bg-brand-light disabled:opacity-50 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-white/40 text-center mt-2">
          AI:n kan göra misstag. Kontrollera viktig info.
        </p>
      </div>
    </div>
  )
}
