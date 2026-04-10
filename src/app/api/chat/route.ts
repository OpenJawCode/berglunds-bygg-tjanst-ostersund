import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis/Upstash)
const rateLimitStore = new Map<string, { count: number; resetTime: number; firstSeen: number }>()

const RATE_LIMIT = 5 // requests per window
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY_MESSAGES = 10

// Prompt injection patterns to detect
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)/i,
  /forget\s+(everything|all|what)/i,
  /system\s*:\s*/i,
  /\[SYSTEM\]/i,
  /<system>/i,
  /you\s+(are|will)\s+(now|be)\s+(a|an)\s+/i,
  /new\s+instructions/i,
  /override/i,
  /bypass/i,
  /jailbreak/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /pretend\s+(to\s+be|to)\s+(be|have)/i,
  /role\s*=\s*/i,
  /act\s+as\s+(if|though)/i,
  /\\x00/, // null bytes
  /\x00/, // null bytes
]

function getClientIP(request: NextRequest): string {
  // Check X-Forwarded-For first (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(',')[0].trim()
  }
  
  // Check X-Real-IP (nginx common header)
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fall back to request.ip
  return request.ip ?? 'unknown'
}

function sanitizeInput(input: string): string {
  // Remove null bytes and other control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, MAX_MESSAGE_LENGTH)
  
  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ')
  
  return sanitized
}

function containsPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

function sanitizeHistory(history: unknown): { role: string; content: string }[] {
  if (!Array.isArray(history)) return []
  
  const safeHistory = history as Array<{ role?: unknown; content?: unknown }>
  
  return safeHistory
    .slice(-MAX_HISTORY_MESSAGES)
    .filter((msg): msg is { role: string; content: string } => 
      msg !== null && 
      typeof msg.role === 'string' && 
      typeof msg.content === 'string'
    )
    .map(msg => ({
      role: ['user', 'assistant', 'system'].includes(msg.role) ? msg.role : 'user',
      content: sanitizeInput(msg.content).slice(0, MAX_MESSAGE_LENGTH)
    }))
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    const newRecord = { 
      count: 1, 
      resetTime: now + RATE_WINDOW,
      firstSeen: now
    }
    rateLimitStore.set(ip, newRecord)
    return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: newRecord.resetTime }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetTime: record.resetTime }
}

// Cleanup old entries periodically (simple approach)
function cleanupOldEntries() {
  const now = Date.now()
  const ipsToDelete: string[] = []
  rateLimitStore.forEach((record, ip) => {
    if (now > record.resetTime) {
      ipsToDelete.push(ip)
    }
  })
  ipsToDelete.forEach(ip => rateLimitStore.delete(ip))
}

// Run cleanup every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    // Get client IP with better detection
    const ip = getClientIP(request)
    
    // Rate limiting with detailed response
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'För många förfrågningar. Vänta en stund och försök igen.',
          retryAfter: Math.ceil((rateCheck.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateCheck.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }

    // Parse and validate request body
    let body: { message?: unknown; history?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { message, history } = body

    // Validate message exists and is string
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Sanitize message input
    const sanitizedMessage = sanitizeInput(message)

    // Check for prompt injection
    if (containsPromptInjection(sanitizedMessage)) {
      // Log suspicious activity but don't reveal detection
      console.warn('Potential prompt injection detected from IP:', ip)
      
      // Return a safe generic response
      return NextResponse.json(
        { 
          reply: 'Jag förstod inte det. Kan du omformulera din fråga?' 
        }
      )
    }

    // Sanitize history
    const sanitizedHistory = sanitizeHistory(history as { role: string; content: string }[] | undefined)

    // OpenRouter API call with enhanced security headers
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://berglundsbyggtjanst.se',
        'X-Title': 'Berglunds Byggtjänst Chat',
        // Additional security headers
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'system',
            content: `Du är en hjälpsam assistent för Berglunds Byggtjänst Östersund, ett lokalt byggföretag i Jämtland.

FÖRETAGSINFORMATION:
- Namn: Berglunds Byggtjänst Östersund
- Telefon: 070 321 88 27
- E-post: infoberglundsbyggtjanstosd@gmail.com
- Adress: Namn 110, 832 93 Frösön
- Tjänster: Takbyten, badrumsrenoveringar, nybyggnation, ombyggnation, snickeriarbeten
- ROT-avdrag: Ja, 30% skattereduktion på arbetskostnaden
- Svarstid: Inom 24 timmar på offertförfrågningar

VIKTIGA REGLER:
1. Svara alltid på svenska
2. Var hjälpsam och professionell
3. Om någon vill ha en offert, be om: namn, telefon, e-post, adress, typ av tjänst, och beskrivning av projektet
4. Nämn ROT-avdrag när det är relevant (30% på arbetskostnaden)
5. Om du inte vet svaret, be kunden kontakta oss på telefon eller mejl
6. Håll svaren korta och koncisa (max 2-3 meningar)

NUVARANDE KONVERSATION: Du samlar in information för en offertförfrågan.`,
          },
          ...sanitizedHistory,
          {
            role: 'user',
            content: sanitizedMessage,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      
      // Handle specific error codes
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Tjänsten är temporärt överbelastad. Försök igen om en stund.' },
          { status: 503 }
        )
      }
      
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || 'Ursäkta, jag kunde inte bearbeta din fråga.'

    // Return response with rate limit headers
    return NextResponse.json(
      { reply },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateCheck.remaining),
          'X-RateLimit-Reset': String(rateCheck.resetTime)
        }
      }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}