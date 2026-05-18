import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

function parseEnv(content) {
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith('\'') && value.endsWith('\''))
    ) {
      value = value.slice(1, -1).trim()
    }
    env[key] = value
  }
  return env
}

function normalizeFrom(raw) {
  let value = raw.trim()
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith('\'') && value.endsWith('\''))
  ) {
    value = value.slice(1, -1).trim()
  }
  return value
}

if (!existsSync(envPath)) {
  console.error('No .env file. Add Resend vars or run: vercel env pull')
  process.exit(1)
}

const env = parseEnv(readFileSync(envPath, 'utf8'))
const apiKey = env.NUXT_RESEND_API_KEY || ''
const to = env.NUXT_CONTACT_TO_EMAIL || ''
const from = normalizeFrom(env.NUXT_CONTACT_FROM_EMAIL || '')

if (!apiKey || !to || !from) {
  console.error('Missing NUXT_RESEND_API_KEY, NUXT_CONTACT_TO_EMAIL, or NUXT_CONTACT_FROM_EMAIL in .env')
  console.error('Run: npm run check:contact')
  process.exit(1)
}

console.log('Sending test email via Resend…')
console.log(`  from: ${from}`)
console.log(`  to:   ${to}`)

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: 'Portfolio contact form test',
    text: 'If you received this, Resend is configured correctly.',
  }),
})

const text = await res.text()
let body
try {
  body = JSON.parse(text)
} catch {
  body = { raw: text }
}

if (!res.ok) {
  console.error(`\nResend returned ${res.status}:`)
  console.error(JSON.stringify(body, null, 2))
  process.exit(1)
}

console.log('\nSuccess:', JSON.stringify(body, null, 2))
console.log('\nCheck your inbox (and spam). Then test the form at /#contact.')
