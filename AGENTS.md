# AGENTS.md

Operational guide for coding agents working in this repository.

## 1) Repository Overview

- Framework: Nuxt 4 (Vue 3 + Vue Router).
- Styling: Tailwind CSS + custom CSS tokens in `app/assets/css/main.css`.
- Language: TypeScript (`<script setup lang="ts">` in Vue SFCs).
- Data source: Sanity CMS via server routes (`server/api/sanity-*.get.ts`, `server/api/project/*`); some pages still use `useMockContent()` fallbacks from `app/data/*`.
- Runtime mode: SSR enabled (`ssr: true` in `nuxt.config.ts`).

## 2) Rule Files (Cursor/Copilot)

Checked locations:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Current status: none of these files exist in this repo.

If any are added later, treat them as higher-priority project instructions and update this file.

## 3) Source Layout

- `app/app.vue`: app entry wrapper using layout + page.
- `app/layouts/default.vue`: top pill navbar (`AppNavbar`) + centered 72rem container shell; footer (`AppFooter`) + `BackToTop` FAB.
- `app/pages/*`: route files (see full list in Todos.md Phase 4).
- `app/components/*`: reusable UI building blocks.
  - `ScrollExpandImage`: scroll-triggered image animation with scale and opacity effects.
- `app/composables/*`: shared composition logic.
  - `useTheme`: theme state management.
  - `useMockContent`: unified mock data access.
  - `useScrollReveal`: IntersectionObserver-based fade/slide animations.
  - `useScrollExpand` / `useScrollOpacity` / `useScrollExpandImage`: viewport-centred scroll effects; `useScrollLayoutBus` coalesces scroll/resize to one rAF.
- `app/plugins/*`: client-side plugins.
  - `theme.client.ts`: theme persistence and DOM sync.
- `app/middleware/*`: route middleware (`project-protect`).
- `app/data/*`: typed mock data models.
  - `home.ts`, `projects.ts`, `trinkets.ts`, `resume.ts`, `friends.ts`, `writing.ts`, `site.ts`.
- `nuxt.config.ts`: Nuxt config, modules, SSR and security headers.
- `Todos.md`: implementation roadmap and optional CMS phase notes.

Do not edit generated/build artifacts:

- `.nuxt/`
- `.output/`
- `node_modules/`

## 4) Package Manager and Environment

- Use `npm` (lockfile is `package-lock.json`).
- Node version: use a modern LTS compatible with Nuxt 4.

### Environment variables (local and production)

Copy [`.env.example`](.env.example) to `.env` locally. On Vercel (or any host), set the same names in the project environment UI — never commit real secrets.

**Contact form (Resend)** — [`server/api/contact.post.ts`](server/api/contact.post.ts) (`POST /api/contact`):

- `NUXT_RESEND_API_KEY` — Resend API key.
- `NUXT_CONTACT_TO_EMAIL` — Inbox that receives submissions.
- `NUXT_CONTACT_FROM_EMAIL` — Verified sender in Resend (for example `Portfolio <hello@yourdomain.com>`).

**Sanity (server-side GROQ)** — [`server/utils/sanityFetch.ts`](server/utils/sanityFetch.ts):

- `SANITY_READ_TOKEN` — Bearer token for queries that use `useToken: true` (password-protected projects, password hashes, and full project payloads). Use a **read-only** token with minimal dataset permissions. Not the same variable as the upload script token below.

**Local Sanity tooling only** — [`scripts/upload-sanity-project-images.mjs`](scripts/upload-sanity-project-images.mjs):

- `SANITY_API_TOKEN` — Write-capable token for uploads. Do not use this name for the Nuxt server; the app reads `SANITY_READ_TOKEN` for runtime queries.

**Password-protected case studies** — [`server/utils/projectAccess.ts`](server/utils/projectAccess.ts), [`server/api/project-unlock.post.ts`](server/api/project-unlock.post.ts):

- `PROJECT_UNLOCK_SECRET` — **Required in production** (minimum 16 characters). Signs the HttpOnly `project_access` cookie. Without it, unlock flows error in production.

**Abuse protection (shared rate limits + Turnstile)** — [`server/utils/requestSecurity.ts`](server/utils/requestSecurity.ts), [`app/components/TurnstileWidget.vue`](app/components/TurnstileWidget.vue):

- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL for cross-instance rate limiting.
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token.
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret used by Nitro server routes.
- `NUXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key exposed to the browser widget.

**Public site URL**

- `NUXT_PUBLIC_SITE_URL` — Production origin for canonical URLs and OG image base (`nuxt.config.ts`).

A step-by-step production checklist (including post-deploy smoke tests) lives in [`Production-ToDo.md`](Production-ToDo.md).

## 5) Build / Lint / Test Commands

### Core project commands

- Install deps: `npm install`
- Prepare Nuxt types: runs automatically in `postinstall` (`nuxt prepare`)
- Dev server: `npm run dev` (check if already running before starting)
- Production build: `npm run build`
- Generate static output: `npm run generate`
- Preview production build: `npm run preview`
- Dependency audit (ad-hoc, before release): `npm audit`
- Hash a protected-project password for Sanity: `npm run hash:project-password -- "your-password"`
- Bulk-upload local project images to Sanity (requires `SANITY_API_TOKEN` in `.env`): `npm run upload:project-images`
- Sanity Studio lives in `sanity-studio/` (separate `package-lock.json`). After dependency changes there: `npm audit --prefix sanity-studio`.

### Type checking

- Nuxt typecheck (ad-hoc): `npx nuxi typecheck`

### Linting

- No linter is configured yet (no ESLint/Prettier config in repo root).
- If adding ESLint, standardize with script name: `npm run lint`.

### Testing

- No test framework is configured yet (no Vitest/Jest/Playwright config).
- If adding unit tests, prefer Vitest + script: `npm run test`.

## 6) Running a Single Test (Important)

There is currently no test runner configured, so **single-test execution is not available yet**.

If Vitest is introduced, use these patterns:

- Single file: `npx vitest run app/components/ThemeToggle.spec.ts`
- Single test by name: `npx vitest run -t "toggles theme"`
- Watch one file: `npx vitest app/components/ThemeToggle.spec.ts`

If Playwright is introduced for e2e:

- One spec file: `npx playwright test tests/projects.spec.ts`
- One test case: `npx playwright test -g "opens project detail"`

## 7) Code Style Conventions

Follow existing style in repository files.

### Formatting

- 2-space indentation.
- Single quotes in TS/JS.
- No semicolons.
- Keep trailing commas in multiline object/array/function literals.
- Keep lines readable; split long objects/props across lines.

### Vue SFC structure

- Prefer order: `<script setup lang="ts">`, `<template>`, `<style scoped>`.
- Keep most logic in script; keep templates declarative.
- Use `defineProps`, `defineEmits`, `withDefaults` with explicit typing.

### Imports

- Group imports in this order:
  1. external packages (e.g., `@iconify/vue`)
  2. alias imports (`~/...`)
  3. relative imports (`./...`, `../...`)
- Prefer Nuxt alias (`~/`) over deep relative paths when possible.

### Type usage

- Prefer explicit interfaces/types for data models (`app/data/*`).
- Avoid `any`; use unions and indexed records where needed.
- For nullable refs, type explicitly: `ref<Type | null>(null)`.
- Keep computed values typed through source collections when practical.

### Naming

- Components: PascalCase file names and component names.
- Composables: `useXxx` convention.
- Data interfaces: PascalCase (`ProjectItem`, `WritingItem`).
- Route param normalization vars: use clear names (`source`, `slug`).
- Booleans: `isX`, `hasX`, `canX` style.

### CSS / Tailwind

- Use Tailwind utility classes for layout and spacing.
- Use CSS custom properties from `main.css` for colors/tokens.
- Keep shared visual tokens centralized in `:root` and `.dark` blocks.
- Typography:
  - Body and headings: `'Geist Sans', system-ui, sans-serif`
  - Code and monospace: `'Geist Mono', ui-monospace, monospace` (via `.mono` class)
  - Fonts loaded via jsDelivr CDN in `main.css`
- Fading edge technique: use `::before`/`::after` pseudo-elements with `linear-gradient` for decorative borders that fade to transparent (see `AppSidebar.vue`).

## 8) Error Handling and Guards

- Use guard clauses early for invalid/missing state.
- In client-only APIs (e.g., `localStorage`), gate with `import.meta.client`.
- For dynamic route lookups, provide graceful fallback UI when item is missing.
- For future CMS/network work, add `try/catch`, timeout handling, and safe fallback data.

## 9) Routing and Middleware Rules

- Route files must mirror URL structure exactly.
- Keep protected route logic in middleware (`app/middleware/project-protect.ts`).
- Do not duplicate auth/protection logic directly in page templates.

## 10) Accessibility and UX Baselines

- Always include meaningful `alt` text on images.
- Buttons must use `type="button"` unless submit behavior is required.
- Ensure keyboard escape path for overlays/modals.
- Keep interactive elements focusable and visible in both themes.

## 11) Scroll Animation System

The project pages use a scroll-driven animation system with these components:

### Composables

- **`useScrollReveal`** (`app/composables/useScrollReveal.ts`): IntersectionObserver-based fade/slide animations. Returns `elementRef`, `isVisible` for single elements. Also exports `useScrollRevealGroup` for staggered children animations.
- **`useScrollExpand`** (`app/composables/useScrollExpand.ts`): Viewport-center-based scale calculations (`progress`, `scale`, `isCentered`). **`useScrollOpacity`**: separate opacity fade. **`useScrollExpandImage`**: single `getBoundingClientRect` per frame for both (used by `ScrollExpandImage`). All use **`useScrollLayoutBus`** (`useScrollLayoutSubscription` + shared `scrollY`) for one window listener set.

### Components

- **`ScrollExpandImage`** (`app/components/ScrollExpandImage.vue`): Image with scroll-driven scale and opacity. Props: `src`, `alt`, `caption`, `layout` (full/large/medium), `preExpanded`, `minScale`, `maxScale`.

### Project Page Animation Flow

1. Hero header uses `useScrollReveal` for initial fade-in
2. Section container uses `useScrollRevealGroup` for staggered section reveals
3. Images use `ScrollExpandImage` component for scale/opacity effects as they approach viewport center
4. All animations respect `prefers-reduced-motion`

## 12) Agent Workflow Checklist

Before coding:

- Read related files in `app/` to follow existing patterns.
- Check for newly added Cursor/Copilot rule files.

After coding:

- You do **not** need to run `npm run build` after every change; use it when a production build check is useful (e.g., larger refactors, config or dependency edits, or when the user asks).
- If tests exist later, run relevant test command(s).
- Do not commit generated directories (`.nuxt`, `.output`).

When introducing new tooling:

- Add scripts in `package.json` (`lint`, `test`, `test:watch`, etc.).
- Update this AGENTS.md with exact commands, including single-test examples.

## 13) Development Server Usage

When testing changes that require the development server:

- First check if a dev server is already running with `ps aux | grep nuxt` or similar command
- If no server is running, start it with `npm run dev`
- If a server is already running, use it directly without restarting
- The server typically runs on `http://localhost:3000` by default
- Always verify the server is accessible before proceeding with testing
