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
