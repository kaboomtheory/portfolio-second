<script setup lang="ts">
import { profile } from '~/data/site'
import { useSanityAbout } from '~/composables/useSanityAbout'
import HomeStorySection from '~/components/home/HomeStorySection.vue'
import HomeExperienceCapabilitiesSection from '~/components/home/HomeExperienceCapabilitiesSection.vue'

const { aboutPage } = useSanityAbout()
const { aboutMe: fallbackAboutMe, experiences: fallbackExperiences } = useMockContent()

const hero = computed(() => {
  const fromCms = aboutPage.value?.hero
  if (fromCms) {
    return {
      name: fromCms.name,
      avatar: fromCms.avatar ?? fallbackAboutMe.avatar,
      availabilityText: fromCms.availabilityText || 'Available for freelance',
    }
  }
  return {
    name: fallbackAboutMe.name,
    avatar: fallbackAboutMe.avatar,
    availabilityText: 'Available for freelance',
  }
})

const story = computed(() =>
  aboutPage.value?.story?.length ? aboutPage.value.story : fallbackAboutMe.story,
)

const experienceItems = computed(() =>
  aboutPage.value?.experiences?.length ? aboutPage.value.experiences : fallbackExperiences,
)

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

const resumeHref = computed(() =>
  aboutPage.value?.resumeUrl || '/Bryan_Mendez_resume_2026-1.pdf',
)

const availabilityMailto = computed(() => `mailto:${profile.email}`)
const availabilityCtaLabel = computed(() =>
  (hero.value.availabilityText || 'Available for freelance').toLocaleUpperCase('en-US'),
)

const { siteUrl } = useRuntimeConfig().public
const aboutCanonicalUrl = `${String(siteUrl).replace(/\/$/, '')}/about`
const aboutOgImage = `${String(siteUrl).replace(/\/$/, '')}/og-default.png`
const aboutDescription = `The story, experience, and capabilities behind ${profile.name} — Visual Designer based in ${profile.location}.`

useHead({
  title: 'About',
  link: [{ rel: 'canonical', href: aboutCanonicalUrl }],
})

useSeoMeta({
  description: aboutDescription,
  ogTitle: 'About — Bryan X. Mendez',
  ogDescription: aboutDescription,
  ogUrl: aboutCanonicalUrl,
  ogImage: aboutOgImage,
  twitterTitle: 'About — Bryan X. Mendez',
  twitterDescription: aboutDescription,
  twitterImage: aboutOgImage,
})
</script>

<template>
  <div class="page-content content-flow">
    <HomeStorySection
      :name="hero.name"
      :avatar="hero.avatar ?? ''"
      :story="story"
      :resume-href="resumeHref"
      :availability-mailto="availabilityMailto"
      :availability-cta-label="availabilityCtaLabel"
    />
    <HomeExperienceCapabilitiesSection
      :experience-items="experienceItems"
      :groups="groupedCapabilities"
    />
  </div>
</template>
