import type { InjectionKey, Ref } from 'vue'
import { onUnmounted, ref, watch } from 'vue'

const SECTION_ORDER = ['intro', 'work', 'story', 'status', 'experience', 'contact'] as const

export interface ActiveSectionSignal {
  activeSectionId: Ref<string>
  signalVarName: Ref<string>
}

export const activeSectionSignalKey: InjectionKey<ActiveSectionSignal> = Symbol('activeSectionSignal')

const SIGNAL_MAP: Record<string, string> = {
  intro: '--signal-sky',
  work: '--signal-mint',
  story: '--signal-peach',
  status: '--signal-blush',
  experience: '--signal-mint',
  contact: '--signal-mint',
}

let sharedObserver: IntersectionObserver | null = null
const visibleSections = new Set<string>()
let connectGeneration = 0

function pickMostVisible(activeSectionId: Ref<string>, signalVarName: Ref<string>) {
  for (const id of SECTION_ORDER) {
    if (visibleSections.has(id)) {
      activeSectionId.value = id
      signalVarName.value = SIGNAL_MAP[id] ?? '--signal-sky'
      return
    }
  }
  activeSectionId.value = 'intro'
  signalVarName.value = '--signal-sky'
}

function disconnectObserver() {
  sharedObserver?.disconnect()
  sharedObserver = null
  visibleSections.clear()
}

/**
 * Tracks which homepage section is most visible and maps it to a `--signal-*` token
 * for ambient layers (ScrollDriftLayer). Observers attach only on `/` after the DOM
 * is ready (handles layout-then-page mount order and SPA navigations).
 *
 * Call once from `default.vue` and `provide(activeSectionSignalKey, …)` so
 * `ScrollDriftLayer` can `inject` a single shared instance.
 */
export function useActiveSectionSignal(): ActiveSectionSignal {
  const route = useRoute()
  const activeSectionId = ref<string>('intro')
  const signalVarName = ref<string>('--signal-sky')

  function onIntersect(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      const id = (entry.target as HTMLElement).id
      if (!id) continue
      if (entry.isIntersecting) visibleSections.add(id)
      else visibleSections.delete(id)
    }
    pickMostVisible(activeSectionId, signalVarName)
  }

  function observeHomeSections(gen: number, attempt = 0) {
    if (!import.meta.client) return
    if (route.path !== '/') {
      disconnectObserver()
      activeSectionId.value = 'intro'
      signalVarName.value = '--signal-sky'
      return
    }

    const intro = document.getElementById('intro')
    if (!intro) {
      if (attempt > 120) return
      requestAnimationFrame(() => {
        if (gen !== connectGeneration) return
        observeHomeSections(gen, attempt + 1)
      })
      return
    }

    disconnectObserver()
    sharedObserver = new IntersectionObserver(onIntersect, { threshold: 0.15 })

    for (const id of SECTION_ORDER) {
      const el = document.getElementById(id)
      if (el) sharedObserver.observe(el)
    }
    pickMostVisible(activeSectionId, signalVarName)
  }

  function scheduleConnect() {
    if (!import.meta.client) return
    connectGeneration += 1
    const gen = connectGeneration
    nextTick(() => {
      requestAnimationFrame(() => observeHomeSections(gen))
    })
  }

  watch(
    () => route.path,
    () => {
      disconnectObserver()
      scheduleConnect()
    },
    { flush: 'post' },
  )

  if (import.meta.client) {
    scheduleConnect()
  }

  onUnmounted(() => {
    connectGeneration += 1
    disconnectObserver()
  })

  return { activeSectionId, signalVarName }
}
