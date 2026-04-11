import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { analyzeConstructionImage } from '@/lib/embeddings'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'https://berglundsbyggtjanst.se',
  'https://berglundsbyggtjanst.se',
  'http://localhost:3000',
  'http://localhost:3001',
]

export async function POST(request: NextRequest) {
  try {
    // Validate origin
    const origin = request.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || request.ip
      || 'unknown'

    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Ingen bild tillhandahållen' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Ogiltig filtyp. Tillåtna: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Filen är för stor. Max storlek: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Vercel Blob
    const blob = await put(`chat-uploads/${Date.now()}-${file.name}`, buffer, {
      access: 'public',
      contentType: file.type,
    })

    // Analyze the image with Gemini Vision
    const base64Image = buffer.toString('base64')
    let analysis = null
    
    try {
      analysis = await analyzeConstructionImage(base64Image, file.type)
    } catch (error) {
      console.warn('Image analysis failed (non-critical):', error)
      // Continue without analysis - the upload still succeeds
    }

    return NextResponse.json({
      url: blob.url,
      analysis: analysis ? {
        description: analysis.description,
        projectType: analysis.projectType,
        damageTypes: analysis.damageTypes,
        estimatedScope: analysis.estimatedScope,
        materials: analysis.materials,
        confidence: analysis.confidence,
      } : null,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Något gick fel vid uppladdningen' },
      { status: 500 }
    )
  }
}