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
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const checks = [
  {
    key: 'NUXT_RESEND_API_KEY',
    label: 'Resend API key',
    help: 'https://resend.com/api-keys',
  },
  {
    key: 'NUXT_CONTACT_TO_EMAIL',
    label: 'Inbox that receives submissions',
    help: 'Your email address',
  },
  {
    key: 'NUXT_CONTACT_FROM_EMAIL',
    label: 'Verified sender in Resend',
    help: 'e.g. Portfolio <hello@yourdomain.com> — domain must be verified in Resend',
  },
]

const optional = [
  { key: 'NUXT_PUBLIC_TURNSTILE_SITE_KEY', label: 'Turnstile site key' },
  { key: 'TURNSTILE_SECRET_KEY', label: 'Turnstile secret' },
  { key: 'UPSTASH_REDIS_REST_URL', label: 'Upstash REST URL' },
  { key: 'UPSTASH_REDIS_REST_TOKEN', label: 'Upstash REST token' },
]

if (!existsSync(envPath)) {
  console.error('No .env file found. Copy .env.example to .env and fill in Resend values.')
  process.exit(1)
}

const env = parseEnv(readFileSync(envPath, 'utf8'))
let failed = false

console.log('Contact form configuration\n')

for (const { key, label, help } of checks) {
  const value = env[key] ?? ''
  if (value.length > 0) {
    console.log(`  ✓ ${label} (${key})`)
  } else {
    failed = true
    console.log(`  ✗ ${label} (${key}) — missing or empty`)
    console.log(`      ${help}`)
  }
}

console.log('\nAbuse protection (optional in dev, required in production)\n')

for (const { key, label } of optional) {
  const value = env[key] ?? ''
  console.log(value.length > 0 ? `  ✓ ${label}` : `  ○ ${label} — not set`)
}

const turnstileOff = env.NUXT_PUBLIC_TURNSTILE_DISABLED === 'true'
if (turnstileOff) {
  console.log('\n  ℹ NUXT_PUBLIC_TURNSTILE_DISABLED=true — captcha skipped locally')
}

console.log('')

if (failed) {
  console.log('Add the missing Resend values to .env, restart `npm run dev`, then test at /#contact.')
  process.exit(1)
}

console.log('Resend looks configured. Restart the dev server if it was already running, then send a test from /#contact.')
