<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { aboutMe } = useMockContent()

useHead({ title: 'About' })
</script>

<template>
  <div class="page-content">
    <section class="page-section reveal-up">
      <div class="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div class="space-y-12">
          <header class="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <img
              :src="aboutMe.avatar"
              :alt="aboutMe.name"
              loading="lazy"
              class="h-28 w-28 rounded-2xl object-cover"
            >
            <div class="space-y-2">
              <h1 class="text-4xl font-bold tracking-tight" :style="{ color: 'var(--fg-primary)' }">
                {{ aboutMe.name }}
              </h1>
              <p class="text-lg" :style="{ color: 'var(--fg-secondary)' }">{{ aboutMe.role }}</p>
              <p class="flex items-center gap-1.5 text-sm" :style="{ color: 'var(--fg-muted)' }">
                <Icon icon="lucide:map-pin" class="text-sm" />
                {{ aboutMe.location }}
              </p>
            </div>
          </header>

          <p class="text-xl font-medium leading-relaxed" :style="{ color: 'var(--fg-primary)' }">
            {{ aboutMe.intro }}
          </p>
        </div>

        <aside class="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div
            v-for="fact in aboutMe.facts"
            :key="fact.label"
            class="card-surface p-4 text-center"
          >
            <p class="text-2xl font-bold tabular-nums" :style="{ color: 'var(--accent)' }">
              {{ fact.value }}
            </p>
            <p class="mt-1 text-xs uppercase tracking-[0.08em]" :style="{ color: 'var(--fg-muted)' }">
              {{ fact.label }}
            </p>
          </div>
        </aside>
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Story</h2>
      <div class="space-y-4">
        <p
          v-for="(paragraph, index) in aboutMe.story"
          :key="index"
          class="max-w-2xl text-base leading-relaxed"
          :style="{ color: 'var(--fg-secondary)' }"
        >
          {{ paragraph }}
        </p>
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Skills</h2>
      <div class="grid gap-6 sm:grid-cols-3">
        <div
          v-for="skillGroup in aboutMe.skills"
          :key="skillGroup.category"
          class="space-y-3"
        >
          <h3
            class="text-sm font-semibold uppercase tracking-[0.08em]"
            :style="{ color: 'var(--fg-muted)' }"
          >
            {{ skillGroup.category }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="skill in skillGroup.items"
              :key="skill"
              class="flex items-center gap-2 text-sm"
              :style="{ color: 'var(--fg-secondary)' }"
            >
              <span class="h-1 w-1 rounded-full" :style="{ backgroundColor: 'var(--accent)' }" />
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Tools</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tool in aboutMe.tools"
          :key="tool"
          class="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
          :style="{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--fg-secondary)',
          }"
        >
          {{ tool }}
        </span>
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Interests</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <div
          v-for="interest in aboutMe.interests"
          :key="interest.label"
          class="card-surface flex flex-col items-center gap-2 p-4 text-center"
        >
          <Icon
            :icon="interest.icon"
            class="text-xl"
            :style="{ color: 'var(--accent)' }"
          />
          <span class="text-xs" :style="{ color: 'var(--fg-secondary)' }">
            {{ interest.label }}
          </span>
        </div>
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Connect</h2>
      <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <a
          href="mailto:hello@example.com"
          class="card-surface flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Icon icon="lucide:mail" class="text-lg" :style="{ color: 'var(--fg-muted)' }" />
          <span class="text-sm">hello@example.com</span>
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener"
          class="card-surface flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Icon icon="lucide:linkedin" class="text-lg" :style="{ color: 'var(--fg-muted)' }" />
          <span class="text-sm">LinkedIn</span>
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener"
          class="card-surface flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Icon icon="lucide:twitter" class="text-lg" :style="{ color: 'var(--fg-muted)' }" />
          <span class="text-sm">Twitter</span>
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener"
          class="card-surface flex items-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <Icon icon="lucide:github" class="text-lg" :style="{ color: 'var(--fg-muted)' }" />
          <span class="text-sm">GitHub</span>
        </a>
      </div>
    </section>
  </div>
</template>
