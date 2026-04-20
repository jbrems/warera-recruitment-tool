export async function GET(request) {
  try {
    const subreddit = request.nextUrl.searchParams.get('subreddit') || 'WareraBelgium'
    const limit = parseInt(request.nextUrl.searchParams.get('limit')) || 100

    console.log(`[API] Fetching Reddit posts from r/${subreddit}...`)

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
          'User-Agent': 'vercel:Warera recruitment tool:v1.0.0 (by /u/jbrms)'
        }
      })

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.data || !data.data.children) {
        console.warn('[API] No children in Reddit response')
        break
      }

      const posts = data.data.children.map((post) => ({
        id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        created_utc: post.data.created_utc,
        ups: post.data.ups,
        view_count: post.data.ups || 0, // Use upvotes as engagement metric
        num_comments: post.data.num_comments,
        score: post.data.score,
        permalink: post.data.permalink
      }))

      allPosts.push(...posts)

      // Check if we can fetch more
      after = data.data.after
      if (!after) {
        console.log(`[API] Fetched all ${allPosts.length} posts (no more data available)`)
        break
      }

      // Small delay between requests to be respectful to Reddit
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`[API] Successfully fetched ${allPosts.length} posts from r/${subreddit}`)

    return Response.json({
      success: true,
      data: allPosts,
      count: allPosts.length
    })
  } catch (error) {
    console.error('[API] Error fetching Reddit posts:', error.message)
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
