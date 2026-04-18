import { fetchAllUsers, clearCache, getLastUpdateDate, setLastUpdateDate } from '@/lib/warera-api'

export async function GET(request) {
  try {
    console.log('[API Route] GET /api/users')
    const users = await fetchAllUsers()
    const lastUpdateDate = getLastUpdateDate()
    console.log(`[API Route] Returning ${users.length} users, last updated at ${lastUpdateDate ? new Date(lastUpdateDate).toISOString() : 'never'}`)
    return Response.json({
      success: true,
      data: users,
      lastUpdateDate: lastUpdateDate
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

// POST endpoint to manually update or clear cache
export async function POST(request) {
  try {
    const body = await request.json()

    if (body.action === 'update') {
      console.log('[API Route] Updating user data...')
      const lastUpdateDate = getLastUpdateDate()

      // Fetch new users since last update
      let lastUpdateTime = lastUpdateDate ? new Date(lastUpdateDate).getTime() : 0
      // Start from 1 second before last update to catch any edge cases
      lastUpdateTime = Math.max(0, lastUpdateTime - 1000)

      const users = await fetchAllUsers(new Date(lastUpdateTime))
      setLastUpdateDate(Date.now())

      return Response.json({
        success: true,
        message: 'User data updated',
        data: users,
        lastUpdateDate: getLastUpdateDate()
      })
    } else if (body.action === 'clearCache') {
      console.log('[API Route] Clearing cache...')
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
