import { onMounted, onUnmounted, type Ref, ref, watch } from 'vue'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/**
 * Subtle 3D tilt on project media from pointer position.
 * Disabled for `prefers-reduced-motion` and coarse pointer.
 */
export function useCardTilt(
  hostRef: Ref<HTMLElement | null>,
  tiltRef: Ref<HTMLElement | null>,
  options: { maxDeg?: number; lerp?: number } = {},
) {
  const maxDeg = options.maxDeg ?? 2.5
  const lerpK = options.lerp ?? 0.16

  const targetX = ref(0)
  const targetY = ref(0)
  let curX = 0
  let curY = 0
  let rafId = 0
  let disabled = true

  let mqMotion: MediaQueryList | null = null
  let mqPointer: MediaQueryList | null = null

  function updateDisabled() {
    if (!import.meta.client) return
    const reduced = mqMotion?.matches ?? false
    const coarse = mqPointer?.matches ?? false
    disabled = reduced || coarse
    if (disabled) {
      targetX.value = 0
      targetY.value = 0
      curX = 0
      curY = 0
      applyTransform()
    }
  }

  function applyTransform() {
    const el = tiltRef.value
    if (!el) return
    if (disabled) {
      el.style.removeProperty('transform')
      return
    }
    el.style.transform = `perspective(720px) rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg)`
  }

  function tick() {
    rafId = 0
    if (disabled) return

    curX = lerp(curX, targetX.value, lerpK)
    curY = lerp(curY, targetY.value, lerpK)
    applyTransform()

    const err = Math.hypot(targetX.value - curX, targetY.value - curY)
    const still = err > 0.004 || Math.abs(curX) > 0.004 || Math.abs(curY) > 0.004
    if (still) rafId = requestAnimationFrame(tick)
  }

  function ensureLoop() {
    if (rafId !== 0) return
    rafId = requestAnimationFrame(tick)
  }

  function onPointerMove(e: PointerEvent) {
    if (disabled || !hostRef.value) return
    const r = hostRef.value.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    targetX.value = Math.max(-maxDeg, Math.min(maxDeg, -py * 2 * maxDeg))
    targetY.value = Math.max(-maxDeg, Math.min(maxDeg, px * 2 * maxDeg))
    ensureLoop()
  }

  function onPointerLeave() {
    targetX.value = 0
    targetY.value = 0
    ensureLoop()
  }

  function onPointerCancel() {
    onPointerLeave()
  }

  function attach(host: HTMLElement) {
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave, { passive: true })
    host.addEventListener('pointercancel', onPointerCancel, { passive: true })
  }

  function detach(host: HTMLElement) {
    host.removeEventListener('pointermove', onPointerMove)
    host.removeEventListener('pointerleave', onPointerLeave)
    host.removeEventListener('pointercancel', onPointerCancel)
  }

  onMounted(() => {
    if (!import.meta.client) return
    mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqPointer = window.matchMedia('(pointer: coarse)')
    updateDisabled()
    mqMotion.addEventListener('change', updateDisabled)
    mqPointer.addEventListener('change', updateDisabled)
  })

  let attachedHost: HTMLElement | null = null

  watch(
    hostRef,
    (el, prev) => {
      if (!import.meta.client) return
      if (prev) detach(prev)
      attachedHost = el
      if (el) attach(el)
    },
    { flush: 'post' },
  )

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    mqMotion?.removeEventListener('change', updateDisabled)
    mqPointer?.removeEventListener('change', updateDisabled)
    if (attachedHost) {
      detach(attachedHost)
      attachedHost = null
    }
  })
}
