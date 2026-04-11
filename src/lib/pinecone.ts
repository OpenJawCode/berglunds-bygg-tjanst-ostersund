import { Pinecone } from '@pinecone-database/pinecone'

const PINECONE_INDEX_NAME = 'berglunds-projects'

let pineconeInstance: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pineconeInstance) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables')
    }
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }
  return pineconeInstance
}

export async function getPineconeIndex() {
  const client = getPineconeClient()
  const indexName = PINECONE_INDEX_NAME

  try {
    const existingIndexes = await client.listIndexes()
    const indexExists = existingIndexes.indexes?.some(idx => idx.name === indexName)

    if (!indexExists) {
      await client.createIndex({
        name: indexName,
        dimension: 768,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })
    }
  } catch (error) {
    console.warn('Pinecone index setup warning:', error)
  }

  return client.index(indexName)
}

export { PINECONE_INDEX_NAME }