import { randomBytes } from 'node:crypto'
import { getRequestURL, setResponseHeader } from 'h3'

function buildContentSecurityPolicy(nonce: string, relaxedStyleRoute: boolean): string {
  const styleSrc = relaxedStyleRoute
    ? [`'self'`, `'nonce-${nonce}'`, `'unsafe-inline'`]
    : [`'self'`, `'nonce-${nonce}'`]
  const styleAttr = relaxedStyleRoute ? `'unsafe-inline'` : `'none'`

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'nonce-" + nonce + "' https://challenges.cloudflare.com",
    "script-src-attr 'none'",
    `style-src ${styleSrc.join(' ')}`,
    `style-src-attr ${styleAttr}`,
    "img-src 'self' data: blob: https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com",
    "font-src 'self' data: blob:",
    "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://challenges.cloudflare.com",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://challenges.cloudflare.com",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
  ].join('; ')
}

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname
  const accept = event.node.req.headers.accept || ''
  const isHtmlRequest = accept.includes('text/html')

  setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'X-Frame-Options', 'DENY')
  setResponseHeader(
    event,
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )

  if (process.env.NODE_ENV !== 'production') {
    return
  }

  setResponseHeader(
    event,
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains',
  )

  if (!isHtmlRequest) {
    return
  }

  const nonce = randomBytes(16).toString('base64')
  event.context.cspNonce = nonce

  const relaxedStyleRoute = pathname === '/theme-lab'

  setResponseHeader(
    event,
    'Content-Security-Policy',
    buildContentSecurityPolicy(nonce, relaxedStyleRoute),
  )
})
