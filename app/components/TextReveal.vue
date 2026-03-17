<script setup lang="ts">
interface Props {
  text: string
  tag?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  delay: 0
})

const words = computed(() => props.text.split(' '))
</script>

<template>
  <component :is="tag" class="text-reveal">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true" class="flex flex-wrap gap-x-[0.25em] gap-y-1">
      <span
        v-for="(word, i) in words"
        :key="i"
        class="inline-block animate-reveal"
        :style="{ animationDelay: `${delay + i * 0.08}s` }"
      >
        {{ word }}
      </span>
    </span>
  </component>
</template>

<style scoped>
@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-reveal {
  opacity: 0;
  animation: reveal 0.7s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
}
</style>
