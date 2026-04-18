<script setup lang="ts">
const { homeHero, aboutMe: fallbackAboutMe, experiences: fallbackExperiences } = useMockContent()
const { orderedProjects, loading, homePage } = useSanityIndexBundle()
const { statusItems } = useSanityStatus()
const { aboutPage } = useSanityAbout()

const heroTitle = computed(() => homePage.value?.hero.title || homeHero.title)
const heroTaglines = computed(() =>
  homePage.value?.hero.taglines?.length ? homePage.value.hero.taglines : homeHero.taglines,
)
const hasTicker = computed(() => (statusItems.value?.length ?? 0) > 0)

const story = computed(() =>
  aboutPage.value?.story?.length ? aboutPage.value.story : fallbackAboutMe.story,
)

const experienceItems = computed(() =>
  aboutPage.value?.experiences?.length ? aboutPage.value.experiences : fallbackExperiences,
)

const featuredRole = computed(() => experienceItems.value[0] ?? null)
const historyItems = computed(() => experienceItems.value.slice(1))

const capabilities = computed(() => {
  if (aboutPage.value?.capabilities?.length) return aboutPage.value.capabilities
  return [
    ...fallbackAboutMe.skills.flatMap((g) =>
      g.items.map((name) => ({ name, category: g.category })),
    ),
    ...fallbackAboutMe.tools.map((name) => ({ name, category: 'Software' })),
  ]
})

const groupedCapabilities = computed(() => {
  const groups: Record<string, string[]> = {}
  for (const cap of capabilities.value) {
    (groups[cap.category] ??= []).push(cap.name)
  }
  return Object.entries(groups).map(([category, items]) => ({ category, items }))
})

const bentoClass = computed(() =>
  hasTicker.value ? 'bento--with-ticker' : 'bento--no-ticker',
)

useHead({
  title: 'Home',
})
</script>

<template>
  <div class="bento-page">
    <div class="bento" :class="bentoClass">
      <div class="bento-cell bento-cell--profile">
        <DashboardProfileTile
          class="bento-cell__fill"
          :hero-title="heroTitle"
          :hero-taglines="heroTaglines"
          :story="story"
        />
      </div>

      <div v-if="featuredRole" class="bento-cell bento-cell--featured">
        <DashboardFeaturedRole
          class="bento-cell__fill"
          :role="featuredRole"
          :history-items="historyItems"
        />
      </div>

      <div class="bento-cell bento-cell--capabilities">
        <DashboardCapabilitiesTile
          class="bento-cell__fill"
          :grouped-capabilities="groupedCapabilities"
        />
      </div>

      <div v-if="hasTicker" class="bento-cell bento-cell--ticker">
        <DashboardStatusTicker
          class="bento-cell__fill w-full min-h-0"
          :status-items="statusItems"
        />
      </div>

      <div class="bento-cell bento-cell--proj">
        <DashboardProjectsTile
          class="bento-cell__fill"
          :projects="orderedProjects"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  height: 100%;
  min-height: 0;
  width: 100%;
  max-width: 108rem;
  margin-inline: auto;
  gap: 0.75rem;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/*
 * Desktop mosaic (≥1024px). Offsets are the whole point:
 *  - middle column (featured + history) spans three rows as one cell
 *  - right column is capabilities only (availability/contact lives in the navbar on home)
 *  - projects spans three named rows (`proj`) so the strip fits full cards
 */
.bento--with-ticker {
  grid-template-rows:
    minmax(0, 0.48fr)
    minmax(0, 0.8fr)
    minmax(0, 0.92fr)
    auto
    minmax(0, 1.2fr)
    minmax(0, 1.2fr)
    minmax(0, 1.2fr);
  grid-template-areas:
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'ticker ticker ticker ticker ticker ticker ticker ticker ticker ticker ticker ticker'
    'proj proj proj proj proj proj proj proj proj proj proj proj'
    'proj proj proj proj proj proj proj proj proj proj proj proj'
    'proj proj proj proj proj proj proj proj proj proj proj proj';
}

.bento--no-ticker {
  grid-template-rows:
    minmax(0, 0.5fr)
    minmax(0, 0.82fr)
    minmax(0, 0.95fr)
    minmax(0, 1.2fr)
    minmax(0, 1.2fr)
    minmax(0, 1.2fr);
  grid-template-areas:
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'profile profile profile profile profile featured featured featured featured caps caps caps'
    'proj proj proj proj proj proj proj proj proj proj proj proj'
    'proj proj proj proj proj proj proj proj proj proj proj proj'
    'proj proj proj proj proj proj proj proj proj proj proj proj';
}

@media (max-width: 1199px) {
  .bento {
    gap: 0.625rem;
  }
}

/* Tablet: 6-col compressed mosaic */
@media (max-width: 1023px) {
  .bento {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-auto-rows: auto;
  }

  .bento--with-ticker,
  .bento--no-ticker {
    grid-template-rows: unset;
  }

  .bento--with-ticker {
    grid-template-areas:
      'profile profile profile profile featured featured'
      'profile profile profile profile featured featured'
      'caps caps caps caps caps caps'
      'ticker ticker ticker ticker ticker ticker'
      'proj proj proj proj proj proj';
  }

  .bento--no-ticker {
    grid-template-areas:
      'profile profile profile profile featured featured'
      'profile profile profile profile featured featured'
      'caps caps caps caps caps caps'
      'proj proj proj proj proj proj';
  }
}

/* Mobile: single-column stack */
@media (max-width: 639px) {
  .bento {
    grid-template-columns: minmax(0, 1fr);
  }

  .bento--with-ticker {
    grid-template-areas:
      'profile'
      'featured'
      'caps'
      'ticker'
      'proj';
  }

  .bento--no-ticker {
    grid-template-areas:
      'profile'
      'featured'
      'caps'
      'proj';
  }
}

.bento-cell {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
}

.bento-cell__fill {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
}

.bento-cell--profile { grid-area: profile; }
.bento-cell--featured { grid-area: featured; }

.bento-cell--capabilities { grid-area: caps; }
.bento-cell--ticker { grid-area: ticker; }
.bento-cell--proj {
  grid-area: proj;
  min-height: clamp(15rem, 34vh, 24rem);
}

@media (max-width: 1023px) {
  .bento-cell--proj {
    min-height: clamp(16rem, 42vh, 28rem);
  }
}

@media (max-width: 639px) {
  .bento-cell--proj {
    min-height: clamp(14rem, 38vh, 22rem);
  }
}
</style>
