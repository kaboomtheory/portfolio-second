/**
 * POST /api/project-unlock. Checks a case study password against the bcrypt
 * hash in Sanity and adds the slug to the signed `project_access` cookie.
 * Ported from server/api/project-unlock.post.ts.
 */
import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { sanityQuery } from '~/lib/sanity'
import { HttpError, handleApi, json, readJsonObject } from '~/lib/server/http'
import { isProduction } from '~/lib/server/env'
import { ACCESS_COOKIE_NAME, ACCESS_TTL_SECONDS, signAccessToken, verifyAccessToken } from '~/lib/server/accessToken'
import { assertRequestWithinRateLimit, safeClientAddress, verifyTurnstileToken } from '~/lib/server/requestSecurity'

export const prerender = false

const passwordHashQuery = `*[_type == "project" && slug.current == $slug][0]{ passwordHash, protected }`

export const POST: APIRoute = ({ request, cookies, clientAddress }) =>
  handleApi(async () => {
    const body = await readJsonObject(request)
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''

    if (!slug || !password) throw new HttpError(400, 'Missing slug or password')

    const ip = safeClientAddress(() => clientAddress)
    await verifyTurnstileToken(turnstileToken, ip)
    await assertRequestWithinRateLimit('project-unlock', ip, slug)

    // Uses SANITY_READ_TOKEN so the hash never goes through the public CDN.
    const row = await sanityQuery<{ passwordHash?: string; protected?: boolean } | null>(
      passwordHashQuery,
      { slug },
      { useToken: true },
    )

    // Same 401 whether the project is missing, unprotected or the password is wrong.
    if (!row?.protected || !row.passwordHash) throw new HttpError(401, 'Invalid credentials')
    if (!(await bcrypt.compare(password, row.passwordHash))) throw new HttpError(401, 'Invalid credentials')

    const existing = verifyAccessToken(cookies.get(ACCESS_COOKIE_NAME)?.value)
    cookies.set(ACCESS_COOKIE_NAME, signAccessToken([...existing, slug]), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TTL_SECONDS,
    })

    return json({ ok: true, slug })
  })
