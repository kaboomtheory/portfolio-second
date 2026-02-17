<template>
  <footer class="mt-10 border-t pt-5 text-xs" :style="{ borderColor: 'var(--border)', color: 'var(--fg-muted)' }">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span>© {{ new Date().getFullYear() }} Avery Holt</span>
      <span>Designed & built with Vue + Nuxt</span>
    </div>
  </footer>
</template>
