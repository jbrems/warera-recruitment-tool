export async function GET(request) {
  try {
    // Vercel provides x-vercel-ip-country header
    const vercelCountry = request.headers.get('x-vercel-ip-country')
    if (vercelCountry && vercelCountry !== 'XX') {
      console.log('[API Route] Detected country from x-vercel-ip-country:', vercelCountry)
      return Response.json({
        success: true,
        countryCode: vercelCountry
      })
    }

    // Try to get from Cloudflare header (CF-IPCountry) as fallback
    const cfCountry = request.headers.get('cf-ipcountry')
    if (cfCountry && cfCountry !== 'XX') {
      console.log('[API Route] Detected country from CF-IPCountry:', cfCountry)
      return Response.json({
        success: true,
        countryCode: cfCountry
      })
    }

    // Try to get from other common CDN headers
    const xCountry = request.headers.get('x-country')
    if (xCountry) {
      console.log('[API Route] Detected country from x-country:', xCountry)
      return Response.json({
        success: true,
        countryCode: xCountry
      })
    }

    console.log('[API Route] Could not detect country from headers')
    return Response.json({
      success: false,
      error: 'Country could not be detected'
    }, { status: 400 })
  } catch (error) {
    console.error('[API Route] Error detecting country:', error.message)
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
