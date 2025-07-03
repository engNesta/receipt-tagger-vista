import { corsHeaders } from '../_shared/cors.ts'

const MONGODB_CONNECTION_STRING = Deno.env.get('MONGODB_CONNECTION_STRING')

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting MongoDB connection test...')
    
    if (!MONGODB_CONNECTION_STRING) {
      throw new Error('MongoDB connection string not configured')
    }

    // Import MongoDB driver
    const { MongoClient } = await import('https://deno.land/x/mongo@v0.32.0/mod.ts')
    
    console.log('Connecting to MongoDB...')
    const client = new MongoClient()
    
    // Connect to MongoDB
    await client.connect(MONGODB_CONNECTION_STRING)
    console.log('Connected to MongoDB successfully!')
    
    // Get database instance (will use default database from connection string)
    const db = client.database()
    
    // List all collections
    console.log('Listing collections...')
    const collections = await db.listCollectionNames()
    console.log('Collections found:', collections)
    
    // Get some sample data from each collection (limit to first 5 documents)
    const collectionData: Record<string, any[]> = {}
    
    for (const collectionName of collections.slice(0, 5)) { // Limit to first 5 collections
      try {
        console.log(`Getting sample data from collection: ${collectionName}`)
        const collection = db.collection(collectionName)
        const sampleData = await collection.find({}).limit(3).toArray()
        collectionData[collectionName] = sampleData
        console.log(`Found ${sampleData.length} documents in ${collectionName}`)
      } catch (error) {
        console.error(`Error reading collection ${collectionName}:`, error)
        collectionData[collectionName] = [`Error: ${error.message}`]
      }
    }
    
    // Close the connection
    await client.close()
    console.log('MongoDB connection closed')
    
    const response = {
      success: true,
      message: 'MongoDB connection successful',
      database: 'Connected successfully',
      collections: collections,
      sampleData: collectionData,
      totalCollections: collections.length
    }
    
    return new Response(JSON.stringify(response, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200
    })
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    
    const errorResponse = {
      success: false,
      error: error.message,
      details: error.stack
    }
    
    return new Response(JSON.stringify(errorResponse, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 500
    })
  }
})