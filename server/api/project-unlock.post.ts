import { getCookie, getRequestIP, readBody, setCookie } from 'h3'
import { sanityQuery } from '../utils/sanityFetch'
import {
  ACCESS_COOKIE_NAME,
  constantTimeEqual,
  signAccessToken,
  verifyAccessToken,
} from '../utils/projectAccess'

// Simple in-memory rate limiter (best-effort; resets on cold start).
// For production behind multiple instances, front with a WAF/edge rule.
const attempts = new Map<string, { count: number; reset: number }>()
const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 10

function rateLimit(ip: string): void {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || rec.reset <= now) {
    attempts.set(ip, { count: 1, reset: now + WINDOW_MS })
    return
  }
  rec.count++
  if (rec.count > MAX_ATTEMPTS) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts' })
  }
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  rateLimit(ip)

  const body = await readBody<{ slug?: unknown; password?: unknown }>(event)
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!slug || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug or password' })
  }

  // Look up the expected password server-side. Uses SANITY_READ_TOKEN
  // when provided so the password field can live in a private dataset
  // or behind a dataset role that is not public.
  const row = await sanityQuery<{ password?: string; protected?: boolean } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ password, protected }`,
    { params: { slug }, useToken: true },
  )

  if (!row || !row.protected || !row.password) {
    // Don't disclose whether the project exists or is unprotected —
    // treat all of these as a failed unlock.
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!constantTimeEqual(password, row.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const existing = verifyAccessToken(getCookie(event, ACCESS_COOKIE_NAME))
  const nextSlugs = Array.from(new Set([...existing, slug]))
  const token = signAccessToken(nextSlugs)

  setCookie(event, ACCESS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { ok: true, slug }
})
