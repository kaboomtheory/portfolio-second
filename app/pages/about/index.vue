<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { aboutMe } = useMockContent()

useHead({ title: 'About' })
</script>

<template>
  <div class="page-content">
    <!-- Hero Section -->
    <section class="page-section reveal-up pt-6 md:pt-10">
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        <div class="space-y-8">
          <div class="space-y-2">
            <TextReveal
              tag="h1"
              :text="aboutMe.name"
              :delay="0.1"
              class="text-5xl font-bold tracking-tight md:text-7xl leading-[0.9]"
              :style="{ color: 'var(--fg-primary)' }"
            />
            <TextReveal
              tag="p"
              :text="aboutMe.role"
              :delay="0.3"
              class="text-2xl md:text-3xl font-light"
              :style="{ color: 'var(--fg-secondary)' }"
            />
          </div>
          
          <p class="text-xl md:text-2xl leading-relaxed text-balance" :style="{ color: 'var(--fg-primary)' }">
            {{ aboutMe.intro }}
          </p>

          <div class="flex flex-wrap gap-4 text-sm font-medium tracking-wide uppercase" :style="{ color: 'var(--fg-muted)' }">
            <span class="flex items-center gap-2">
              <Icon icon="lucide:map-pin" />
              {{ aboutMe.location }}
            </span>
            <span class="opacity-50">•</span>
            <span>Available for freelance</span>
          </div>
        </div>

        <div class="relative aspect-[4/5] w-full overflow-hidden rounded-sm md:aspect-square lg:aspect-[4/5]">
          <img
            :src="aboutMe.avatar"
            :alt="aboutMe.name"
            class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="eager"
          >
          <div class="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10" />
        </div>
      </div>
    </section>

    <!-- Stats Row -->
    <section class="page-section reveal-up border-y border-[var(--border)] py-8 md:py-12">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div
          v-for="fact in aboutMe.facts"
          :key="fact.label"
          class="text-center md:text-left"
        >
          <p class="text-4xl font-bold tabular-nums md:text-5xl" :style="{ color: 'var(--accent)' }">
            {{ fact.value }}
          </p>
          <p class="mt-2 text-xs uppercase tracking-[0.15em] font-medium" :style="{ color: 'var(--fg-muted)' }">
            {{ fact.label }}
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="page-section reveal-up">
      <div class="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
        <h2 class="text-xl font-medium md:text-2xl" :style="{ color: 'var(--fg-primary)' }">
          Background
        </h2>
        <div class="space-y-6 text-lg leading-relaxed md:text-xl" :style="{ color: 'var(--fg-secondary)' }">
          <p v-for="(paragraph, index) in aboutMe.story" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <!-- Capabilities Section (Skills & Tools) -->
    <section class="page-section reveal-up">
      <div class="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
        <h2 class="text-xl font-medium md:text-2xl" :style="{ color: 'var(--fg-primary)' }">
          Capabilities
        </h2>
        
        <div class="space-y-12">
          <!-- Skills Grid -->
          <div class="grid gap-8 sm:grid-cols-2">
            <div v-for="skillGroup in aboutMe.skills" :key="skillGroup.category" class="space-y-4">
              <h3 class="text-sm font-semibold uppercase tracking-[0.1em]" :style="{ color: 'var(--fg-muted)' }">
                {{ skillGroup.category }}
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="skill in skillGroup.items"
                  :key="skill"
                  class="text-base"
                  :style="{ color: 'var(--fg-secondary)' }"
                >
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Tools List -->
          <div class="space-y-4 pt-8 border-t border-[var(--border)]">
            <h3 class="text-sm font-semibold uppercase tracking-[0.1em]" :style="{ color: 'var(--fg-muted)' }">
              Toolkit
            </h3>
            <div class="flex flex-wrap gap-x-6 gap-y-2">
              <span
                v-for="tool in aboutMe.tools"
                :key="tool"
                class="text-base"
                :style="{ color: 'var(--fg-secondary)' }"
              >
                {{ tool }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interests Grid -->
    <section class="page-section reveal-up">
      <div class="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
        <h2 class="text-xl font-medium md:text-2xl" :style="{ color: 'var(--fg-primary)' }">
          Offline
        </h2>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <SpotlightCard
            v-for="interest in aboutMe.interests"
            :key="interest.label"
            class="aspect-square flex flex-col items-center justify-center gap-3 p-4 text-center"
          >
            <Icon
              :icon="interest.icon"
              class="text-2xl relative z-10"
              :style="{ color: 'var(--accent)' }"
            />
            <span class="text-sm font-medium relative z-10" :style="{ color: 'var(--fg-secondary)' }">
              {{ interest.label }}
            </span>
          </SpotlightCard>
        </div>
      </div>
    </section>

    <!-- Connect Section -->
    <section class="page-section reveal-up pb-10">
      <div class="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
        <h2 class="text-xl font-medium md:text-2xl" :style="{ color: 'var(--fg-primary)' }">
          Connect
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <MagneticButton class="group">
            <a
              href="mailto:hello@example.com"
              class="flex items-center gap-3 text-lg transition-colors hover:text-[var(--accent)]"
              :style="{ color: 'var(--fg-primary)' }"
            >
              <span>hello@example.com</span>
              <Icon icon="lucide:arrow-up-right" class="text-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </MagneticButton>
          <div class="hidden sm:block w-px bg-[var(--border)] h-6 self-center mx-2" />
          <MagneticButton class="group">
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-3 text-lg transition-colors hover:text-[var(--accent)]"
              :style="{ color: 'var(--fg-primary)' }"
            >
              <span>LinkedIn</span>
              <Icon icon="lucide:arrow-up-right" class="text-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </MagneticButton>
          <div class="hidden sm:block w-px bg-[var(--border)] h-6 self-center mx-2" />
          <MagneticButton class="group">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-3 text-lg transition-colors hover:text-[var(--accent)]"
              :style="{ color: 'var(--fg-primary)' }"
            >
              <span>Twitter</span>
              <Icon icon="lucide:arrow-up-right" class="text-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  </div>
</template>
