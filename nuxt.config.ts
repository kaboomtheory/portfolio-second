const siteTitle = 'Bryan X. Mendez Graphic Design Portfolio'
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
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sanity', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: siteTitle,
  },

  sitemap: {
    includeAppSources: false,
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/theme-lab', '/password/**'],
    discoverImages: false,
    discoverVideos: false,
  },

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
      { name: 'Space Grotesk', provider: 'google', global: true },
      { name: 'Bebas Neue', provider: 'google', global: true },
    ],
  },

  app: {
    /* Opacity cross-fades have been mistaken for a persistent black overlay; keep instant swaps. */
    pageTransition: false,
    head: {
      htmlAttrs: { lang: 'en' },
      title: siteTitle,
      titleTemplate: siteTitle,
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
      script: [
        {
          src: '/theme-init.js',
          tagPosition: 'head',
        },
      ],
    },
  },

  sanity: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
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
    /** Prefer `TURNSTILE_SECRET_KEY` / `NUXT_TURNSTILE_SECRET_KEY` (Nuxt override). */
    turnstileSecretKey:
      process.env.TURNSTILE_SECRET_KEY || process.env.NUXT_TURNSTILE_SECRET_KEY || '',
    /** Prefer `UPSTASH_REDIS_REST_*` / `NUXT_UPSTASH_REDIS_REST_*` (Nuxt override). */
    upstashRedisRestUrl:
      process.env.UPSTASH_REDIS_REST_URL || process.env.NUXT_UPSTASH_REDIS_REST_URL || '',
    upstashRedisRestToken:
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.NUXT_UPSTASH_REDIS_REST_TOKEN || '',
    public: {
      sanityProjectId,
      sanityDataset,
      sanityApiVersion,
      siteUrl,
      siteDescription,
      /** Set `NUXT_PUBLIC_TURNSTILE_SITE_KEY` on the host. */
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      /** Set to `"true"` to disable Turnstile verification globally. */
      turnstileDisabled: process.env.NUXT_PUBLIC_TURNSTILE_DISABLED === 'true',
    },
  },
})
