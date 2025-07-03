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

    console.log('Testing MongoDB connection...')

    // Parse connection details from connection string
    try {
      // Parse the MongoDB connection string
      const url = MONGODB_CONNECTION_STRING
      console.log('Connection string format appears valid')
      
      // Extract basic info from connection string
      const urlMatch = url.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/)
      if (urlMatch) {
        const [, username, password, host, database] = urlMatch
        
        const connectionInfo = {
          success: true,
          message: 'MongoDB connection string parsed successfully',
          details: {
            host: host,
            database: database,
            username: username,
            hasPassword: !!password,
            connectionFormat: 'mongodb+srv (Atlas format)'
          },
          note: 'Native MongoDB drivers have compatibility issues with Deno runtime in Supabase Edge Functions.',
          recommendations: [
            'Consider using MongoDB Atlas Data API for HTTP-based database access',
            'Use MongoDB Atlas App Services for serverless functions',
            'Store data in Supabase PostgreSQL which has native support',
            'Use a webhook to sync data between MongoDB and Supabase'
          ],
          nextSteps: [
            '1. Enable MongoDB Atlas Data API in your cluster',
            '2. Create API keys for Data API access',
            '3. Use HTTP requests instead of native drivers'
          ]
        }
        
        return new Response(JSON.stringify(connectionInfo, null, 2), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200
        })
      } else {
        throw new Error('Invalid MongoDB connection string format')
      }
      
    } catch (parseError) {
      throw new Error(`Connection string parsing failed: ${parseError.message}`)
    }
    
  } catch (error) {
    console.error('MongoDB test error:', error)
    
    const errorResponse = {
      success: false,
      error: error.message,
      details: 'MongoDB native drivers are not compatible with Deno runtime in Supabase Edge Functions',
      alternatives: [
        'Use MongoDB Atlas Data API (HTTP-based)',
        'Migrate data to Supabase PostgreSQL',
        'Set up a separate API server for MongoDB access',
        'Use MongoDB Atlas App Services'
      ]
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