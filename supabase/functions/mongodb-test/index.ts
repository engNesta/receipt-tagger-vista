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

    console.log('MongoDB connection string provided:', MONGODB_CONNECTION_STRING ? 'Yes' : 'No')

    // Import MongoDB driver - using a more stable version
    const { MongoClient } = await import('https://deno.land/x/mongo@v0.31.1/mod.ts')
    
    console.log('Creating MongoDB client...')
    const client = new MongoClient()
    
    // Connect to MongoDB with explicit connection string
    console.log('Attempting to connect to MongoDB...')
    await client.connect(MONGODB_CONNECTION_STRING)
    console.log('Connected to MongoDB successfully!')
    
    // Parse database name from connection string
    const dbNameMatch = MONGODB_CONNECTION_STRING.match(/\/([^/?]+)(\?|$)/)
    const dbName = dbNameMatch ? dbNameMatch[1] : 'test'
    console.log('Using database:', dbName)
    
    // Get database instance
    const db = client.database(dbName)
    
    // List all collections
    console.log('Listing collections...')
    const collections = await db.listCollectionNames()
    console.log('Collections found:', collections)
    
    // Get some sample data from each collection (limit to first 3 collections)
    const collectionData: Record<string, any[]> = {}
    
    for (const collectionName of collections.slice(0, 3)) { // Limit to first 3 collections
      try {
        console.log(`Getting sample data from collection: ${collectionName}`)
        const collection = db.collection(collectionName)
        const sampleData = await collection.find({}).limit(2).toArray()
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
      database: dbName,
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
      details: error.stack,
      connectionString: MONGODB_CONNECTION_STRING ? 'Provided' : 'Missing'
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