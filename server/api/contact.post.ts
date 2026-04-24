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

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
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
  const to = config.contactToEmail
  const from = config.contactFromEmail

  if (!apiKey || !to || !from) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact form is not configured',
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
    let detail = ''
    try {
      detail = JSON.stringify(await res.json())
    } catch {
      detail = await res.text()
    }
    console.error('[contact] Resend failed', res.status, detail)
    throw createError({ statusCode: 502, statusMessage: 'Failed to send message' })
  }

  return { ok: true }
})
