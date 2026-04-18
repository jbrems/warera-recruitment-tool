import axios from 'axios'

const WARERA_API_URL = 'https://api2.warera.io/trpc/user.getUsersByCountry'
const COUNTRY_ID = '6813b6d446e731854c7ac7a4' // Belgium

// Cache storage - lives indefinitely
const cache = {
  data: null,
  lastUpdateDate: null
}

export const getLastUpdateDate = () => {
  return cache.lastUpdateDate
}

export const setLastUpdateDate = (date) => {
  cache.lastUpdateDate = date
  console.log('[API] Last update date set to:', new Date(date).toISOString())
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

// Fetch all users with pagination, optionally stopping at a cutoff date
export const fetchAllUsers = async (cutoffDate = null) => {
  // Return cached data if it exists and no cutoff date is specified
  if (cache.data !== null && cutoffDate === null) {
    console.log('[API] Returning cached data with', cache.data.length, 'users')
    return cache.data
  }

  console.log('[API] Fetching user data...')
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

      if (result.items.length === 0) {
        hasMore = false
        console.log('[API] No more users. Pagination complete.')
      } else {
        // Check for cutoff date
        if (cutoffDate) {
          const cutoffTime = new Date(cutoffDate).getTime()
          const itemsBeforeCutoff = result.items.filter(user => new Date(user.createdAt).getTime() >= cutoffTime)
          const itemsAfterCutoff = result.items.filter(user => new Date(user.createdAt).getTime() < cutoffTime)

          allUsers = [...allUsers, ...itemsBeforeCutoff]
          console.log(`[API] Added ${itemsBeforeCutoff.length} items before cutoff date, total now ${allUsers.length}`)

          if (itemsAfterCutoff.length > 0) {
            hasMore = false
            console.log(`[API] Reached cutoff date. Stopping pagination.`)
          } else {
            cursor = result.nextCursor
            if (!cursor) {
              hasMore = false
              console.log(`[API] No nextCursor. Pagination complete.`)
            }
          }
        } else {
          allUsers = [...allUsers, ...result.items]
          console.log(`[API] After adding page ${pageCount}: total ${allUsers.length} users`)

          cursor = result.nextCursor
          if (!cursor) {
            hasMore = false
            console.log(`[API] No nextCursor. Pagination complete.`)
          }
        }
      }
    } catch (error) {
      console.error('[API] Error fetching users page:', error.message)
      hasMore = false
    }
  }

  console.log(`[API] *** FINAL TOTAL: ${allUsers.length} users across ${pageCount} pages ***`)

  // Update cache with new data
  if (cutoffDate) {
    // Merge new users with existing cache
    if (cache.data) {
      allUsers = [...allUsers, ...cache.data]
      console.log(`[API] Merged with existing cache. Total now: ${allUsers.length} users`)
    }
  }

  cache.data = allUsers
  cache.lastUpdateDate = Date.now()
  console.log('[API] Cache updated and will persist indefinitely')

  return allUsers
}

export const clearCache = () => {
  console.log('[API] Cache cleared manually')
  cache.data = null
  cache.lastUpdateDate = null
}
