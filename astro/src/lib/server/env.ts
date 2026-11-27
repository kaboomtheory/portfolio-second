import { getSecret } from 'astro:env/server'

/**
 * Reads a server-only env var at request time. Later names are fallbacks, so
 * the old Nuxt names (`NUXT_RESEND_API_KEY`, …) keep working on Vercel until
 * they are renamed.
 */
export function serverEnv(...names: string[]): string {
  for (const name of names) {
    const value = getSecret(name)
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export const isProduction = import.meta.env.PROD
