import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 3 // requests per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

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
    const ip = request.ip ?? 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'För många förfrågningar. Vänligen försök igen senare.' },
        { status: 429 }
      )
    }

    const { name, email, phone, address, service, customerType, message } = await request.json()

    // Validation
    if (!name || !email || !phone || !address || !service) {
      return NextResponse.json(
        { error: 'Alla obligatoriska fält måste fyllas i' },
        { status: 400 }
      )
    }

    // Format the quote request
    const quoteRequest = {
      name,
      email,
      phone,
      address,
      service,
      customerType: customerType || 'Privatperson',
      message: message || '',
      submittedAt: new Date().toISOString(),
    }

    // Here you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation to customer

    // For now, just log it
    console.log('Quote request received:', quoteRequest)

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Tack för din förfrågan! Vi återkommer inom 24 timmar.',
    })
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Något gick fel. Vänligen försök igen senare.' },
      { status: 500 }
    )
  }
}
