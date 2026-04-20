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
/** Geist (display + UI sans), Fraunces (editorial accent serif), Geist Mono (labels/meta) — matches stacks in `app/assets/css/main.css`. */
const appFontsCss =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  /**
   * SPA mode: client-rendered shell; `npm run generate` still emits a static host
   * but first paint is JS-driven. For stronger SEO/social previews (HTML in first
   * response), switch to `ssr: true` or hybrid route rules and retest client-only
   * plugins (theme, smooth scroll, Lenis if added).
   */
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sanity'],
  css: ['~/assets/css/main.css'],

  app: {
    /* Opacity cross-fades have been mistaken for a persistent black overlay; keep instant swaps. */
    pageTransition: false,
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: `%s · ${siteTitle}`,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preload', as: 'style', href: appFontsCss },
        { rel: 'stylesheet', href: appFontsCss },
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
      siteUrl,
      siteDescription,
    },
  },

  // Baseline security headers. CSP is tuned for the assets actually
  // used by this site: Sanity CDN for images, Google Fonts,
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
        "font-src 'self' data: https://fonts.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
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
