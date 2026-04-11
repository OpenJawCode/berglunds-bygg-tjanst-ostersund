/**
 * Project Search - Pinecone vector similarity search
 * 
 * Finds similar past projects using 768-dim Gemini Embedding 2 vectors.
 * Returns projects ranked by cosine similarity with cost context.
 */

import { getPineconeIndex } from './pinecone'
import { generateQueryEmbedding, generateImageEmbedding } from './embeddings'
import { SEED_PROJECTS, SeedProject, formatCurrency, calculateROTAvgdrag } from './seed-projects'

export interface SearchResult {
  project: SeedProject
  score: number // 0-1 cosine similarity
  relevanceExplanation: string
}

export interface SearchResults {
  results: SearchResult[]
  queryAnalysis?: {
    projectType: string
    scope: string
    confidence: number
  }
  totalMatches: number
}

/**
 * Search for similar projects using a text query
 */
export async function searchProjectsByQuery(
  query: string,
  topK: number = 5
): Promise<SearchResults> {
  try {
    const { embedding } = await generateQueryEmbedding(query)
    const index = await getPineconeIndex()

    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      // Fallback to seed data matching by project type
      return fallbackSearch(query, topK)
    }

    const results: SearchResult[] = queryResponse.matches.map(match => {
      const projectId = match.id
      const project = SEED_PROJECTS.find(p => p.id === projectId)
      
      if (!project) return null

      return {
        project,
        score: match.score || 0,
        relevanceExplanation: generateRelevanceExplanation(project, match.score || 0),
      }
    }).filter(Boolean) as SearchResult[]

    return {
      results,
      queryAnalysis: {
        projectType: detectProjectType(query),
        scope: detectScope(query),
        confidence: results.length > 0 ? results[0].score : 0,
      },
      totalMatches: results.length,
    }
  } catch (error) {
    console.error('Pinecone search error, falling back to seed data:', error)
    return fallbackSearch(query, topK)
  }
}

/**
 * Search for similar projects using an uploaded image
 */
export async function searchProjectsByImage(
  base64Image: string,
  mimeType: string,
  description?: string,
  topK: number = 5
): Promise<SearchResults> {
  try {
    const { embedding } = await generateImageEmbedding({
      imageData: base64Image,
      mimeType,
      description,
    })
    const index = await getPineconeIndex()

    const queryResponse = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      return fallbackSearch(description || 'byggprojekt', topK)
    }

    const results: SearchResult[] = queryResponse.matches.map(match => {
      const projectId = match.id
      const project = SEED_PROJECTS.find(p => p.id === projectId)
      
      if (!project) return null

      return {
        project,
        score: match.score || 0,
        relevanceExplanation: generateRelevanceExplanation(project, match.score || 0),
      }
    }).filter(Boolean) as SearchResult[]

    return {
      results,
      queryAnalysis: {
        projectType: description ? detectProjectType(description) : 'okänt',
        scope: 'medium',
        confidence: results.length > 0 ? results[0].score : 0,
      },
      totalMatches: results.length,
    }
  } catch (error) {
    console.error('Image search error, falling back:', error)
    return fallbackSearch(description || 'byggprojekt', topK)
  }
}

/**
 * Fallback search using seed data when Pinecone is unavailable
 * Uses keyword matching on project type and description
 */
function fallbackSearch(query: string, topK: number): SearchResults {
  const lowerQuery = query.toLowerCase()
  const projectType = detectProjectType(query)

  // Score each project based on keyword relevance
  const scored = SEED_PROJECTS.map(project => {
    let score = 0

    // Project type match (highest weight)
    if (project.project_type === projectType) {
      score += 0.5
    }

    // Description match
    const descriptionWords = project.description.toLowerCase().split(/\s+/)
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)
    for (const word of queryWords) {
      if (descriptionWords.includes(word)) {
        score += 0.1
      }
    }

    // Title match
    if (project.title.toLowerCase().includes(lowerQuery) || lowerQuery.includes(project.title.toLowerCase())) {
      score += 0.2
    }

    // Location match
    if (lowerQuery.includes(project.metadata.location.toLowerCase())) {
      score += 0.1
    }

    // Materials match
    for (const material of project.metadata.materials) {
      if (lowerQuery.includes(material.toLowerCase())) {
        score += 0.05
      }
    }

    return {
      project,
      score: Math.min(score, 1),
      relevanceExplanation: generateRelevanceExplanation(project, score),
    }
  })

  // Sort by score descending, take top K
  scored.sort((a, b) => b.score - a.score)
  const results = scored.filter(r => r.score > 0).slice(0, topK)

  return {
    results: results.length > 0 ? results : scored.slice(0, topK),
    queryAnalysis: {
      projectType,
      scope: detectScope(query),
      confidence: results.length > 0 ? results[0].score : 0,
    },
    totalMatches: results.length,
  }
}

/**
 * Generate cost estimate based on search results
 */
