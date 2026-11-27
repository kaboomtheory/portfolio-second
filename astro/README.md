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

## Environment variables

The public values default to the live site, so a build works with none set.

| Name | Needed for | Default |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity reads | `ns0czoug` |
| `PUBLIC_SANITY_DATASET` | Sanity reads | `production` |
| `PUBLIC_SANITY_API_VERSION` | Sanity reads | `2025-01-01` |
| `PUBLIC_SITE_URL` | Canonical URLs, sitemap | `https://bryanxmendez.com` |
| `SANITY_READ_TOKEN` | Protected projects (read-only token, not `SANITY_API_TOKEN`) | none |
| `PROJECT_UNLOCK_SECRET` | Signs the unlock cookie, 16+ characters | none |
| `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Contact form | none |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Contact and unlock rate limits | none |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form email | none |

The server routes also accept the old `NUXT_` names for the Resend, contact,
Turnstile secret and Upstash values. `PUBLIC_TURNSTILE_SITE_KEY` has no
fallback because it is read at build time.

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

## Pages

| Route | Source | Notes |
| --- | --- | --- |
| `/` | `app/pages/index.vue` | Edge cached for a day |
| `/projects/[slug]` | `app/pages/projects/[slug].vue` | Protected projects redirect to `/password/[slug]` unless `getUnlockedProject` (`src/lib/projectAccess.ts`) returns the project |
| `/about` | `app/pages/about/index.vue` | |
| `/privacy` | `app/pages/privacy.vue` | Prerendered |
| `/password/[slug]` | `app/pages/password/[...slug].vue` | Posts to `/api/project-unlock` |
| `/404`, `/500` | `app/error.vue` | |

- Page transitions use cross-document view transitions (`src/styles/transitions.css`),
  so they need no JavaScript. Browsers without support navigate instantly.
- Fonts are self-hosted from `@fontsource` packages (`src/styles/fonts.css`).

## Not ported yet

- Server pieces: `/api/contact`, `/api/project-unlock` and the unlock cookie
  check, CSP headers, sitemap and robots. These are being built on a separate
  branch that merges into this one.
- `/theme-lab` (internal tool, left out on purpose).
