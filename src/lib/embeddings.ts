/**
 * Google Gemini Embedding 2 Integration
 * 
 * Generates 768-dimensional embeddings for text and images.
 * Uses separate Google AI API key (NOT OpenRouter).
 * 
 * Gemini Embedding 2 is natively multimodal - text and images
 * are embedded in the same vector space for semantic similarity search.
 */

const GEMINI_EMBEDDING_MODEL = 'gemini-embedding-exp-03-07'
const GEMINI_EMBEDDING_DIMENSION = 768

interface EmbeddingResult {
  embedding: number[]
  tokenCount: number
}

interface ImageEmbeddingInput {
  imageData: string // base64 encoded
  mimeType: string // e.g., 'image/jpeg', 'image/png'
  description?: string // optional text context
}

/**
 * Generate text embedding using Gemini Embedding 2
 */
export async function generateTextEmbedding(text: string): Promise<EmbeddingResult> {
  const apiKey = process.env.GOOGLE_EMBEDDING_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_EMBEDDING_API_KEY is not set. This is separate from OpenRouter.')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: {
          parts: [{ text }],
        },
        taskType: 'RETRIEVAL_DOCUMENT',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini Embedding API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  
  return {
    embedding: data.embedding.values,
    tokenCount: data.embedding.tokenCount || 0,
  }
}

/**
 * Generate image embedding using Gemini Embedding 2
 * The model can process images natively in the same vector space as text.
 */
export async function generateImageEmbedding(input: ImageEmbeddingInput): Promise<EmbeddingResult> {
  const apiKey = process.env.GOOGLE_EMBEDDING_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_EMBEDDING_API_KEY is not set')
  }

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = []

  // Add text description if provided
  if (input.description) {
    parts.push({ text: input.description })
  }

  // Add image data - Gemini Embedding 2 processes images natively
  parts.push({
    inlineData: {
      mimeType: input.mimeType,
      data: input.imageData,
    },
  })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: {
          parts,
        },
        taskType: 'RETRIEVAL_DOCUMENT',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini Image Embedding API error: ${response.status} - ${error}`)
  }

  const data = await response.json()

  return {
    embedding: data.embedding.values,
    tokenCount: data.embedding.tokenCount || 0,
  }
}

/**
 * Generate query embedding for search
 * Uses RETRIVAL_QUERY task type for better match quality
 */
export async function generateQueryEmbedding(query: string): Promise<EmbeddingResult> {
  const apiKey = process.env.GOOGLE_EMBEDDING_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_EMBEDDING_API_KEY is not set')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: {
          parts: [{ text: query }],
        },
        taskType: 'RETRIEVAL_QUERY',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini Query Embedding API error: ${response.status} - ${error}`)
  }

  const data = await response.json()

  return {
    embedding: data.embedding.values,
    tokenCount: data.embedding.tokenCount || 0,
  }
}

/**
 * Analyze an uploaded image using Gemini Flash vision
 * Returns structured description of construction/renovation work
 */
export async function analyzeConstructionImage(base64Image: string, mimeType: string): Promise<{
  description: string
  projectType: string
  damageTypes: string[]
  estimatedScope: string
  materials: string[]
  confidence: number
}> {
  const apiKey = process.env.GOOGLE_EMBEDDING_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_EMBEDDING_API_KEY is not set')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analysera denna bild av ett bygg- eller renoveringsprojekt. Svara på svenska med följande JSON-format:
{
  "description": "Kort beskrivning av vad bilden visar",
  "projectType": "En av: takbyten, badrumsrenovering, köksrenovering, nybyggnation, tillbyggnad, ombyggnation, snickeri, fasad, annat",
  "damageTypes": ["Lista av skadetyper eller arbetsbehov"],
  "estimatedScope": "small/medium/large",
  "materials": ["Lista av synliga material"],
  "confidence": 0.0-1.0
}

Fokusera på:
- Typ av byggnadsarbete (tak, badrum, kök, fasad etc.)
- Skador eller problem som syns (vattenläckor, sprickor, slitage etc.)
- Material som syns (tegel, plåt, trä, kakel etc.)
- Omfattning av arbete (liten reparation vs totalrenovering)

Svara ENDAST med giltig JSON.`
            },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini Vision API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!textContent) {
    throw new Error('No response from Gemini Vision')
  }

  try {
    return JSON.parse(textContent)
  } catch {
    // Fallback if JSON parsing fails
    return {
      description: textContent.slice(0, 200),
      projectType: 'annat',
      damageTypes: [],
      estimatedScope: 'medium',
      materials: [],
      confidence: 0.5,
    }
  }
}

export { GEMINI_EMBEDDING_MODEL, GEMINI_EMBEDDING_DIMENSION }