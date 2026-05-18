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

interface TurnstileVerifyResult {
  success?: boolean
  'error-codes'?: string[]
}

function turnstileErrorMessage(codes: string[]): string {
  if (codes.includes('invalid-input-secret')) {
    return 'Turnstile secret key is invalid. In Cloudflare Turnstile, copy the secret for the same widget as NUXT_PUBLIC_TURNSTILE_SITE_KEY into TURNSTILE_SECRET_KEY in .env, then restart npm run dev.'
  }
  if (codes.includes('timeout-or-duplicate')) {
    return 'Verification expired. Complete the challenge again and submit.'
  }
  if (codes.includes('invalid-input-response')) {
    return 'Verification failed. Complete the challenge again and submit.'
  }
  return 'Verification failed'
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

  let response: Response
  try {
    response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    )
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Verification service unreachable',
    })
  }

  let result: TurnstileVerifyResult = {}
  try {
    result = await response.json() as TurnstileVerifyResult
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Verification service returned an invalid response',
    })
  }

  const codes = result['error-codes'] ?? []

  if (!response.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[turnstile] siteverify HTTP', response.status, codes)
    }
    throw createError({
      statusCode: codes.includes('invalid-input-secret') ? 503 : 502,
      statusMessage: turnstileErrorMessage(codes),
    })
  }

  if (!result.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[turnstile] siteverify rejected token', codes)
    }
    throw createError({
      statusCode: 403,
      statusMessage: turnstileErrorMessage(codes),
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
