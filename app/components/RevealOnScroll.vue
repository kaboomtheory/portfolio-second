<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Delay before reveal starts (ms), for staggered choreography */
    delay?: number
    threshold?: number
    rootMargin?: string
  }>(),
  {
    delay: 0,
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px',
  },
)

const { elementRef, isVisible } = useScrollReveal({
  delay: props.delay,
  threshold: props.threshold,
  rootMargin: props.rootMargin,
  once: true,
})
</script>

<template>
  <section
    ref="elementRef"
    class="reveal-on-scroll"
    :class="{ 'reveal-on-scroll--visible': isVisible }"
  >
    <slot />
  </section>
</template>
