import axios from 'axios'

const WARERA_API_URL = 'https://api2.warera.io/trpc/user.getUsersByCountry'
const WARERA_COUNTRIES_URL = 'https://api2.warera.io/trpc/country.getAllCountries'
const DEFAULT_COUNTRY_ID = '6813b6d446e731854c7ac7a4' // Belgium

// Cache storage - separate cache per country
const caches = {}

const getCache = (countryId) => {
  if (!caches[countryId]) {
    caches[countryId] = {
      data: null,
      lastUpdateDate: null
    }
  }
  return caches[countryId]
}

export const getLastUpdateDate = (countryId = DEFAULT_COUNTRY_ID) => {
  return getCache(countryId).lastUpdateDate
}

export const setLastUpdateDate = (date, countryId = DEFAULT_COUNTRY_ID) => {
  getCache(countryId).lastUpdateDate = date
  console.log('[API] Last update date set to:', new Date(date).toISOString())
}

// Fetch countries from Warera API
export const fetchCountries = async () => {
  try {
    console.log('[API] Fetching countries...')
    const response = await axios.post(WARERA_COUNTRIES_URL, {})
    const countries = response.data.result.data || []
    console.log(`[API] Successfully fetched ${countries.length} countries`)
    return countries
  } catch (error) {
    console.error('[API] Failed to fetch countries:', error.message)
    throw error
  }
}

// Fetch single page of users from Warera API
export const fetchUsersPage = async (countryId = DEFAULT_COUNTRY_ID, limit = 100, cursor = '') => {
  try {
    console.log(`[API] Fetching users - countryId: ${countryId}, limit: ${limit}, cursor: ${cursor || 'none'}`)
    const response = await axios.post(WARERA_API_URL, {
      countryId,
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
export const fetchAllUsers = async (cutoffDate = null, countryId = DEFAULT_COUNTRY_ID) => {
  console.log('[API] fetchAllUsers called with countryId:', countryId, 'cutoffDate:', cutoffDate ? new Date(cutoffDate).toISOString() : 'none')
  const cache = getCache(countryId)
  // Return cached data if it exists and no cutoff date is specified
  if (cache.data !== null && cutoffDate === null) {
    console.log('[API] Returning cached data with', cache.data.length, 'users for countryId:', countryId)
    return cache.data
  }

  console.log('[API] Fetching fresh user data for countryId:', countryId)
  let allUsers = []
  let cursor = ''
  let hasMore = true
  let pageCount = 0

  while (hasMore) {
    try {
      pageCount++
      console.log(`[API] Fetching page ${pageCount}... (currentCursor: "${cursor}")`)
      const result = await fetchUsersPage(countryId, 100, cursor)

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

export const clearCache = (countryId = DEFAULT_COUNTRY_ID) => {
  console.log('[API] Cache cleared manually for country:', countryId)
  const cache = getCache(countryId)
  cache.data = null
  cache.lastUpdateDate = null
}
