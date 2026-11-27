/**
 * Small stand-ins for the Nuxt auto-imports the ported Vue components still use.
 *
 * Each Astro island is its own Vue app, so shared state lives at module scope
 * here (one copy per browser tab). On the server the same map would be shared
 * by every request, so `useState` never stores anything during SSR: it hands
 * back a fresh ref from the initializer instead.
 */
import { reactive, ref, type Ref } from 'vue'
import type Lenis from 'lenis'

const isClient = !import.meta.env.SSR
const clientState = new Map<string, Ref<unknown>>()

export function useState<T>(key: string, init?: () => T): Ref<T> {
  if (!isClient) return ref(init ? init() : undefined) as Ref<T>
  if (!clientState.has(key)) clientState.set(key, ref(init ? init() : undefined))
  return clientState.get(key) as Ref<T>
}

/** Public runtime values, read from `PUBLIC_*` env vars at build time. */
const publicConfig = {
  sanityProjectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'ns0czoug',
  sanityDataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  sanityApiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01',
  siteUrl: import.meta.env.PUBLIC_SITE_URL || 'https://bryanxmendez.com',
  siteDescription:
    'Portfolio of Bryan X. Mendez — graphic designer in Los Angeles. Brand identity, packaging, and digital experiences.',
  turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
  turnstileDisabled: import.meta.env.PUBLIC_TURNSTILE_DISABLED === 'true',
}

export function useRuntimeConfig() {
  return { public: publicConfig }
}

/**
 * Minimal route: path + hash. During SSR the path comes from `setSsrPath`
 * (called by the page before rendering); in the browser it is live.
 */
let ssrPath = '/'
export function setSsrPath(path: string) {
  ssrPath = path
}

const route = reactive({ path: isClient ? window.location.pathname : ssrPath, hash: isClient ? window.location.hash : '' })
if (isClient) {
  const sync = () => {
    route.path = window.location.pathname
    route.hash = window.location.hash
  }
  window.addEventListener('hashchange', sync)
  window.addEventListener('popstate', sync)
}

export function useRoute() {
  if (!isClient) return { path: ssrPath, hash: '' }
  return route
}

/** Multi-page app: "router" navigation is a real page load. */
export function useRouter() {
  return {
    resolve(to: string | { path?: string; hash?: string }) {
      if (typeof to !== 'string') return { path: to.path || '/', hash: to.hash || '' }
      const url = new URL(to, isClient ? window.location.href : 'http://localhost')
      return { path: url.pathname, hash: url.hash }
    },
    push(to: string | { path?: string; hash?: string }) {
      const target = typeof to === 'string' ? to : `${to.path || '/'}${to.hash || ''}`
      if (isClient) window.location.assign(target)
    },
  }
}

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/** `$lenis` is set up by the layout's smooth-scroll script (see src/scripts/lenis.ts). */
export function useNuxtApp() {
  return {
    get $lenis() {
      return isClient ? window.__lenis : undefined
    },
  }
}
