import { compare } from 'bcryptjs'
import { getCookie, readBody, setCookie } from 'h3'
import { sanityQuery } from '../utils/sanityFetch'
import {
  ACCESS_COOKIE_NAME,
  signAccessToken,
  verifyAccessToken,
} from '../utils/projectAccess'
import {
  assertRequestWithinRateLimit,
  verifyTurnstileToken,
} from '../utils/requestSecurity'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug?: unknown; password?: unknown; turnstileToken?: unknown }>(event)
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken : ''

  if (!slug || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug or password' })
  }

  await verifyTurnstileToken(event, turnstileToken)
  await assertRequestWithinRateLimit(event, 'project-unlock', slug)

  // Look up the expected password hash server-side. Uses SANITY_READ_TOKEN
  // when provided so the hash field can live in a private dataset or
  // behind a dataset role that is not public.
  const row = await sanityQuery<{ passwordHash?: string; protected?: boolean } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ passwordHash, protected }`,
    { params: { slug }, useToken: true },
  )

  if (!row || !row.protected || !row.passwordHash) {
    // Don't disclose whether the project exists or is unprotected —
    // treat all of these as a failed unlock.
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const isValid = await compare(password, row.passwordHash)
  if (!isValid) {
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
