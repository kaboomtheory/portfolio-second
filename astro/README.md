# bryanxmendez.com on Astro

Astro rebuild of the Nuxt site in the repo root. It reads the same Sanity
project (`ns0czoug`, dataset `production`) with the GROQ queries copied from
`server/api/sanity-*.get.ts`, and lives in this folder so both sites can run
side by side until the switch. `sanity-studio/` is unchanged.

## Run

```sh
cd astro
npm install
npm run dev      # http://localhost:4321
npm run build    # Vercel output in .vercel/output
```

On Vercel, create a project with **Root Directory** set to `astro`.

## How it is put together

- `output: 'server'` with `@astrojs/vercel`. Pages render on demand; the home
  page sets `CDN-Cache-Control` for a 1 day edge cache with SWR, like the
  Nuxt API routes did.
- Sanity is read on the server only (`src/lib/sanity.ts`, `src/lib/queries.ts`,
  `src/lib/content.ts`) and passed to the page as props.
- The Nuxt Vue components are reused as Astro islands through `@astrojs/vue`
  (`client:load` above the fold, `client:visible` below). The few Nuxt
  helpers they still call (`useState`, `useRoute`, `useRuntimeConfig`,
  `NuxtLink`, `ClientOnly`) come from small stand-ins in `src/shims/nuxt.ts`
  and `src/components/{NuxtLink,NuxtImg,ClientOnly}.vue`.
- Styling is Tailwind v3 plus the token file `src/styles/main.css`, copied
  from `app/assets/css/main.css`, with the light and dark themes.

## Not ported yet

- `/api/contact` (Resend, Turnstile, Upstash rate limit). The form renders but
  submitting fails until this endpoint exists.
- Project case study pages, password unlock, About, Privacy, sitemap.
- CSP nonce headers (`server/middleware/securityHeaders.ts`).
- Page transitions from `app/layouts/default.vue`.
- Fonts load from Google Fonts instead of being self-hosted by `@nuxt/fonts`.
