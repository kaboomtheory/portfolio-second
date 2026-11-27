import { onBeforeUnmount, onMounted, useId, watchEffect } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

interface StyleRuleDefinition {
  id: string
  selector: string
  declarations: Record<string, string | number | undefined>
}

const STYLE_ATTR = 'data-csp-style'
let sheet: CSSStyleSheet | null = null
const ruleIndexes = new Map<string, number>()

/**
 * Rules live in a constructed stylesheet adopted by the document. Unlike a
 * script-created <style> element, it is not subject to CSP `style-src`, so it
 * works with the hash-based policy (no nonce needed).
 */
function ensureStyleSheet(): CSSStyleSheet | null {
  if (import.meta.env.SSR) return null
  if (sheet) return sheet

  sheet = new CSSStyleSheet()
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  return sheet
}

function serializeDeclarations(declarations: Record<string, string | number | undefined>): string {
  return Object.entries(declarations)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([property, value]) => `${property}: ${String(value)};`)
    .join(' ')
}

function syncRuleIndexes(fromIndex: number) {
  for (const [id, index] of ruleIndexes.entries()) {
    if (index > fromIndex) {
      ruleIndexes.set(id, index - 1)
    }
  }
}

function removeRule(id: string) {
  const activeSheet = ensureStyleSheet()
  const index = ruleIndexes.get(id)
  if (!activeSheet || index == null) return

  activeSheet.deleteRule(index)
  ruleIndexes.delete(id)
  syncRuleIndexes(index)
}

function upsertRule(rule: StyleRuleDefinition) {
  const activeSheet = ensureStyleSheet()
  if (!activeSheet) return

  const cssText = serializeDeclarations(rule.declarations)
  if (!cssText) {
    removeRule(rule.id)
    return
  }

  const existingIndex = ruleIndexes.get(rule.id)
  if (existingIndex != null) {
    const existingRule = activeSheet.cssRules[existingIndex] as CSSStyleRule | undefined
    if (existingRule && existingRule.selectorText === rule.selector) {
      existingRule.style.cssText = cssText
      return
    }
    removeRule(rule.id)
  }

  const nextIndex = activeSheet.cssRules.length
  activeSheet.insertRule(`${rule.selector} { ${cssText} }`, nextIndex)
  ruleIndexes.set(rule.id, nextIndex)
}

/**
 * `scope` keeps ids unique across Astro islands. Each island is its own Vue
 * app, so useId() restarts in each one, and two islands sharing this sheet
 * would otherwise write to the same rule (the navbar pill and the first
 * project card did). Components in different islands pass different scopes.
 */
export function useCspTargetStyle(
  declarations: MaybeRefOrGetter<Record<string, string | number | undefined>>,
  scope = 'page',
) {
  const styleId = `${scope}-${useId().replace(/:/g, '')}`

  useManagedCspRules(() => [
    {
      id: styleId,
      selector: `[${STYLE_ATTR}="${styleId}"]`,
      declarations: toValue(declarations),
    },
  ])

  return {
    styleId,
    styleAttr: STYLE_ATTR,
  }
}

export function useManagedCspRules(
  rules: MaybeRefOrGetter<StyleRuleDefinition[]>,
) {
  let previousIds = new Set<string>()

  onMounted(() => {
    watchEffect(() => {
      const nextRules = toValue(rules)
      const nextIds = new Set(nextRules.map((rule) => rule.id))

      for (const rule of nextRules) {
        upsertRule(rule)
      }

      for (const id of previousIds) {
        if (!nextIds.has(id)) {
          removeRule(id)
        }
      }

      previousIds = nextIds
    })
  })

  onBeforeUnmount(() => {
    for (const id of previousIds) {
      removeRule(id)
    }
  })
}
