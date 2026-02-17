# AGENTS.md

Operational guide for coding agents working in this repository.

## 1) Repository Overview

- Framework: Nuxt 4 (Vue 3 + Vue Router).
- Styling: Tailwind CSS + custom CSS tokens in `app/assets/css/main.css`.
- Language: TypeScript (`<script setup lang="ts">` in Vue SFCs).
- Data source (current): local mock content in `app/data/*`.
- Runtime mode: SPA (`ssr: false` in `nuxt.config.ts`).

## 2) Rule Files (Cursor/Copilot)

Checked locations:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Current status: none of these files exist in this repo.

If any are added later, treat them as higher-priority project instructions and update this file.

## 3) Source Layout

- `app/app.vue`: app entry wrapper using layout + page.
- `app/layouts/default.vue`: desktop sidebar + mobile drawer shell.
- `app/pages/*`: route files.
- `app/components/*`: reusable UI building blocks.
- `app/composables/*`: shared composition logic (`useTheme`, `useMockContent`).
- `app/middleware/*`: route middleware (`project-protect`).
- `app/data/*`: typed mock data models and collections.
- `nuxt.config.ts`: Nuxt config, modules, SPA mode.
- `Todos.md`: implementation roadmap and optional CMS phase notes.

Do not edit generated/build artifacts:

- `.nuxt/`
- `.output/`
- `node_modules/`

## 4) Package Manager and Environment

- Use `npm` (lockfile is `package-lock.json`).
- Node version: use a modern LTS compatible with Nuxt 4.

## 5) Build / Lint / Test Commands

### Core project commands

- Install deps: `npm install`
- Prepare Nuxt types: runs automatically in `postinstall` (`nuxt prepare`)
- Dev server: `npm run dev`
- Production build: `npm run build`
- Generate static output: `npm run generate`
- Preview production build: `npm run preview`

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

## 11) Agent Workflow Checklist

Before coding:

- Read related files in `app/` to follow existing patterns.
- Check for newly added Cursor/Copilot rule files.

After coding:

- Run `npm run build`.
- If tests exist later, run relevant test command(s).
- Do not commit generated directories (`.nuxt`, `.output`).

When introducing new tooling:

- Add scripts in `package.json` (`lint`, `test`, `test:watch`, etc.).
- Update this AGENTS.md with exact commands, including single-test examples.
