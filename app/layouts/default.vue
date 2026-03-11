<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)

function lockBodyScroll(locked: boolean) {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = locked ? 'hidden' : ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    mobileOpen.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)

watch(mobileOpen, (open) => {
  lockBodyScroll(open)
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  lockBodyScroll(false)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="min-h-screen">
    <MobileHeader :is-open="mobileOpen" @toggle="mobileOpen = !mobileOpen" />

    <aside class="z-40 hidden h-auto p-0 md:fixed md:bottom-0 md:left-0 md:block md:h-screen md:w-64 md:p-4">
      <AppSidebar />
    </aside>

    <div class="mt-14 md:ml-64 md:mt-0">
      <div class="container mx-auto flex min-h-screen flex-col px-5 pb-6 pt-10 sm:px-6 md:max-w-[52rem] md:px-0 md:pt-12">
        <main class="flex-1">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[60] md:hidden"
      >
        <div
          class="absolute inset-0"
          :style="{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }"
          @click="mobileOpen = false"
        />
      </div>
    </Transition>

    <Transition name="sheet">
      <div
        v-if="mobileOpen"
        class="fixed inset-x-0 bottom-0 z-[70] max-h-[78vh] overflow-y-auto border-t p-4 pb-6 md:hidden"
        :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }"
      >
        <AppSidebar mobile @navigate="mobileOpen = false" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
