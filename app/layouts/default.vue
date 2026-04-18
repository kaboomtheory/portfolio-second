<script setup lang="ts">
const route = useRoute()
const isDashboard = computed(() => route.path === '/')
/** Same horizontal padding / max content width as home (navbar + main column). */
const usesHomeContentShell = computed(
  () => isDashboard.value || /^\/projects\//.test(route.path),
)
</script>

<template>
  <div :class="isDashboard ? 'h-dvh overflow-y-auto' : 'min-h-screen'">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppNavbar />

    <div
      :class="
        isDashboard
          ? 'h-full pt-32 md:pt-28'
          : usesHomeContentShell
            ? 'pt-32 md:pt-28'
            : 'pt-28 md:pt-24'
      "
    >
      <div
        :class="[
          'container mx-auto',
          isDashboard
            ? 'flex h-full max-w-none flex-col px-4 pb-4 sm:px-5 md:px-6'
            : usesHomeContentShell
              ? 'flex min-h-screen max-w-none flex-col px-4 pb-4 sm:px-5 md:px-6'
              : 'flex min-h-screen flex-col px-5 pb-6 sm:px-6 md:max-w-[72rem] md:px-8',
        ]"
      >
        <main
          id="main-content"
          tabindex="-1"
          :class="isDashboard ? 'min-h-0 flex-1' : 'flex-1'"
        >
          <div
            v-if="usesHomeContentShell && !isDashboard"
            class="mx-auto w-full max-w-[108rem]"
          >
            <slot />
          </div>
          <slot v-else />
        </main>
        <AppFooter v-if="!isDashboard" />
      </div>
    </div>

    <BackToTop v-if="!isDashboard" />
  </div>
</template>
