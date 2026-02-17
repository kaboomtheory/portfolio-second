import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Tracks how centred an element is within the viewport and returns
 * a reactive `progress` value (0 → 1 → 0).
 *
 * progress = 1  when the element centre is exactly at the viewport centre
 * progress = 0  when the element centre is at (or beyond) the viewport edges
 *
 * Uses a scroll listener + rAF for smooth, efficient updates.
 */
export function useScrollExpand(wrapperRef: Ref<HTMLElement | null>) {
    const progress = ref(0)
    let ticking = false

    function calculate() {
        const el = wrapperRef.value
        if (!el) {
            progress.value = 0
            ticking = false
            return
        }

        const rect = el.getBoundingClientRect()
        const viewportH = window.innerHeight

        // Centre of the element relative to the viewport
        const elCentre = rect.top + rect.height / 2

        // How far the element centre is from the viewport centre (0 = dead-centre)
        const distFromCentre = Math.abs(elCentre - viewportH / 2)

        // Element is "in range" when its centre is within half the viewport
        // of the viewport centre. This gives a generous activation zone.
        const activationRange = viewportH * 0.6
        const raw = 1 - Math.min(distFromCentre / activationRange, 1)

        // Smooth ease for a natural feel
        const eased = raw * raw * (3 - 2 * raw) // smoothstep

        progress.value = Math.max(0, Math.min(1, eased))
        ticking = false
    }

    function onScroll() {
        if (!ticking) {
            ticking = true
            requestAnimationFrame(calculate)
        }
    }

    onMounted(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })
        // Initial calculation
        requestAnimationFrame(calculate)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
    })

    return { progress }
}
