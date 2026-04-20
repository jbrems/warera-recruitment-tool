import { format, startOfDay, addDays, startOfMonth, endOfMonth, addMonths } from 'date-fns'

/**
 * Fetches posts from a Reddit subreddit directly from Reddit's API
 * @param {string} subreddit - The subreddit name (e.g., 'WareraBelgium')
 * @param {number} limit - Number of posts to fetch per request (default: 100, max: 100)
 * @returns {Promise<Array>} Array of posts with created date and upvotes
 */
export async function fetchRedditPosts(subreddit = 'WareraBelgium', limit = 100) {
  try {
    console.log(`[Client] Fetching Reddit posts from r/${subreddit}...`)

    const allPosts = []
    let after = null

    // Fetch posts in batches (up to 5 batches)
    for (let i = 0; i < 5; i++) {
      const url = new URL(`https://www.reddit.com/r/${subreddit}/new.json`)
      url.searchParams.append('limit', limit.toString())
      if (after) {
        url.searchParams.append('after', after)
      }

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'WarereaBelgium Analytics (warera-recruitment-tool, v1.0)'
        }
      })

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.data || !data.data.children) {
        console.warn('[Client] No children in Reddit response')
        break
      }

      const posts = data.data.children.map((post) => ({
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        created: new Date(post.data.created_utc * 1000), // Convert Unix timestamp to Date
        views: post.data.ups || 0,
        comments: post.data.num_comments,
        score: post.data.score,
        url: `https://reddit.com${post.data.permalink}`
      }))

      allPosts.push(...posts)

      // Check if we can fetch more
      after = data.data.after
      if (!after) {
        console.log(`[Client] Fetched all ${allPosts.length} posts (no more data available)`)
        break
      }

      // Small delay between requests to be respectful to Reddit
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`[Client] Successfully fetched ${allPosts.length} posts from r/${subreddit}`)
    return allPosts
  } catch (error) {
    console.error('[Client] Error fetching Reddit posts:', error)
    throw error
  }
}

/**
 * Groups Reddit posts by date, counting posts and summing views for each day
 * @param {Array} posts - Array of Reddit posts
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} Array of objects with date, displayDate, postCount, and totalViews
 */
export function groupRedditPostsByDay(posts, startDate, endDate) {
  const grouped = {}

  // Initialize all days in range with 0 posts and 0 views
  const current = new Date(startDate)
  current.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  while (current <= end) {
    const dateKey = format(current, 'yyyy-MM-dd')
    grouped[dateKey] = { postCount: 0, totalViews: 0, date: dateKey, displayDate: format(current, 'MMM dd'), timestamp: new Date(current).getTime() }
    current.setDate(current.getDate() + 1)
  }

  // Group posts by day
  posts.forEach((post) => {
    const dateKey = format(post.created, 'yyyy-MM-dd')
    if (grouped[dateKey]) {
      grouped[dateKey].postCount += 1
      grouped[dateKey].totalViews += post.views
    }
  })

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Groups Reddit posts by hour
 * @param {Array} posts - Array of Reddit posts
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} Array of objects with date, displayDate, postCount, and totalViews grouped by hour
 */
export function groupRedditPostsByHour(posts, startDate, endDate) {
  const grouped = {}

  // Initialize all hours in range
  const current = new Date(startDate)
  current.setMinutes(0, 0, 0)
  while (current <= endDate) {
    const dateKey = format(current, 'yyyy-MM-dd HH:00')
    grouped[dateKey] = { postCount: 0, totalViews: 0, date: dateKey, displayDate: format(current, 'HH:00'), timestamp: new Date(current).getTime() }
    current.setHours(current.getHours() + 1)
  }

  // Group posts by hour
  posts.forEach((post) => {
    const dateKey = format(post.created, 'yyyy-MM-dd HH:00')
    if (grouped[dateKey]) {
      grouped[dateKey].postCount += 1
      grouped[dateKey].totalViews += post.views
    }
  })

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Groups Reddit posts by month
 * @param {Array} posts - Array of Reddit posts
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} Array of objects with date, displayDate, postCount, and totalViews grouped by month
 */
export function groupRedditPostsByMonth(posts, startDate, endDate) {
  const grouped = {}

  // Initialize all months in range
  const current = startOfMonth(startDate)
  const end = endOfMonth(endDate)

  let monthIter = new Date(current)
  while (monthIter <= end) {
    const dateKey = format(monthIter, 'yyyy-MM')
    grouped[dateKey] = { postCount: 0, totalViews: 0, date: dateKey, displayDate: format(monthIter, 'MMM yy'), timestamp: new Date(monthIter).getTime() }
    monthIter = new Date(monthIter.getFullYear(), monthIter.getMonth() + 1, 1)
  }

  // Group posts by month
  posts.forEach((post) => {
    const dateKey = format(post.created, 'yyyy-MM')
    if (grouped[dateKey]) {
      grouped[dateKey].postCount += 1
      grouped[dateKey].totalViews += post.views
    }
  })

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
}
