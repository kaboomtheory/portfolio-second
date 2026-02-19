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
        class="inline-block overflow-hidden"
      >
        <span
          class="inline-block animate-reveal"
          :style="{ animationDelay: `${delay + i * 0.1}s` }"
        >
          {{ word }}
        </span>
      </span>
    </span>
  </component>
</template>

<style scoped>
@keyframes reveal {
  0% {
    transform: translateY(110%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-reveal {
  transform: translateY(110%);
  opacity: 0;
  animation: reveal 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
}
</style>
