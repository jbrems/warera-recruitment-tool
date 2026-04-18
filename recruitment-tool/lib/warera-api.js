import axios from 'axios'

const WARERA_API_URL = 'https://api2.warera.io/trpc/user.getUsersByCountry'
const COUNTRY_ID = '6813b6d446e731854c7ac7a4' // Belgium
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

// Cache storage
const cache = {
  data: null,
  timestamp: null
}

const isCacheValid = () => {
  return cache.data !== null && cache.timestamp !== null && Date.now() - cache.timestamp < CACHE_DURATION
}

export const clearCache = () => {
  console.log('[API] Cache cleared manually')
  cache.data = null
  cache.timestamp = null
}

// Fetch single page of users from Warera API
export const fetchUsersPage = async (limit = 100, cursor = '') => {
  try {
    console.log(`[API] Fetching users - limit: ${limit}, cursor: ${cursor || 'none'}`)
    const response = await axios.post(WARERA_API_URL, {
      countryId: COUNTRY_ID,
      limit,
      cursor
    })

    const data = response.data.result.data
    const items = data.items || []
    const nextCursor = data.nextCursor || data.cursor || ''

    console.log(`[API] Successfully fetched ${items.length} users, nextCursor: ${nextCursor || 'none'}`)
    return {
      items,
      nextCursor
    }
  } catch (error) {
    console.error('[API] Failed to fetch users:', error.message)
    throw error
  }
}

// Fetch all users with pagination
export const fetchAllUsers = async () => {
  // Return cached data if valid
  if (isCacheValid()) {
    console.log('[API] Returning cached data (valid for next', Math.round((cache.timestamp + CACHE_DURATION - Date.now()) / 1000), 'seconds)')
    return cache.data
  }

  console.log('[API] Cache miss or expired. Fetching fresh data...')
  let allUsers = []
  let cursor = ''
  let hasMore = true
  let pageCount = 0

  while (hasMore) {
    try {
      pageCount++
      console.log(`[API] Fetching page ${pageCount}... (currentCursor: "${cursor}")`)
      const result = await fetchUsersPage(100, cursor)

      console.log(`[API] Page ${pageCount} got ${result.items.length} items`)
      console.log(`[API] Accumulated so far: ${allUsers.length} users`)
      console.log(`[API] Next cursor value: "${result.nextCursor}" (type: ${typeof result.nextCursor}, truthy: ${!!result.nextCursor})`)

      if (result.items.length === 0) {
        hasMore = false
        console.log('[API] No more users. Pagination complete.')
      } else {
        allUsers = [...allUsers, ...result.items]
        console.log(`[API] After adding page ${pageCount}: total ${allUsers.length} users`)

        cursor = result.nextCursor

        if (!cursor) {
          hasMore = false
          console.log(`[API] No nextCursor or empty cursor. Pagination complete.`)
        }
      }
    } catch (error) {
      console.error('[API] Error fetching users page:', error.message)
      hasMore = false
    }
  }

  console.log(`[API] *** FINAL TOTAL: ${allUsers.length} users across ${pageCount} pages ***`)

  // Store in cache
  cache.data = allUsers
  cache.timestamp = Date.now()
  console.log('[API] Data cached for 15 minutes')

  return allUsers
}
