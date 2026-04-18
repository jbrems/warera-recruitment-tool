import { fetchAllUsers, clearCache } from '@/lib/warera-api'

export async function GET(request) {
  try {
    console.log('[API Route] GET /api/users')
    const users = await fetchAllUsers()
    console.log(`[API Route] Returning ${users.length} users to client`)
    return Response.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('[API Route] Error:', error.message)
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users'
      },
      { status: 500 }
    )
  }
}

// POST endpoint to manually clear cache
export async function POST(request) {
  try {
    const body = await request.json()

    if (body.action === 'clearCache') {
      clearCache()
      return Response.json({
        success: true,
        message: 'Cache cleared'
      })
    }

    return Response.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 })
  } catch (error) {
    console.error('[API Route] POST Error:', error.message)
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
