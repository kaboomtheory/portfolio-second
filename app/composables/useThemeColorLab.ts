import { THEME_COLOR_TOKENS, type ThemeColorToken } from '~/data/themeColorTokens'

const STORAGE_KEY = 'portfolio-theme-lab-v1'
const STYLE_ID = 'portfolio-theme-lab-overrides'

export type ThemeColorOverrides = Partial<Record<ThemeColorToken['var'], string>>

export interface ThemeLabPersisted {
  v: 1
  light: ThemeColorOverrides
  dark: ThemeColorOverrides
}

function defaultMap(mode: 'light' | 'dark'): Record<ThemeColorToken['var'], string> {
  const out = {} as Record<ThemeColorToken['var'], string>
  for (const t of THEME_COLOR_TOKENS) {
    out[t.var] = mode === 'light' ? t.light : t.dark
  }
  return out
}

function normalizeHex(input: string): string | null {
  const s = input.trim()
  const m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  const raw = m?.[1]
  if (!raw) {
    return null
  }
  let h = raw
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('')
  }
  return `#${h.toLowerCase()}`
}

function mergeMaps(
  defaults: Record<ThemeColorToken['var'], string>,
  overrides: ThemeColorOverrides,
): Record<ThemeColorToken['var'], string> {
  const out: Record<ThemeColorToken['var'], string> = { ...defaults }
  for (const key of Object.keys(overrides) as (keyof ThemeColorOverrides)[]) {
    const v = overrides[key]
    if (v !== undefined) {
      out[key as ThemeColorToken['var']] = v
    }
  }
  return out
}

function buildOverrideCss(
  light: Record<ThemeColorToken['var'], string>,
  dark: Record<ThemeColorToken['var'], string>,
): string {
  const linesLight = THEME_COLOR_TOKENS.map((t) => `  ${t.var}: ${light[t.var]};`).join('\n')
  const linesDark = THEME_COLOR_TOKENS.map((t) => `  ${t.var}: ${dark[t.var]};`).join('\n')
  return (
    `/* Theme lab — generated; do not edit by hand in devtools (use /theme-lab). */\n`
    + `:root {\n${linesLight}\n}\n\n:root.dark {\n${linesDark}\n}\n`
  )
}

function upsertStyleTag(css: string) {
  if (!import.meta.client) {
    return
  }
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = css
}

function removeStyleTag() {
  if (!import.meta.client) {
    return
  }
  document.getElementById(STYLE_ID)?.remove()
}

function readStorage(): ThemeLabPersisted | null {
  if (!import.meta.client) {
    return null
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as ThemeLabPersisted
    if (parsed?.v !== 1 || typeof parsed.light !== 'object' || typeof parsed.dark !== 'object') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStorage(payload: ThemeLabPersisted) {
  if (!import.meta.client) {
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function useThemeColorLab() {
  const defaultsLight = defaultMap('light')
  const defaultsDark = defaultMap('dark')

  const overridesLight = useState<ThemeColorOverrides>('theme-lab-overrides-light', () => ({}))
  const overridesDark = useState<ThemeColorOverrides>('theme-lab-overrides-dark', () => ({}))

  const effectiveLight = computed(() => mergeMaps(defaultsLight, overridesLight.value))
  const effectiveDark = computed(() => mergeMaps(defaultsDark, overridesDark.value))

  function applyDom() {
    if (!import.meta.client) {
      return
    }
    const hasOverrides =
      Object.keys(overridesLight.value).length > 0
      || Object.keys(overridesDark.value).length > 0
    if (!hasOverrides) {
      removeStyleTag()
      return
    }
    const css = buildOverrideCss(effectiveLight.value, effectiveDark.value)
    upsertStyleTag(css)
  }

  function persist() {
    if (!import.meta.client) {
      return
    }
    const emptyLight = Object.keys(overridesLight.value).length === 0
    const emptyDark = Object.keys(overridesDark.value).length === 0
    if (emptyLight && emptyDark) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    writeStorage({
      v: 1,
      light: { ...overridesLight.value },
      dark: { ...overridesDark.value },
    })
  }

  function hydrateFromStorage() {
    if (!import.meta.client) {
      return
    }
    const stored = readStorage()
    if (!stored) {
      removeStyleTag()
      overridesLight.value = {}
      overridesDark.value = {}
      return
    }
    overridesLight.value = { ...stored.light }
    overridesDark.value = { ...stored.dark }
    applyDom()
  }

  function setColor(mode: 'light' | 'dark', tokenVar: ThemeColorToken['var'], raw: string) {
    const hex = normalizeHex(raw)
    if (!hex) {
      return
    }
    if (mode === 'light') {
      overridesLight.value = {
        ...overridesLight.value,
        [tokenVar]: hex,
      }
    } else {
      overridesDark.value = {
        ...overridesDark.value,
        [tokenVar]: hex,
      }
    }
    applyDom()
    persist()
  }

  function resetToken(mode: 'light' | 'dark' | 'both', tokenVar: ThemeColorToken['var']) {
    if (mode === 'light' || mode === 'both') {
      const next = { ...overridesLight.value }
      delete next[tokenVar]
      overridesLight.value = next
    }
    if (mode === 'dark' || mode === 'both') {
      const next = { ...overridesDark.value }
      delete next[tokenVar]
      overridesDark.value = next
    }
    applyDom()
    persist()
  }

  function resetAll() {
    overridesLight.value = {}
    overridesDark.value = {}
    removeStyleTag()
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function reportMarkdown(): string {
    const lines: string[] = []
    const d = new Date().toISOString()
    lines.push('# Portfolio theme color report')
    lines.push('')
    lines.push(`Generated (ISO): ${d}`)
    lines.push('')
    lines.push(
      'Paste this whole block into your assistant. It lists CSS variables and the hex values '
        + 'currently applied by Theme Lab (defaults plus any overrides).',
    )
    lines.push('')
    lines.push('## Light (`:root`)')
    lines.push('')
    lines.push('```')
    for (const t of THEME_COLOR_TOKENS) {
      const base = t.light
      const cur = effectiveLight.value[t.var]
      const tag = cur === base ? 'default' : 'overridden'
      lines.push(`${t.var}: ${cur}  /* ${t.label} — ${tag} */`)
    }
    lines.push('```')
    lines.push('')
    lines.push('## Dark (`.dark`)')
    lines.push('')
    lines.push('```')
    for (const t of THEME_COLOR_TOKENS) {
      const base = t.dark
      const cur = effectiveDark.value[t.var]
      const tag = cur === base ? 'default' : 'overridden'
      lines.push(`${t.var}: ${cur}  /* ${t.label} — ${tag} */`)
    }
    lines.push('```')
    lines.push('')
    lines.push('## Raw JSON (machine-readable)')
    lines.push('')
    lines.push('```json')
    lines.push(
      JSON.stringify(
        {
          generatedAt: d,
          light: effectiveLight.value,
          dark: effectiveDark.value,
        },
        null,
        2,
      ),
    )
    lines.push('```')
    return lines.join('\n')
  }

  return {
    tokens: THEME_COLOR_TOKENS,
    overridesLight,
    overridesDark,
    effectiveLight,
    effectiveDark,
    normalizeHex,
    setColor,
    resetToken,
    resetAll,
    hydrateFromStorage,
    applyDom,
    reportMarkdown,
  }
}
