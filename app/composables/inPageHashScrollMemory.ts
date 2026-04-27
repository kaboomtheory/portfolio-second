/**
 * Browsers (and the History API) can scroll to `#fragment` the instant the URL
 * changes. We snap back to the pre-navigation offset before running Lenis/rAF
 * so the only motion is the smooth scroll.
 */
let preHashScrollY: number | null = null

export function markInPageHashScrollY() {
  if (!import.meta.client) return
  preHashScrollY = window.scrollY
}

export function takeInPageHashScrollY(): number | null {
  const y = preHashScrollY
  preHashScrollY = null
  return y
}
