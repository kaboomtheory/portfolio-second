import {
  onBeforeUnmount,
  onMounted,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type WatchStopHandle,
} from 'vue'

interface PausedProgressAnimationOptions {
  keyframes: MaybeRefOrGetter<Keyframe[]>
  progress: MaybeRefOrGetter<number>
  duration?: number
  respectReducedMotion?: boolean
}

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function usePausedProgressAnimation(
  elementRef: Ref<HTMLElement | null>,
  options: PausedProgressAnimationOptions,
) {
  const duration = options.duration ?? 1000
  const respectReducedMotion = options.respectReducedMotion ?? true

  let animation: Animation | null = null
  let stopProgressWatch: WatchStopHandle | null = null
  let stopKeyframesWatch: WatchStopHandle | null = null
  let stopElementWatch: WatchStopHandle | null = null
  let motionQuery: MediaQueryList | null = null

  const isReducedMotion = () => respectReducedMotion && Boolean(motionQuery?.matches)

  const applyProgress = () => {
    if (!animation) return
    animation.currentTime = clampProgress(toValue(options.progress)) * duration
  }

  const cancelAnimation = () => {
    animation?.cancel()
    animation = null
  }

  const createAnimation = () => {
    cancelAnimation()
    const element = elementRef.value
    if (!element || typeof element.animate !== 'function' || isReducedMotion()) return

    animation = element.animate(toValue(options.keyframes), {
      duration,
      easing: 'linear',
      fill: 'both',
    })
    animation.pause()
    applyProgress()
  }

  const syncMotionPreference = () => {
    if (isReducedMotion()) {
      cancelAnimation()
      return
    }
    createAnimation()
  }

  onMounted(() => {
    if (!import.meta.client) return

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', syncMotionPreference)

    stopProgressWatch = watch(
      () => toValue(options.progress),
      () => applyProgress(),
      { flush: 'post' },
    )

    stopKeyframesWatch = watch(
      () => JSON.stringify(toValue(options.keyframes)),
      () => createAnimation(),
    )

    stopElementWatch = watch(
      elementRef,
      () => createAnimation(),
      { immediate: true, flush: 'post' },
    )
  })

  onBeforeUnmount(() => {
    stopProgressWatch?.()
    stopKeyframesWatch?.()
    stopElementWatch?.()
    motionQuery?.removeEventListener('change', syncMotionPreference)
    cancelAnimation()
  })
}
