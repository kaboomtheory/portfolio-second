import type { H3Event } from 'h3'
import { getRequestIP } from 'h3'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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

function getSecurityConfig(event: H3Event): SecurityConfig {
  const config = useRuntimeConfig(event)

  return {
    turnstileSecretKey: String(config.turnstileSecretKey || ''),
    turnstileSiteKey: String(config.public?.turnstileSiteKey || ''),
    upstashUrl: String(config.upstashRedisRestUrl || ''),
    upstashToken: String(config.upstashRedisRestToken || ''),
  }
}

function isSecurityConfigComplete(config: SecurityConfig): boolean {
  return Boolean(
    config.turnstileSecretKey
      && config.turnstileSiteKey
      && config.upstashUrl
      && config.upstashToken,
  )
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** Production: all four must be set or callers get 503. Dev: missing vars skip Turnstile + Redis (local convenience). */
function assertProductionSecurityComplete(event: H3Event, config: SecurityConfig): void {
  if (isSecurityConfigComplete(config)) return
  if (isProduction()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Security services are not configured',
    })
  }
}

function assertSecurityConfig(event: H3Event): SecurityConfig {
  const config = getSecurityConfig(event)
  assertProductionSecurityComplete(event, config)
  return config
}

function getLimiters(config: SecurityConfig): RateLimiterSet {
  const cacheKey = `${config.upstashUrl}::${config.upstashToken}`

  if (cachedLimiters && cachedRedisKey === cacheKey) {
    return cachedLimiters
  }

  const redis = new Redis({
    url: config.upstashUrl,
    token: config.upstashToken,
  })

  cachedRedisKey = cacheKey
  cachedLimiters = {
    contactBurst: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'portfolio-contact-burst',
    }),
    contactDaily: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(20, '1 d'),
      prefix: 'portfolio-contact-daily',
    }),
    unlockBurst: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      prefix: 'portfolio-project-unlock-burst',
    }),
    unlockDaily: new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(25, '1 d'),
      prefix: 'portfolio-project-unlock-daily',
    }),
  }

  return cachedLimiters
}

export function getClientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export async function verifyTurnstileToken(
  event: H3Event,
  token: string | null | undefined,
): Promise<void> {
  const config = useRuntimeConfig(event)
  if (config.public?.turnstileDisabled) return

  const { turnstileSecretKey } = assertSecurityConfig(event)
  const trimmedToken = typeof token === 'string' ? token.trim() : ''

  if (!trimmedToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Verification failed',
    })
  }

  const body = new URLSearchParams({
    secret: turnstileSecretKey,
    response: trimmedToken,
    remoteip: getClientIp(event),
  })

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  )

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Verification service failed',
    })
  }

  const result = await response.json() as { success?: boolean }

  if (!result.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Verification failed',
    })
  }
}

export async function assertRequestWithinRateLimit(
  event: H3Event,
  scope: LimitScope,
  extraKey: string = '',
): Promise<void> {
  const config = assertSecurityConfig(event)

  if (!isSecurityConfigComplete(config)) {
    return
  }

  const ip = getClientIp(event)
  const limiters = getLimiters(config)

  const checks = scope === 'contact'
    ? [
        limiters.contactBurst.limit(`ip:${ip}`),
        limiters.contactDaily.limit(`ip:${ip}`),
      ]
    : [
        limiters.unlockBurst.limit(`ip:${ip}:slug:${extraKey}`),
        limiters.unlockDaily.limit(`ip:${ip}`),
      ]

  const results = await Promise.all(checks)

  if (results.some((result) => !result.success)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
    })
  }
}
