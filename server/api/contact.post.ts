import { readBody } from 'h3'
import {
  assertRequestWithinRateLimit,
  verifyTurnstileToken,
} from '../utils/requestSecurity'

const MAX_NAME = 120
const MAX_EMAIL = 254
const MAX_MESSAGE = 10_000
const MAX_SUBJECT = 200

/** Pragmatic check — not exhaustive RFC validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FROM_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const FROM_WITH_NAME_RE = /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

/** Strip wrapping quotes Vercel/env files sometimes add around display-name addresses. */
function normalizeFromAddress(raw: string): string {
  let value = raw.trim()
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith('\'') && value.endsWith('\''))
  ) {
    value = value.slice(1, -1).trim()
  }
  return value
}

function isValidResendFrom(value: string): boolean {
  return FROM_RE.test(value) || FROM_WITH_NAME_RE.test(value)
}

interface ResendErrorBody {
  message?: string
  name?: string
}

function trimResendMessage(message: string, max = 240): string {
  const trimmed = message.trim()
  if (!trimmed) return ''
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed
}

function mapResendFailure(status: number, body: ResendErrorBody): { statusCode: number; statusMessage: string } {
  const message = String(body.message || '')
  const lower = message.toLowerCase()

  if (status === 403 && (lower.includes('domain') || lower.includes('verify'))) {
    return {
      statusCode: 503,
      statusMessage: 'Sender domain is not verified in Resend yet. Open Resend → Domains and wait until bryanxmendez.com shows Verified.',
    }
  }

  if (status === 422 && (lower.includes('from') || lower.includes('domain') || lower.includes('verify'))) {
    return {
      statusCode: 503,
      statusMessage:
        'Resend rejected the sender address. In Vercel, set NUXT_CONTACT_FROM_EMAIL to contact@bryanxmendez.com (domain must be Verified in Resend).',
    }
  }

  if (status === 401 || status === 403) {
    return {
      statusCode: 503,
      statusMessage: 'Email service rejected the request. Check NUXT_RESEND_API_KEY and that it belongs to the same Resend account as bryanxmendez.com.',
    }
  }

  if (status === 429) {
    return {
      statusCode: 429,
      statusMessage: 'Too many emails sent. Please try again later.',
    }
  }

  const detail = trimResendMessage(message)
  if (detail) {
    return { statusCode: 503, statusMessage: detail }
  }

  return { statusCode: 502, statusMessage: 'Failed to send message' }
}

export default defineEventHandler(async (event) => {
  let raw: Record<string, unknown>
  try {
    raw = (await readBody(event)) as Record<string, unknown>
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  if (!raw || typeof raw !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  // Honeypot — bots often fill hidden fields; pretend success (before config / rate limit).
  const hp = str(raw.website)
  if (hp.length > 0) {
    return { ok: true }
  }

  const name = str(raw.name)
  const email = str(raw.email).toLowerCase()
  const message = str(raw.message)
  const subject = str(raw.subject)
  const turnstileToken = str(raw.turnstileToken)

  if (!name || name.length > MAX_NAME) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid name' })
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email' })
  }
  if (!message || message.length > MAX_MESSAGE) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid message' })
  }
  if (subject.length > MAX_SUBJECT) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid subject' })
  }

  await verifyTurnstileToken(event, turnstileToken)
  await assertRequestWithinRateLimit(event, 'contact')

  const config = useRuntimeConfig(event)
  const apiKey = config.resendApiKey
  const to = str(config.contactToEmail)
  const from = normalizeFromAddress(str(config.contactFromEmail))

  if (!apiKey || !to || !from) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact form is not configured',
    })
  }

  if (!EMAIL_RE.test(to)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact inbox email is invalid. Check NUXT_CONTACT_TO_EMAIL.',
    })
  }

  if (!isValidResendFrom(from)) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Sender address is invalid. Use contact@bryanxmendez.com or "Portfolio <contact@bryanxmendez.com>".',
    })
  }

  const subjectLine = subject
    ? `Portfolio: ${subject}`
    : `Portfolio contact from ${name}`

  const text = [`Name: ${name}`, `Reply-To address: ${email}`, '', message].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: subjectLine,
      text,
    }),
  })

  if (!res.ok) {
    let body: ResendErrorBody = {}
    try {
      body = (await res.json()) as ResendErrorBody
    } catch {
      try {
        body = { message: await res.text() }
      } catch {
        body = {}
      }
    }
    console.error('[contact] Resend failed', res.status, JSON.stringify(body))
    const mapped = mapResendFailure(res.status, body)
    throw createError({
      statusCode: mapped.statusCode,
      statusMessage: mapped.statusMessage,
    })
  }

  return { ok: true }
})
