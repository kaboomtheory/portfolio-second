import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

interface StyleRuleDefinition {
  id: string
  selector: string
  declarations: Record<string, string | number | undefined>
}

const STYLE_ATTR = 'data-csp-style'
let styleEl: HTMLStyleElement | null = null
let sheet: CSSStyleSheet | null = null
const ruleIndexes = new Map<string, number>()

function getNonce(): string {
  return useState<string>('csp-nonce', () => '').value
}

function ensureStyleSheet(): CSSStyleSheet | null {
  if (!import.meta.client) return null
  if (sheet) return sheet

  styleEl = document.createElement('style')
  styleEl.setAttribute('data-csp-dynamic-styles', 'true')

  const nonce = getNonce()
  if (nonce) {
    styleEl.setAttribute('nonce', nonce)
  }

  document.head.appendChild(styleEl)
  sheet = styleEl.sheet as CSSStyleSheet | null
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

export function useCspTargetStyle(
  declarations: MaybeRefOrGetter<Record<string, string | number | undefined>>,
) {
  const styleId = useId().replace(/:/g, '')

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
