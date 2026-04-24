# Production checklist — contact form and deploy

Use this before or right after you push the portfolio to production. Check items off as you go.

## Resend and email

- [ ] Create or confirm your **Resend** account and **API key**.
- [ ] **Verify the sending domain** in Resend (add the DNS records they provide) so messages are less likely to land in spam.
- [ ] Set **`NUXT_CONTACT_FROM_EMAIL`** to a **verified** sender in Resend (for example `Portfolio <hello@yourdomain.com>`).
- [ ] Set **`NUXT_CONTACT_TO_EMAIL`** to the inbox that should receive contact form submissions.

## Host environment (Vercel, Netlify, Cloudflare, etc.)

- [ ] Add these **production** environment variables (never commit real values to git):

  | Variable | Purpose |
  | --- | --- |
  | `NUXT_RESEND_API_KEY` | Resend API key |
  | `NUXT_CONTACT_TO_EMAIL` | Your receiving inbox |
  | `NUXT_CONTACT_FROM_EMAIL` | Verified “from” address in Resend |
  | `NUXT_PUBLIC_SITE_URL` | Live site origin (canonical URLs, OG image base) |
  | `PROJECT_UNLOCK_SECRET` | Random string **≥ 16 characters**; signs the HttpOnly cookie for password-protected projects (**required** in production) |
  | `SANITY_READ_TOKEN` | Read-only Sanity token for server GROQ when `useToken: true` (protected projects / password hashes). **Not** the same as `SANITY_API_TOKEN` (upload script only). |
  | `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for shared rate limiting |
  | `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
  | `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret for server verification |
  | `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for the browser widget |

- [ ] Optional overrides: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` if the deploy should not use `nuxt.config.ts` defaults.

## Deploy requirements

- [ ] Hosting must run **Nitro server routes** (for example Vercel / Netlify / Cloudflare with serverless functions). A **static-only** host with no `/api/*` will not run `POST /api/contact`.
- [ ] Create an **Upstash Redis** database and copy the REST URL/token into the host environment.
- [ ] Create a **Cloudflare Turnstile** widget for the production domain and set both the site key and secret.
- [ ] Re-enter each protected-project password as a **bcrypt hash** in Sanity. Use `npm run hash:project-password "your-password"` locally and paste the output into `passwordHash`.

- [ ] Local smoke before push: `npm run build` (and optionally `npx nuxi typecheck` if your toolchain is clean).

## Smoke test after deploy

- [ ] Open the live site, scroll to **Contact** (`/#contact`), and send yourself a **real test message**.
- [ ] Confirm the Turnstile widget renders on both `/#contact` and `/password/<slug>`.
- [ ] Confirm the email arrives and that **Reply** in your mail client addresses the **visitor’s** email (Reply-To).
- [ ] If nothing arrives, check **Resend** logs and spam folder.
- [ ] If you use **password-protected** case studies: open one, confirm redirect to `/password/...`, unlock with the expected password, confirm the project loads and reload still works (cookie + `SANITY_READ_TOKEN` + `PROJECT_UNLOCK_SECRET` on the host).
- [ ] Open the browser console on a public page and confirm there are **no CSP violations**.

## Privacy and content (optional follow-ups)

- [ ] Confirm the contact block does **not** show your personal address on the page.
- [ ] Optional: if Sanity still fetches a home **email** field to the browser and you want zero exposure, remove that field from **GROQ** queries in a later change.

## Operations

- [ ] Run **`npm audit`** at the repo root before major releases; resolve high/critical advisories or document why they are accepted.
- [ ] If you ship **Sanity Studio** from `sanity-studio/`, run **`npm audit`** there too (separate lockfile); `npm audit fix` when upgrades are safe.
- [ ] Be aware of **Resend** free-tier limits (daily/monthly caps); the app now depends on Turnstile + Upstash to keep spam volume manageable.
- [ ] Optional later: add **Vercel WAF / firewall rules** as defense in depth on top of the in-app Upstash limits.

## Reference

- Server handler: `server/api/contact.post.ts`
- Env template: `.env.example`
- Agent notes: `AGENTS.md` (section “Contact form (Resend)”)
