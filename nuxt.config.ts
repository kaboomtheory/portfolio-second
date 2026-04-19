const siteTitle = 'Bryan X. Mendez'
const siteDescription =
  'Portfolio of Bryan X. Mendez — graphic designer in Los Angeles. Brand identity, packaging, and digital experiences.'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://bryanxmendez.com'
const ogImage = `${siteUrl.replace(/\/$/, '')}/favicon.svg`

// Same defaults as sanity-studio/sanity.config.ts — override with SANITY_* in .env for other projects/deploys.
const sanityProjectId = process.env.SANITY_PROJECT_ID || 'ns0czoug'
const sanityDataset = process.env.SANITY_DATASET || 'production'
const sanityApiVersion = process.env.SANITY_API_VERSION || '2025-01-01'

// https://nuxt.com/docs/api/configuration/nuxt-config
const geistSansCss =
  'https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css'
const geistMonoCss =
  'https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono/style.css'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sanity'],
  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'page', mode: 'default' },
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: `%s · ${siteTitle}`,
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'description', content: siteDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteTitle },
        { property: 'og:title', content: siteTitle },
        { property: 'og:description', content: siteDescription },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteTitle },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
        { rel: 'preload', as: 'style', href: geistSansCss, crossorigin: 'anonymous' },
        { rel: 'preload', as: 'style', href: geistMonoCss, crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: geistSansCss, crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: geistMonoCss, crossorigin: 'anonymous' },
      ],
    },
  },

  sanity: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    typegen: {
      enabled: true,
      schemaTypesPath: './sanity-studio/schemas',
    },
  },

  runtimeConfig: {
    public: {
      sanityProjectId,
      sanityDataset,
      sanityApiVersion,
    },
  },

  // Baseline security headers. CSP is tuned for the assets actually
  // used by this site: Sanity CDN for images, jsDelivr for fonts,
  // YouTube/Vimeo iframes, Iconify API for on-demand icon JSON.
  // CSP is applied in production only — dev uses Vite HMR over
  // WebSockets and benefits from looser defaults.
  routeRules: (() => {
    const isProd = process.env.NODE_ENV === 'production'

    const baseHeaders: Record<string, string> = {
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    }

    if (isProd) {
      baseHeaders['Content-Security-Policy'] = [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "img-src 'self' data: blob: https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "script-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com",
        "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
        "media-src 'self' blob:",
        "worker-src 'self' blob:",
      ].join('; ')
    }

    return {
      '/**': { headers: baseHeaders },
    }
  })(),

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) {
              return 'three'
            }
          },
        },
      },
    },
  },
})
