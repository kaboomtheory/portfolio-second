/**
 * Negative Y offset for programmatic scroll-to-hash (see `app/app.vue`).
 * Matches `scroll-margin-top: var(--scroll-anchor-offset)` in `main.css`.
 */
export function getScrollAnchorOffsetPx(): number {
  if (!import.meta.client) {
    return -104
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--scroll-anchor-offset')
    .trim()
  if (!raw) {
    return -104
  }
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:absolute;visibility:hidden;pointer-events:none;height:var(--scroll-anchor-offset);width:0'
  document.body.appendChild(probe)
  const px = probe.offsetHeight
  document.body.removeChild(probe)
  return -px
}
