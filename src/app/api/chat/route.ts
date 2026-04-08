import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 5 // requests
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.ip ?? 'unknown'
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // OpenRouter API endpoint for Gemini Flash
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://berglundsbyggtjanst.se',
        'X-Title': 'Berglunds Byggtjänst Chat',
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
          ...history,
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || 'Ursäkta, jag kunde inte bearbeta din fråga.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
