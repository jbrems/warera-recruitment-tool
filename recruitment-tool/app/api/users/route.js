import { fetchAllUsers, clearCache, getLastUpdateDate, setLastUpdateDate } from '@/lib/warera-api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const countryIdParam = searchParams.get('countryId')
    const countryId = (countryIdParam && countryIdParam !== 'undefined') ? countryIdParam : '6813b6d446e731854c7ac7a4'
    console.log('[API Route GET] Received countryId param:', countryIdParam, 'using countryId:', countryId)
    console.log('[API Route GET] searchParams:', [...searchParams.entries()])
    const users = await fetchAllUsers(null, countryId)
    const lastUpdateDate = getLastUpdateDate(countryId)
    console.log(`[API Route GET] Returning ${users.length} users for countryId: ${countryId}, last updated at ${lastUpdateDate ? new Date(lastUpdateDate).toISOString() : 'never'}`)
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
    const countryId = body.countryId || '6813b6d446e731854c7ac7a4'

    if (body.action === 'update') {
      console.log('[API Route] Updating user data for countryId:', countryId)
      const lastUpdateDate = getLastUpdateDate(countryId)

      // Fetch new users since last update
      let lastUpdateTime = lastUpdateDate ? new Date(lastUpdateDate).getTime() : 0
      // Start from 1 second before last update to catch any edge cases
      lastUpdateTime = Math.max(0, lastUpdateTime - 1000)

      const users = await fetchAllUsers(new Date(lastUpdateTime), countryId)
      setLastUpdateDate(Date.now(), countryId)

      return Response.json({
        success: true,
        message: 'User data updated',
        data: users,
        lastUpdateDate: getLastUpdateDate(countryId)
      })
    } else if (body.action === 'clearCache') {
      console.log('[API Route] Clearing cache for countryId:', countryId)
      clearCache(countryId)
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
