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

- [ ] Confirm **`NUXT_PUBLIC_SITE_URL`** is your real production site URL (canonical links and structured data).

## Deploy requirements

- [ ] Hosting must run **Nitro server routes** (for example Vercel / Netlify / Cloudflare with serverless functions). A **static-only** host with no `/api/*` will not run `POST /api/contact`.

## Smoke test after deploy

- [ ] Open the live site, scroll to **Contact** (`/#contact`), and send yourself a **real test message**.
- [ ] Confirm the email arrives and that **Reply** in your mail client addresses the **visitor’s** email (Reply-To).
- [ ] If nothing arrives, check **Resend** logs and spam folder.

## Privacy and content (optional follow-ups)

- [ ] Confirm the contact block does **not** show your personal address on the page.
- [ ] Optional: if Sanity still fetches a home **email** field to the browser and you want zero exposure, remove that field from **GROQ** queries in a later change.

## Operations

- [ ] Be aware of **Resend** free-tier limits (daily/monthly caps); upgrade or add a captcha if bot traffic spikes.
- [ ] Optional later: **Cloudflare Turnstile** or **hCaptcha** plus **CSP** updates in `nuxt.config.ts` if you need stronger bot resistance.

## Reference

- Server handler: `server/api/contact.post.ts`
- Env template: `.env.example`
- Agent notes: `AGENTS.md` (section “Contact form (Resend)”)
