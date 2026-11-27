// Allowlist of hosts permitted to be loaded inside a videoEmbed
// iframe. Anything else is dropped so a compromised or misconfigured
// CMS entry can't embed arbitrary sites.
const ALLOWED_EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
])

export function sanitizeEmbedUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return null
    if (!ALLOWED_EMBED_HOSTS.has(parsed.hostname)) return null
    return parsed.toString()
  } catch {
    return null
  }
}
