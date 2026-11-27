/**
 * POST /api/contact → Resend. Ported from server/api/contact.post.ts with the
 * same request body, limits and error messages.
 */
import type { APIRoute } from 'astro'
import { HttpError, handleApi, json, readJsonObject } from '~/lib/server/http'
import { serverEnv } from '~/lib/server/env'
import { assertRequestWithinRateLimit, safeClientAddress, verifyTurnstileToken } from '~/lib/server/requestSecurity'

export const prerender = false

const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_MESSAGE = 10_000
const MAX_SUBJECT = 200

/** Pragmatic check, not exhaustive RFC validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FROM_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const FROM_WITH_NAME_RE = /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

/** Strip wrapping quotes Vercel/env files sometimes add around display-name addresses. */
function normalizeFromAddress(raw: string): string {
  let value = raw.trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim()
  }
  return value
}

interface ResendErrorBody {
  message?: string
  name?: string
}

function mapResendFailure(status: number, body: ResendErrorBody): HttpError {
  const message = String(body.message || '')
  const lower = message.toLowerCase()

  if (status === 403 && (lower.includes('domain') || lower.includes('verify'))) {
    return new HttpError(503, 'Sender domain is not verified in Resend yet. Open Resend → Domains and wait until bryanxmendez.com shows Verified.')
  }
  if (status === 422 && (lower.includes('from') || lower.includes('domain') || lower.includes('verify'))) {
    return new HttpError(503, 'Resend rejected the sender address. Set CONTACT_FROM_EMAIL to contact@bryanxmendez.com (domain must be Verified in Resend).')
  }
  if (status === 401 || status === 403) {
    return new HttpError(503, 'Email service rejected the request. Check RESEND_API_KEY and that it belongs to the same Resend account as bryanxmendez.com.')
  }
  if (status === 429) {
    return new HttpError(429, 'Too many emails sent. Please try again later.')
  }
  const detail = message.trim()
  if (detail) return new HttpError(503, detail.length > 240 ? `${detail.slice(0, 240)}…` : detail)
  return new HttpError(502, 'Failed to send message')
}

export const POST: APIRoute = ({ request, clientAddress }) =>
  handleApi(async () => {
    const raw = await readJsonObject(request)

    // Honeypot: bots often fill hidden fields. Pretend success before any config or rate limit work.
    if (str(raw.website).length > 0) return json({ ok: true })

    const name = str(raw.name)
    const email = str(raw.email).toLowerCase()
    const message = str(raw.message)
    const subject = str(raw.subject)

    if (!name || name.length > MAX_NAME) throw new HttpError(400, 'Invalid name')
    if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) throw new HttpError(400, 'Invalid email')
    if (!message || message.length > MAX_MESSAGE) throw new HttpError(400, 'Invalid message')
    if (subject.length > MAX_SUBJECT) throw new HttpError(400, 'Invalid subject')

    const ip = safeClientAddress(() => clientAddress)
    await verifyTurnstileToken(str(raw.turnstileToken), ip)
    await assertRequestWithinRateLimit('contact', ip)

    const apiKey = serverEnv('RESEND_API_KEY', 'NUXT_RESEND_API_KEY')
    const to = serverEnv('CONTACT_TO_EMAIL', 'NUXT_CONTACT_TO_EMAIL')
    const from = normalizeFromAddress(serverEnv('CONTACT_FROM_EMAIL', 'NUXT_CONTACT_FROM_EMAIL'))

    if (!apiKey || !to || !from) throw new HttpError(503, 'Contact form is not configured')
    if (!EMAIL_RE.test(to)) throw new HttpError(503, 'Contact inbox email is invalid. Check CONTACT_TO_EMAIL.')
    if (!FROM_RE.test(from) && !FROM_WITH_NAME_RE.test(from)) {
      throw new HttpError(503, 'Sender address is invalid. Use contact@bryanxmendez.com or "Portfolio <contact@bryanxmendez.com>".')
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subject ? `Portfolio: ${subject}` : `Portfolio contact from ${name}`,
        text: [`Name: ${name}`, `Reply-To address: ${email}`, '', message].join('\n'),
      }),
    })

    if (!res.ok) {
      let body: ResendErrorBody = {}
      try {
        body = (await res.json()) as ResendErrorBody
      } catch {
        body = {}
      }
      console.error('[contact] Resend failed', res.status, JSON.stringify(body))
      throw mapResendFailure(res.status, body)
    }

    return json({ ok: true })
  })
