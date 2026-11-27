/**
 * Security headers on every on-demand response, ported from
 * server/middleware/securityHeaders.ts.
 *
 * The Content-Security-Policy header itself (script/style hashes, host
 * allowlists, frame-ancestors) is written by Astro from `security.csp` in
 * astro.config.mjs, so it is not set here.
 */
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  const headers = response.headers

  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

  if (import.meta.env.PROD) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
})
