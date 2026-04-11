/**
 * Seed Project Ingestion Script
 * 
 * Run this script to populate Pinecone with the seed projects.
 * Each project is embedded using Gemini Embedding 2 and stored
 * with its metadata for vector similarity search.
 * 
 * Usage: npx tsx src/scripts/ingest-seed-projects.ts
 */

import { getPineconeIndex, PINECONE_INDEX_NAME } from '../lib/pinecone'
import { generateTextEmbedding } from '../lib/embeddings'
import { SEED_PROJECTS } from '../lib/seed-projects'

async function ingestProjects() {
  console.log(`🚀 Starting ingestion of ${SEED_PROJECTS.length} seed projects...`)
  console.log(`📦 Using Pinecone index: ${PINECONE_INDEX_NAME}`)

  if (!process.env.PINECONE_API_KEY) {
    console.error('❌ PINECONE_API_KEY is not set')
    process.exit(1)
  }

  if (!process.env.GOOGLE_EMBEDDING_API_KEY) {
    console.error('❌ GOOGLE_EMBEDDING_API_KEY is not set')
    process.exit(1)
  }

  const index = await getPineconeIndex()

  const records: Array<{
    id: string
    values: number[]
    metadata: Record<string, string | number>
  }> = []

  for (const project of SEED_PROJECTS) {
    try {
      console.log(`\n📝 Processing: ${project.title} (${project.id})`)

      const embeddingText = `${project.title}. ${project.description}. Typ: ${project.project_type}. Storlek: ${project.metadata.square_meters} kvm. Material: ${project.metadata.materials.join(', ')}. Kostnad: ${project.metadata.cost_estimate} kr. Ort: ${project.metadata.location}.`

      console.log(`  🔢 Generating embedding...`)
      const { embedding } = await generateTextEmbedding(embeddingText)

      records.push({
        id: project.id,
        values: embedding,
        metadata: {
          project_type: project.project_type,
          title: project.title,
          short_description: project.short_description,
          cost_estimate: String(project.metadata.cost_estimate),
          cost_min: String(project.metadata.cost_range[0]),
          cost_max: String(project.metadata.cost_range[1]),
          labor_cost: String(project.metadata.labor_cost),
          rot_avdrag: String(project.metadata.rot_avdrag_amount),
          cost_after_rot: String(project.metadata.cost_after_rot),
          time_estimate: project.metadata.time_estimate,
          square_meters: String(project.metadata.square_meters),
          year_completed: String(project.metadata.year_completed),
          location: project.metadata.location,
          difficulty: project.metadata.difficulty,
          materials: project.metadata.materials.join(','),
          highlights: project.metadata.project_highlights.join('|'),
        },
      })

      console.log(`  ✅ Embedding generated`)

      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`  ❌ Error processing ${project.id}:`, error)
    }
  }

  if (records.length > 0) {
    console.log(`\n📤 Upserting ${records.length} records to Pinecone...`)
    // Pinecone v7 uses { records: [...] } format
    await index.upsert({ records })
    console.log(`  ✅ All records upserted`)
  }

  console.log(`\n✅ Ingestion complete! ${records.length} projects processed.`)
  console.log(`\n📊 Verify by running a test query against the index.`)
}

ingestProjects().catch(console.error)