# MVP Build Plan - Portfolio Replica (Mock Content)

## Goal
Create an MVP clone of `https://v2.ericsin.com/` using the same frontend stack style (Nuxt + Vue + Tailwind) while replacing all live content with placeholders.

## Status Key
- [ ] Pending
- [~] In Progress
- [x] Completed

---

## Phase 1 - Stack Bootstrap
- [x] Initialize Nuxt project.
- [x] Configure SPA behavior (`ssr: false`) to match the original runtime style.
- [x] Install and wire Tailwind.
- [x] Install icon package for navigation and UI affordances.

### Implementation Notes
1. Keep Nuxt app structure in `app/` (`layouts`, `pages`, `components`, `composables`, `middleware`, `data`).
2. Add global CSS variables for light and dark palettes to mimic the reference token-driven system.
3. Keep `devtools` enabled for iteration in MVP.

---

## Phase 2 - Global Shell and Navigation
- [x] Build desktop sidebar with grouped navigation (Work, Personal).
- [x] Build mobile top bar and slide-in navigation drawer.
- [x] Add theme toggle with persisted preference.
- [x] Add local time widget and social links.
- [x] Add global footer.

### Implementation Notes
1. Desktop layout uses fixed/sticky sidebar and content region.
2. Mobile drawer closes on route change.
3. Theme state is centralized with `useState` and a client plugin.

---

## Phase 3 - Mock Content Layer
- [x] Create typed mock data for Home status cards.
- [x] Create typed mock data for Projects and protected case studies.
- [x] Create typed mock data for Writing, Friends, Trinkets, Resume.
- [x] Create single composable entry point (`useMockContent`) for pages.

### Implementation Notes
1. All data lives in `app/data/*` and is safe for static MVP use.
2. Placeholder images use deterministic seeded URLs.
3. Password-protected pages use mock values only.

---

## Phase 4 - Route Parity Implementation
- [x] `/` Home with hero, status, article preview, trinkets preview.
- [x] `/about` basic placeholder content page.
- [x] `/projects` filterable archive.
- [x] `/projects/[...slug]` dynamic case-study page.
- [x] `/password/[...slug]` protected-entry flow.
- [x] `/resume` experience and clients sections.
- [x] `/writing` archive list.
- [x] `/writing/[id]` dynamic article detail route.
- [x] `/friends` filterable people directory.
- [x] `/trinkets` grid + modal details.

### Implementation Notes
1. Dynamic routes use local content lookup and fallback states.
2. Protected projects use route middleware plus localStorage checks.
3. Navigation labels and URL patterns mirror the source structure.

---

## Phase 5 - UX and Accessibility Pass
- [x] Add clear hover and focus states.
- [x] Add subtle entrance and page transitions.
- [x] Add modal close interactions (overlay + Escape key).
- [x] Validate responsive behavior between mobile and desktop.

### Implementation Notes
1. Keep transitions lightweight and not overly ornamental.
2. Maintain contrast and text legibility in both theme modes.
3. Keep components reusable and route-independent.

---

## Phase 6 - Validation and Delivery
- [x] Run production build check.
- [x] Confirm routes render correctly after build.
- [x] Execute `/init` command after MVP completion.

### Implementation Notes
1. Build command: `npm run build`.
2. If build fails, fix type/import/style regressions before handoff.
3. Run slash command only after build verification.

---

## Phase 7 (Optional) - CMS Integration (Post-MVP)

This phase is intentionally optional and should not block MVP delivery.

- [ ] Add CMS adapters for Storyblok and Notion.
- [ ] Introduce feature flag (example: `USE_MOCK_CONTENT=true|false`).
- [ ] Move all keys to env variables and Nuxt runtime config.
- [ ] Replace direct mock reads with repository-style content services.
- [ ] Add server endpoints that proxy and normalize CMS responses.
- [ ] Preserve current page data contracts to avoid UI rewrites.
- [ ] Add fallback behavior to mock data if CMS fetch fails.
- [ ] Add caching strategy and timeout/error handling.
- [ ] Add integration QA checklist for each route.

### Optional CMS Detailed Instructions
1. **Runtime config setup**
   - Add required env vars (`STORYBLOK_TOKEN`, `NOTION_KEY`, DB/page IDs).
   - Expose only public-safe values under `runtimeConfig.public`.

2. **Server data layer**
   - Create server routes (`/api/home`, `/api/projects`, `/api/writing`, etc.).
   - In each route, map CMS fields into current mock content shapes.

3. **Feature switching**
   - Implement provider selection in composables.
   - If `USE_MOCK_CONTENT=true`, return local data.
   - If false, call server endpoints and fallback to mock on failures.

4. **Stability and observability**
   - Add request timeout and retry limits.
   - Log structured errors and return safe fallback payloads.

5. **QA checklist**
   - Verify all list pages and detail routes.
   - Verify protected-route flow.
   - Verify light/dark mode visual parity.
   - Verify no secrets appear in client bundles.
