import { onMounted, onUnmounted, type Ref } from 'vue'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Magnetic cursor pull — element translates toward pointer within a radius.
 * Disabled for `prefers-reduced-motion` and coarse pointer.
 */
export function useMagneticHover(
  elRef: Ref<HTMLElement | null>,
  options: { maxPx?: number; radius?: number; lerpK?: number } = {},
) {
  const maxPx = options.maxPx ?? 5
  const radius = options.radius ?? 52
  const lerpK = options.lerpK ?? 0.18

  let targetX = 0
  let targetY = 0
  let curX = 0
  let curY = 0
  let rafId = 0
  let disabled = true
  let inside = false

  let mqMotion: MediaQueryList | null = null
  let mqPointer: MediaQueryList | null = null

  function updateDisabled() {
    if (!import.meta.client) return
    const reduced = mqMotion?.matches ?? false
    const coarse = mqPointer?.matches ?? false
    disabled = reduced || coarse
    if (disabled) reset()
  }

  function reset() {
    targetX = 0
    targetY = 0
    if (!rafId) rafId = requestAnimationFrame(tick)
  }

  function applyTransform() {
    const el = elRef.value
    if (!el) return
    if (curX === 0 && curY === 0 && targetX === 0 && targetY === 0) {
      el.style.removeProperty('transform')
      return
    }
    el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`
  }

  function tick() {
    rafId = 0
    curX = lerp(curX, targetX, lerpK)
    curY = lerp(curY, targetY, lerpK)
    applyTransform()

    const err = Math.hypot(targetX - curX, targetY - curY)
    const moving = err > 0.05 || Math.abs(curX) > 0.05 || Math.abs(curY) > 0.05
    if (moving) rafId = requestAnimationFrame(tick)
  }

  function ensureLoop() {
    if (rafId === 0) rafId = requestAnimationFrame(tick)
  }

  function onPointerMove(e: PointerEvent) {
    if (disabled || !elRef.value) return
    const r = elRef.value.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)

    if (dist <= radius) {
      inside = true
      const strength = 1 - dist / radius
      targetX = Math.max(-maxPx, Math.min(maxPx, dx * strength * (maxPx / (radius * 0.5))))
      targetY = Math.max(-maxPx, Math.min(maxPx, dy * strength * (maxPx / (radius * 0.5))))
    } else if (inside) {
      inside = false
      reset()
    }
    ensureLoop()
  }

  function onPointerLeave() {
    inside = false
    reset()
  }

  onMounted(() => {
    if (!import.meta.client) return
    mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqPointer = window.matchMedia('(pointer: coarse)')
    updateDisabled()
    mqMotion.addEventListener('change', updateDisabled)
    mqPointer.addEventListener('change', updateDisabled)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave, { passive: true })
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    mqMotion?.removeEventListener('change', updateDisabled)
    mqPointer?.removeEventListener('change', updateDisabled)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
    const el = elRef.value
    if (el) el.style.removeProperty('transform')
  })
}
