import { createHmac, timingSafeEqual } from 'node:crypto'

export const ACCESS_COOKIE_NAME = 'project_access'
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

interface AccessPayload {
  slugs: string[]
  exp: number
}

// Only throw in production. In dev we fall back to a stable insecure
// secret so local development works without extra setup.
function getSecret(): string {
  const secret = process.env.PROJECT_UNLOCK_SECRET
  if (secret && secret.length >= 16) return secret
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 500,
      statusMessage:
        'PROJECT_UNLOCK_SECRET env var is required in production (min 16 chars).',
    })
  }
  return 'dev-only-insecure-change-me-please'
}

function b64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function b64urlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

export function signAccessToken(
  slugs: string[],
  ttlMs: number = DEFAULT_TTL_MS,
): string {
  const unique = Array.from(new Set(slugs.filter((s) => typeof s === 'string' && s.length > 0)))
  const payload: AccessPayload = { slugs: unique, exp: Date.now() + ttlMs }
  const body = b64urlEncode(JSON.stringify(payload))
  const sig = createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyAccessToken(token: string | null | undefined): string[] {
  if (!token || typeof token !== 'string') return []
  const parts = token.split('.')
  if (parts.length !== 2) return []
  const [body, sig] = parts
  if (!body || !sig) return []

  let expectedSig: string
  try {
    expectedSig = createHmac('sha256', getSecret()).update(body).digest('base64url')
  } catch {
    return []
  }

  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length) return []
  try {
    if (!timingSafeEqual(a, b)) return []
  } catch {
    return []
  }

  try {
    const parsed = JSON.parse(b64urlDecode(body)) as Partial<AccessPayload>
    if (!parsed || typeof parsed.exp !== 'number') return []
    if (Date.now() > parsed.exp) return []
    if (!Array.isArray(parsed.slugs)) return []
    return parsed.slugs.filter((s): s is string => typeof s === 'string')
  } catch {
    return []
  }
}
