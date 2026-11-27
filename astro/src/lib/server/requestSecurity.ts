/**
 * Turnstile verification and Upstash rate limits, ported from
 * server/utils/requestSecurity.ts. Limits and Redis key prefixes are identical
 * to the Nuxt site, so counters carry over when traffic switches.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { HttpError } from './http'
import { isProduction, serverEnv } from './env'

type LimitScope = 'contact' | 'project-unlock'

interface SecurityConfig {
  turnstileSecretKey: string
  turnstileSiteKey: string
  upstashUrl: string
  upstashToken: string
}

interface RateLimiterSet {
  contactBurst: Ratelimit
  contactDaily: Ratelimit
  unlockBurst: Ratelimit
  unlockDaily: Ratelimit
}

let cachedRedisKey = ''
let cachedLimiters: RateLimiterSet | null = null

const turnstileDisabled = import.meta.env.PUBLIC_TURNSTILE_DISABLED === 'true'

function getSecurityConfig(): SecurityConfig {
  return {
    turnstileSecretKey: serverEnv('TURNSTILE_SECRET_KEY', 'NUXT_TURNSTILE_SECRET_KEY'),
    turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
    upstashUrl: serverEnv('UPSTASH_REDIS_REST_URL', 'NUXT_UPSTASH_REDIS_REST_URL'),
    upstashToken: serverEnv('UPSTASH_REDIS_REST_TOKEN', 'NUXT_UPSTASH_REDIS_REST_TOKEN'),
  }
}

function isComplete(config: SecurityConfig): boolean {
  return Boolean(config.turnstileSecretKey && config.turnstileSiteKey && config.upstashUrl && config.upstashToken)
}

/** Production: all four must be set or callers get 503. Dev: missing vars skip Turnstile and Redis. */
function assertSecurityConfig(): SecurityConfig {
  const config = getSecurityConfig()
  if (!isComplete(config) && isProduction) {
    throw new HttpError(503, 'Security services are not configured')
  }
  return config
}

function getLimiters(config: SecurityConfig): RateLimiterSet {
  const cacheKey = `${config.upstashUrl}::${config.upstashToken}`
  if (cachedLimiters && cachedRedisKey === cacheKey) return cachedLimiters

  const redis = new Redis({ url: config.upstashUrl, token: config.upstashToken })
  cachedRedisKey = cacheKey
  cachedLimiters = {
    contactBurst: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'portfolio-contact-burst' }),
    contactDaily: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(20, '1 d'), prefix: 'portfolio-contact-daily' }),
    unlockBurst: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'portfolio-project-unlock-burst' }),
    unlockDaily: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(25, '1 d'), prefix: 'portfolio-project-unlock-daily' }),
  }
  return cachedLimiters
}

function turnstileErrorMessage(codes: string[]): string {
  if (codes.includes('invalid-input-secret')) {
    return 'Turnstile secret key is invalid. In Cloudflare Turnstile, copy the secret for the same widget as PUBLIC_TURNSTILE_SITE_KEY into TURNSTILE_SECRET_KEY, then restart the server.'
  }
  if (codes.includes('timeout-or-duplicate')) {
    return 'Verification expired. Complete the challenge again and submit.'
  }
  if (codes.includes('invalid-input-response')) {
    return 'Verification failed. Complete the challenge again and submit.'
  }
  return 'Verification failed'
}

export async function verifyTurnstileToken(token: string | null | undefined, clientIp: string): Promise<void> {
  if (turnstileDisabled) return

  const { turnstileSecretKey } = assertSecurityConfig()
  // Dev without keys: skip, same as the Nuxt site.
  if (!turnstileSecretKey) return

  const trimmed = typeof token === 'string' ? token.trim() : ''
  if (!trimmed) throw new HttpError(403, 'Verification failed')

  const body = new URLSearchParams({ secret: turnstileSecretKey, response: trimmed, remoteip: clientIp })

  let response: Response
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  } catch {
    throw new HttpError(502, 'Verification service unreachable')
  }

  let result: { success?: boolean; 'error-codes'?: string[] }
  try {
    result = await response.json()
  } catch {
    throw new HttpError(502, 'Verification service returned an invalid response')
  }

  const codes = result['error-codes'] ?? []
  if (!response.ok) {
    if (!isProduction) console.error('[turnstile] siteverify HTTP', response.status, codes)
    throw new HttpError(codes.includes('invalid-input-secret') ? 503 : 502, turnstileErrorMessage(codes))
  }
  if (!result.success) {
    if (!isProduction) console.error('[turnstile] siteverify rejected token', codes)
    throw new HttpError(403, turnstileErrorMessage(codes))
  }
}

export async function assertRequestWithinRateLimit(scope: LimitScope, clientIp: string, extraKey = ''): Promise<void> {
  const config = assertSecurityConfig()
  if (!isComplete(config)) return

  const ip = clientIp || 'unknown'
  const limiters = getLimiters(config)
  const checks = scope === 'contact'
    ? [limiters.contactBurst.limit(`ip:${ip}`), limiters.contactDaily.limit(`ip:${ip}`)]
    : [limiters.unlockBurst.limit(`ip:${ip}:slug:${extraKey}`), limiters.unlockDaily.limit(`ip:${ip}`)]

  const results = await Promise.all(checks)
  if (results.some((r) => !r.success)) {
    throw new HttpError(429, 'Too many requests')
  }
}

/** `Astro.clientAddress` throws when the adapter cannot tell; treat that as unknown. */
export function safeClientAddress(getAddress: () => string): string {
  try {
    return getAddress() || 'unknown'
  } catch {
    return 'unknown'
  }
}