export function generateCostEstimate(
  results: SearchResult[],
  userQuery: string
): {
  estimateRange: [number, number]
  medianEstimate: number
  rotDeduction: number
  costAfterRot: number
  basedOnProjects: string[]
  confidenceLevel: 'low' | 'medium' | 'high'
  explanation: string
} {
  if (results.length === 0) {
    return {
      estimateRange: [0, 0],
      medianEstimate: 0,
      rotDeduction: 0,
      costAfterRot: 0,
      basedOnProjects: [],
      confidenceLevel: 'low',
      explanation: 'Inga liknande projekt hittades för att ge en uppskattning.',
    }
  }

  const costs = results
    .filter(r => r.score > 0.3)
    .map(r => r.project.metadata.cost_estimate)

  if (costs.length === 0) {
    const allCosts = results.map(r => r.project.metadata.cost_estimate)
    const min = Math.min(...allCosts)
    const max = Math.max(...allCosts)
    const median = allCosts[Math.floor(allCosts.length / 2)]
    const rot = calculateROTAvgdrag(median * 0.5) // Estimate labor as ~50% of total
    const after = median - rot

    return {
      estimateRange: [min, max],
      medianEstimate: median,
      rotDeduction: rot,
      costAfterRot: after,
      basedOnProjects: results.map(r => r.project.title),
      confidenceLevel: 'low',
      explanation: `Baserat på ${results.length} ${results.length === 1 ? 'projekt' : 'projekt'} med låg relevans. Kontakta oss för en exakt offert.`,
    }
  }

  const min = Math.min(...costs)
  const max = Math.max(...costs)
  const median = costs[Math.floor(costs.length / 2)]
  
  // Calculate average labor ratio from similar projects
  const avgLaborRatio = results
    .filter(r => r.score > 0.3)
    .reduce((sum, r) => sum + (r.project.metadata.labor_cost / r.project.metadata.cost_estimate), 0) / costs.length

  const avgLaborCost = median * avgLaborRatio
  const rot = calculateROTAvgdrag(avgLaborCost)
  const after = median - rot

  const confidenceLevel: 'low' | 'medium' | 'high' = 
    results.filter(r => r.score > 0.7).length >= 2 ? 'high' :
    results.filter(r => r.score > 0.5).length >= 1 ? 'medium' : 'low'

  return {
    estimateRange: [min, max],
    medianEstimate: median,
    rotDeduction: rot,
    costAfterRot: after,
    basedOnProjects: results.filter(r => r.score > 0.3).map(r => r.project.title),
    confidenceLevel,
    explanation: `Baserat på ${costs.length} liknande ${costs.length === 1 ? 'projekt' : 'projekt'} med ${confidenceLevel === 'high' ? 'hög' : confidenceLevel === 'medium' ? 'medel' : 'låg'} relevans.`,
  }
}

/**
 * Detect project type from user query
 */
function detectProjectType(query: string): string {
  const lower = query.toLowerCase()
  const typeMap: Record<string, string[]> = {
    'takbyten': ['tak', 'takbyte', 'takbyte', 'takläcka', 'takläckage', 'plåttak', 'tegel', 'pannor'],
    'badrumsrenovering': ['badrum', 'dusch', 'toalett', 'våtrum', 'kakel', 'klinker'],
    'köksrenovering': ['kök', 'köksrenovering', 'bänkskiva', 'skåp', 'vitvaror'],
    'nybyggnation': ['nybyggnation', 'nybygge', 'bygga nytt', 'nytt hus'],
    'tillbyggnad': ['tillbyggnad', 'utbyggnad', 'utöka', 'extensions', 'mer yta'],
    'ombyggnation': ['ombyggnation', 'ombygga', 'renovera', 'totalrenovering'],
    'snickeri': ['snickeri', 'trä', 'träarbete', 'hylla', 'skåp', 'trä'],
    'fasad': ['fasad', 'fasaden', 'målning', 'exteriör', 'utsida'],
  }

  for (const [type, keywords] of Object.entries(typeMap)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return type
    }
  }

  return 'annat'
}

/**
 * Detect project scope from user query
 */
function detectScope(query: string): string {
  const lower = query.toLowerCase()
  if (lower.match(/komplett|total|hel|stort|stora/i)) return 'large'
  if (lower.match(/liten|mindre|delvis|fixa|laga/i)) return 'small'
  return 'medium'
}

/**
 * Generate human-readable relevance explanation
 */
function generateRelevanceExplanation(project: SeedProject, score: number): string {
  if (score > 0.8) {
    return `Mycket likt ditt projekt. ${project.title} (${formatCurrency(project.metadata.cost_estimate)})`
  }
  if (score > 0.6) {
    return `Likt ditt projekt. ${project.title} (${formatCurrency(project.metadata.cost_estimate)})`
  }
  if (score > 0.4) {
    return `Delvis likt. ${project.title} (${formatCurrency(project.metadata.cost_estimate)})`
  }
  return `Kan vara relevant. ${project.title} (${formatCurrency(project.metadata.cost_estimate)})`
}