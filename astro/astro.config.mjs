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
