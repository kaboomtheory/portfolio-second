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
  <div class="bento-page min-h-0 min-w-0 flex-1">
    <div class="bento bento--stretch" :class="bentoClass">
      <div class="bento-cell bento-cell--profile">
        <DashboardProfileTile
          class="bento-cell__fill"
          section-number="01"
          :hero-title="heroTitle"
          :hero-taglines="heroTaglines"
          :story="story"
        />
      </div>

      <div v-if="featuredRole" class="bento-cell bento-cell--featured">
        <DashboardFeaturedRole
          class="bento-cell__fill"
          section-number="02"
          :role="featuredRole"
          :history-items="historyItems"
        />
      </div>

      <div class="bento-cell bento-cell--capabilities">
        <DashboardCapabilitiesTile
          class="bento-cell__fill"
          section-number="03"
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
          class="bento-cell__fill bento-cell__fill--proj-tile"
          section-number="04"
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
  align-items: stretch;
  width: 100%;
  max-width: 108rem;
  margin-inline: auto;
  gap: 0.375rem;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
}

.bento--stretch {
  flex: 1 1 0%;
  min-height: 0;
  max-height: 100%;
}

/*
 * Desktop mosaic (≥1024px): 12×3
 *  - Row 1: profile (4 cols), featured (4), capabilities (4). Profile row-spans 1–2.
 *  - Row 2: profile continues; status ticker (8 cols) or empty cells when no ticker.
 *  - Row 3: projects (12 cols), single track; 1.5fr vs row 1’s 1fr for a taller carousel band.
 */
.bento--with-ticker {
  grid-template-rows:
    minmax(0, 1fr)
    minmax(0, auto)
    minmax(0, 1.5fr);
  grid-template-areas:
    'profile profile profile profile featured featured featured featured caps caps caps caps'
    'profile profile profile profile ticker ticker ticker ticker ticker ticker ticker ticker'
    'proj proj proj proj proj proj proj proj proj proj proj proj';
}

.bento--no-ticker {
  grid-template-rows:
    minmax(0, 1fr)
    minmax(0, auto)
    minmax(0, 1.5fr);
  grid-template-areas:
    'profile profile profile profile featured featured featured featured caps caps caps caps'
    'profile profile profile profile . . . . . . . .'
    'proj proj proj proj proj proj proj proj proj proj proj proj';
}

@media (max-width: 1199px) {
  .bento {
    gap: 0.3rem;
  }
}

/* Tablet: 6-col compressed mosaic */
@media (max-width: 1023px) {
  .bento {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .bento--with-ticker {
    grid-template-rows:
      minmax(0, 1fr)
      minmax(0, 1.05fr)
      minmax(0, auto)
      minmax(0, 1.5fr);
    grid-template-areas:
      'profile profile profile profile featured featured'
      'caps caps caps caps caps caps'
      'ticker ticker ticker ticker ticker ticker'
      'proj proj proj proj proj proj';
  }

  .bento--no-ticker {
    grid-template-rows:
      minmax(0, 1fr)
      minmax(0, 1.05fr)
      minmax(0, 1.5fr);
    grid-template-areas:
      'profile profile profile profile featured featured'
      'caps caps caps caps caps caps'
      'proj proj proj proj proj proj';
  }
}

/* Mobile: single-column stack */
@media (max-width: 639px) {
  .bento {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }

  .bento--with-ticker {
    grid-template-rows:
      minmax(0, 1.1fr)
      minmax(0, 0.9fr)
      minmax(0, 0.85fr)
      minmax(0, auto)
      minmax(0, 1.5fr);
    grid-template-areas:
      'profile'
      'featured'
      'caps'
      'ticker'
      'proj';
  }

  .bento--no-ticker {
    grid-template-rows:
      minmax(0, 1.1fr)
      minmax(0, 0.9fr)
      minmax(0, 0.85fr)
      minmax(0, 1.5fr);
    grid-template-areas:
      'profile'
      'featured'
      'caps'
      'proj';
  }
}

.bento-cell {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}

.bento-cell__fill {
  flex: 1 1 0%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  max-height: 100%;
  height: 100%;
}

.bento-cell__fill--proj-tile {
  flex: 1 1 0%;
  min-height: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
}

.bento-cell--profile { grid-area: profile; }
.bento-cell--featured { grid-area: featured; }

.bento-cell--capabilities { grid-area: caps; }
.bento-cell--ticker { grid-area: ticker; }
.bento-cell--proj {
  grid-area: proj;
  min-height: 0;
}
</style>
