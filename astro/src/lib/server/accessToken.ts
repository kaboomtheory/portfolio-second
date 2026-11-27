/**
 * Signed `project_access` cookie, ported from server/utils/projectAccess.ts.
 * Same name, payload and HMAC format as the Nuxt site, so a cookie set there
 * keeps working here as long as PROJECT_UNLOCK_SECRET is unchanged.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { HttpError } from './http'
import { isProduction, serverEnv } from './env'

export const ACCESS_COOKIE_NAME = 'project_access'
export const ACCESS_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

interface AccessPayload {
  slugs: string[]
  exp: number
}

/** Production needs a real secret (16+ chars). Dev falls back so local unlocks work. */
function getSecret(): string {
  const secret = serverEnv('PROJECT_UNLOCK_SECRET')
  if (secret.length >= 16) return secret
  if (isProduction) {
    throw new HttpError(500, 'PROJECT_UNLOCK_SECRET env var is required in production (min 16 chars).')
  }
  return 'dev-only-insecure-change-me-please'
}

function sign(body: string): string {
  return createHmac('sha256', getSecret()).update(body).digest('base64url')
}

export function signAccessToken(slugs: string[], ttlMs: number = ACCESS_TTL_SECONDS * 1000): string {
  const unique = Array.from(new Set(slugs.filter((s) => typeof s === 'string' && s.length > 0)))
  const payload: AccessPayload = { slugs: unique, exp: Date.now() + ttlMs }
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${sign(body)}`
}

/** Returns the unlocked slugs, or [] for a missing, tampered or expired token. */
export function verifyAccessToken(token: string | null | undefined): string[] {
  if (!token || typeof token !== 'string') return []
  const parts = token.split('.')
  if (parts.length !== 2) return []
  const [body, sig] = parts
  if (!body || !sig) return []

  let expected: string
  try {
    expected = sign(body)
  } catch {
    return []
  }

  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return []

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<AccessPayload>
    if (!parsed || typeof parsed.exp !== 'number' || Date.now() > parsed.exp) return []
    if (!Array.isArray(parsed.slugs)) return []
    return parsed.slugs.filter((s): s is string => typeof s === 'string')
  } catch {
    return []
  }
}
