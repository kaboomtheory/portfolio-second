const siteTitle = 'Bryan X. Mendez'
const siteDescription =
  'Portfolio of Bryan X. Mendez — graphic designer in Los Angeles. Brand identity, packaging, and digital experiences.'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://bryanxmendez.com'
const ogImage = `${siteUrl.replace(/\/$/, '')}/og-default.png`

// Same defaults as sanity-studio/sanity.config.ts — override with SANITY_* in .env for other projects/deploys.
const sanityProjectId = process.env.SANITY_PROJECT_ID || 'ns0czoug'
const sanityDataset = process.env.SANITY_DATASET || 'production'
const sanityApiVersion = process.env.SANITY_API_VERSION || '2025-01-01'

// https://nuxt.com/docs/api/configuration/nuxt-config
/** Geist, Averia Serif Libre, Geist Mono — loaded via `@nuxt/fonts` (weights 400–600). */
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  /** Server-render marketing pages so first paint and social crawlers get real HTML. */
  ssr: true,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sanity', '@nuxt/image', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  image: {
    /**
     * Sanity CDN URLs are already transformed by `buildImageUrl()` and rendered
     * via `SanityImage` as direct `<img>` tags to avoid IPX rewriting query
     * params (`?w=&q=&auto=format`). Nuxt Image still optimizes local/static
     * assets and any non-Sanity sources.
     */
    format: ['webp', 'avif'],
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
    },
    families: [
      { name: 'Geist', provider: 'google', global: true },
      { name: 'Averia Serif Libre', provider: 'google', global: true },
      { name: 'Geist Mono', provider: 'google', global: true },
    ],
  },

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
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      // Pre-hydration theme init: set the `dark` class on <html> before first paint
      // so the page doesn't flash the wrong theme. Mirrors logic in utils/theme.ts.
      script: [
        {
          innerHTML:
            "(function(){try{var s=localStorage.getItem('color-mode');var dark=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;var mode=dark?'dark':'light';el.classList.toggle('dark',dark);el.dataset.theme=mode;el.style.colorScheme=mode;var m=document.querySelector('meta[name=\"theme-color\"]');if(m){m.setAttribute('content',dark?'#212530':'#ffffff');}}catch(e){}})();",
          tagPosition: 'head',
        },
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

  /**
   * Contact form (`server/api/contact.post.ts` → Resend). Set on the host, never commit secrets:
   * - NUXT_RESEND_API_KEY
   * - NUXT_CONTACT_TO_EMAIL (your inbox)
   * - NUXT_CONTACT_FROM_EMAIL (verified sender in Resend, e.g. "Portfolio <hello@yourdomain.com>")
   */
  runtimeConfig: {
    resendApiKey: '',
    contactToEmail: '',
    contactFromEmail: '',
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
        "font-src 'self' data: blob:",
        "style-src 'self' 'unsafe-inline'",
        "style-src-elem 'self' 'unsafe-inline'",
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

})
