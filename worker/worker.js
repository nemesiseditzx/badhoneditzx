/**
 * Cloudflare Worker: secure YouTube channel statistics proxy.
 * Required secret: YOUTUBE_API_KEY
 * Optional variable: YOUTUBE_HANDLE (default: @badhoneditzx)
 * Deploy with Wrangler; never put the API key in index.html or app.js.
 */
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const corsOrigin = allowedOrigin === '*' || origin === allowedOrigin ? origin : allowedOrigin;
    const headers = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json; charset=utf-8',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'GET') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    if (!env.YOUTUBE_API_KEY) return new Response(JSON.stringify({ error: 'YOUTUBE_API_KEY secret is not configured' }), { status: 503, headers });

    const cache = caches.default;
    const cacheKey = new Request(new URL('/youtube-channel-stats', request.url).toString(), { method: 'GET' });
    const cached = await cache.match(cacheKey);
    if (cached) {
      const body = await cached.text();
      return new Response(body, { status: 200, headers });
    }

    try {
      const handle = env.YOUTUBE_HANDLE || '@badhoneditzx';
      const apiUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
      apiUrl.searchParams.set('part', 'statistics');
      apiUrl.searchParams.set('forHandle', handle);
      apiUrl.searchParams.set('key', env.YOUTUBE_API_KEY);
      const upstream = await fetch(apiUrl.toString());
      const payload = await upstream.json();
      if (!upstream.ok) {
        return new Response(JSON.stringify({ error: 'YouTube API request failed', details: payload?.error?.message || 'Unknown API error' }), { status: 502, headers });
      }
      const stats = payload?.items?.[0]?.statistics;
      if (!stats) return new Response(JSON.stringify({ error: 'Channel not found. Check YOUTUBE_HANDLE.' }), { status: 404, headers });
      const result = JSON.stringify({
        subscriberCount: stats.subscriberCount ? Number(stats.subscriberCount) : null,
        viewCount: stats.viewCount ? Number(stats.viewCount) : 0,
        videoCount: stats.videoCount ? Number(stats.videoCount) : 0,
        updatedAt: new Date().toISOString(),
        source: 'YouTube Data API v3'
      });
      const responseToCache = new Response(result, { status: 200, headers: { ...headers, 'Cache-Control': 'public, max-age=300' } });
      ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));
      return responseToCache;
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Unable to retrieve channel statistics' }), { status: 500, headers });
    }
  }
};
