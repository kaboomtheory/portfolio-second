// @ts-check
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import vue from '@astrojs/vue'

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://bryanxmendez.com'

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: siteUrl,
  /**
   * Server output: pages render on demand by default. Pages that can be fully
   * static opt in with `export const prerender = true`. The contact form,
   * project unlock and password-protected case studies need the server.
   */
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [vue()],
  security: {
    /**
     * Hash-based CSP (replaces the Nuxt per-request nonces). Astro hashes every
     * script and style it renders and sends the policy as a
     * Content-Security-Policy header on on-demand pages (a <meta> tag on
     * prerendered ones). Production builds only; `astro dev` sends none.
     * Host lists match server/middleware/securityHeaders.ts.
     */
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://c.bing.com https://*.clarity.ms",
        "font-src 'self' data: blob: https://fonts.gstatic.com",
        "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://challenges.cloudflare.com https://*.challenges.cloudflare.com https://*.clarity.ms",
        "child-src 'self' blob: https://challenges.cloudflare.com",
        "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://challenges.cloudflare.com",
        "media-src 'self' blob:",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ],
      scriptDirective: {
        // Turnstile and Clarity load their scripts from these hosts at runtime.
        resources: ["'self'", 'https://challenges.cloudflare.com', 'https://www.clarity.ms', 'https://*.clarity.ms'],
      },
      styleDirective: {
        // Google Fonts stylesheet stays until fonts are self-hosted.
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
    },
  },
  vite: {
    /**
     * Use this folder's tsconfig for every file, .vue included. Otherwise Vite
     * walks up to the Nuxt root tsconfig, which points at generated .nuxt/ files.
     */
    tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
