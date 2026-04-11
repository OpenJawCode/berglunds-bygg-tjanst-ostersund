import { NextRequest, NextResponse } from 'next/server'
import { searchProjectsByQuery, searchProjectsByImage, generateCostEstimate } from '@/lib/project-search'
import { SEED_PROJECTS, formatCurrency } from '@/lib/seed-projects'

// Rate limiting (in-memory, same as chat route)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // More generous for RAG-enhanced chat
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_MESSAGES = 10
const API_TIMEOUT = 30000 // 30s for RAG + LLM

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'https://berglundsbyggtjanst.se',
  'https://berglundsbyggtjanst.se',
  'http://localhost:3000',
  'http://localhost:3001',
]

// Injection detection patterns
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
]

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || request.ip
    || 'unknown'
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, MAX_MESSAGE_LENGTH).replace(/\s+/g, ' ')
}

function containsPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text))
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}

interface RAGChatRequest {
  message: string
  history: Array<{ role: string; content: string }>
  imageAnalysis?: {
    description: string
    projectType: string
    damageTypes: string[]
    estimatedScope: string
    materials: string[]
    confidence: number
  } | null
  imageUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    const origin = request.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Request not allowed' }, { status: 403 })
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateCheck = checkRateLimit(clientIP)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'För många förfrågningar. Vänta en stund och försök igen.' },
        { status: 429 }
      )
    }

    // Parse request
    const body: RAGChatRequest = await request.json()
    const { message, history, imageAnalysis, imageUrl } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Meddelande saknas' }, { status: 400 })
    }

    const sanitizedMessage = sanitizeInput(message)

    if (containsPromptInjection(sanitizedMessage)) {
      return NextResponse.json({
        reply: 'Jag förstod inte det. Kan du omformulera din fråga?',
        sources: [],
        costEstimate: null,
      })
    }

    // Sanitize history
    const sanitizedHistory = Array.isArray(history)
      ? history.slice(-MAX_HISTORY_MESSAGES).filter(
          (msg): msg is { role: string; content: string } =>
            msg !== null && typeof msg.role === 'string' && typeof msg.content === 'string'
        ).map(msg => ({
          role: ['user', 'assistant', 'system'].includes(msg.role) ? msg.role : 'user',
          content: sanitizeInput(msg.content),
        }))
      : []

    // Step 1: Search for similar projects (RAG retrieval)
    let searchResults
    try {
      // Use image analysis context if available, otherwise text query
      const searchQuery = imageAnalysis
        ? `${imageAnalysis.description} ${imageAnalysis.projectType} ${imageAnalysis.damageTypes.join(' ')} ${imageAnalysis.materials.join(' ')}`
        : sanitizedMessage

      searchResults = await searchProjectsByQuery(searchQuery, 3)
    } catch (error) {
      console.warn('Search failed, continuing without RAG:', error)
      searchResults = { results: [], totalMatches: 0, queryAnalysis: undefined }
    }

    // Step 2: Generate cost estimate from search results
    const costEstimate = searchResults.results.length > 0
      ? generateCostEstimate(searchResults.results, sanitizedMessage)
      : null

    // Step 3: Build context for the LLM
    const projectContext = searchResults.results.length > 0
      ? searchResults.results
          .filter(r => r.score > 0.2)
          .slice(0, 3)
          .map((r, i) => {
            const p = r.project
            const m = p.metadata
            return `Projekt ${i + 1}: ${p.title}
- Typ: ${p.project_type}
- Beskrivning: ${p.short_description}
- Storlek: ${m.square_meters} kvm
- Uppskattad kostnad: ${formatCurrency(m.cost_range[0])} - ${formatCurrency(m.cost_range[1])}
- ROT-avdrag: ${formatCurrency(m.rot_avdrag_amount)} (30% av arbetskostnad)
- Kostnad efter ROT-avdrag: ${formatCurrency(m.cost_after_rot)}
- Tidsåtgång: ${m.time_estimate}
- Material: ${m.materials.join(', ')}
- Relevans: ${Math.round(r.score * 100)}%`
          }).join('\n\n')
      : 'Inga liknande projekt hittades i databasen.'

    const imageContext = imageAnalysis
      ? `\n\nANVÄNDAR BILDANALYS:
- Beskrivning: ${imageAnalysis.description}
- Identifierad projekttyp: ${imageAnalysis.projectType}
- Skadetyper: ${imageAnalysis.damageTypes.join(', ')}
- Omfattning: ${imageAnalysis.estimatedScope}
- Material: ${imageAnalysis.materials.join(', ')}
- Konfidens: ${Math.round(imageAnalysis.confidence * 100)}%`
      : ''

    const costContext = costEstimate
      ? `\n\nKOSTNADSUPPSKATTNING:
- Intervall: ${formatCurrency(costEstimate.estimateRange[0])} - ${formatCurrency(costEstimate.estimateRange[1])}
- Medianuppskattning: ${formatCurrency(costEstimate.medianEstimate)}
- ROT-avdrag: ${formatCurrency(costEstimate.rotDeduction)}
- Kostnad efter ROT-avdrag: ${formatCurrency(costEstimate.costAfterRot)}
- Konfidensnivå: ${costEstimate.confidenceLevel}
- Baserat på: ${costEstimate.basedOnProjects.join(', ')}`
      : ''

    // Step 4: Call OpenRouter with RAG-enhanced context
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://berglundsbyggtjanst.se',
          'X-Title': 'Berglunds Byggtjänst RAG Chat',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [
            {
              role: 'system',
              content: `Du är Berglunds AI-assistent för Berglunds Byggtjänst Östersund, ett lokalt byggföretag i Jämtland som specialiserar sig på renoveringar, takbyten och nybyggnation.

FÖRETAGSINFORMATION:
- Namn: Berglunds Byggtjänst Östersund
- Telefon: 070 321 88 27
- E-post: infoberglundsbyggtjanstosd@gmail.com
- Adress: Namn 110, 832 93 Frösön
- Tjänster: Takbyten, badrumsrenoveringar, köksrenoveringar, nybyggnation, tillbyggnad, ombyggnation, snickeriarbeten, fasadarbeten
- ROT-avdrag: Ja, 30% skattereduktion på arbetskostnaden (max 50,000 kr/person/år)

VIKTIGA REGLER:
1. Svara ALLTID på svenska
2. Var hjälpsam, professionell och kunnig om bygg och renovering
3. Om någon vill ha en offert, be om: namn, telefon, e-post, postnummer, typ av tjänst, och beskrivning av projektet
4. Nämn ROT-avdrag När det är relevant (30% på arbetskostnaden, max 50,000 kr/person/år)
5. Om du inte vet svaret, be kunden kontakta oss på telefon eller mejl
6. Håll svaren koncisa men informativa (max 3-4 meningar för vanliga svar)
7. VID KOSTNADSUPPSKATTNINGAR: Allge INCLUDE en tydlig varning att detta är en uppskattning baserad på liknande projekt och att kunden KONTAKTA oss för en exakt offert. Säg ALDRIG att kostnaden är exakt eller garanterad.

KONTEXT FRÅN DATABAS (liknande projekt):
${projectContext}
${imageContext}
${costContext}

NUGARANDE KONVERSATION: Du samlar in information för en offertförfrågan och ger vägledning om kostnader och processer.`,
            },
            ...sanitizedHistory,
            {
              role: 'user',
              content: sanitizedMessage,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API error:', response.status, errorText)

        if (response.status === 429) {
          return NextResponse.json(
            { error: 'Tjänsten är temporärt överbelastad. Försök igen om en stund.' },
            { status: 503 }
          )
        }

        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      let reply = data.choices?.[0]?.message?.content || 'Ursäkta, jag kunde inte bearbeta din fråga.'

      // Sanitize output
      reply = reply.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
        .replace(/on\w+\s*=/gi, '')

      // Return response with RAG metadata
      return NextResponse.json({
        reply,
        sources: searchResults.results.slice(0, 3).map(r => ({
          title: r.project.title,
          type: r.project.project_type,
          costRange: [r.project.metadata.cost_range[0], r.project.metadata.cost_range[1]],
          costAfterRot: r.project.metadata.cost_after_rot,
          rotAvdrag: r.project.metadata.rot_avdrag_amount,
          score: r.score,
          timeEstimate: r.project.metadata.time_estimate,
          squareMeters: r.project.metadata.square_meters,
        })),
        costEstimate: costEstimate ? {
          range: costEstimate.estimateRange,
          median: costEstimate.medianEstimate,
          rotDeduction: costEstimate.rotDeduction,
          costAfterRot: costEstimate.costAfterRot,
          confidence: costEstimate.confidenceLevel,
          basedOn: costEstimate.basedOnProjects,
          explanation: costEstimate.explanation,
        } : null,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Begäran tog för lång tid. Försök igen.' },
          { status: 504 }
        )
      }
      throw fetchError
    }
  } catch (error) {
    console.error('RAG Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}