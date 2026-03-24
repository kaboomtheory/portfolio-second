const siteTitle = 'Bryan X. Mendez'
const siteDescription =
  'Portfolio of Bryan X. Mendez — graphic designer in Los Angeles. Brand identity, packaging, and digital experiences.'
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://bryanxmendez.com'
const ogImage = `${siteUrl.replace(/\/$/, '')}/favicon.svg`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/sanity'],
  css: ['~/assets/css/main.css'],

  app: {
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Figtree:ital,wght@0,400..700;1,400..600&display=swap',
        },
      ],
    },
  },

  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    typegen: {
      enabled: true,
      schemaTypesPath: './sanity-studio/schemas',
    },
  },

  runtimeConfig: {
    public: {
      sanityProjectId: process.env.SANITY_PROJECT_ID,
      sanityDataset: process.env.SANITY_DATASET,
      sanityApiVersion: process.env.SANITY_API_VERSION,
    },
  },
})
