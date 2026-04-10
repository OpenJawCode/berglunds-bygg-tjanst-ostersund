import { NextRequest, NextResponse } from 'next/server'
import { formatPhoneToE164, isValidSwedishPhone } from '@/lib/phone-utils'

const N8N_WEBHOOK = 'https://abdulrahman-n8n.duckdns.org/webhook/https://berglundsbyggtjanstostersund.com/'
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  if (record.count >= RATE_LIMIT) return false
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'För många förfrågningar. Vänligen försök igen senare.' },
        { status: 429 }
      )
    }

    const { name, email, phone, postal_code, project_type, description, source, agent_id } = await request.json()

    if (!name || !email || !phone || !postal_code || !project_type) {
      return NextResponse.json({ error: 'Alla obligatoriska fält måste fyllas i' }, { status: 400 })
    }

    const formattedPhone = formatPhoneToE164(phone)
    if (!formattedPhone || !isValidSwedishPhone(phone)) {
      return NextResponse.json({ error: 'Ogiltigt telefonnummer' }, { status: 400 })
    }

    const payload = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: formattedPhone,
      postal_code,
      project_type,
      description: description || '',
      source: source || 'form',
      agent_id: agent_id || 'agent_2cddb47efe7325ad729c41f6d2',
    }

    await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('n8n webhook failed:', err))

    return NextResponse.json({
      success: true,
      message: 'Tack! Vi hör av oss inom 2 minuter.',
    })
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json({ error: 'Något gick fel. Försök igen.' }, { status: 500 })
  }
}
