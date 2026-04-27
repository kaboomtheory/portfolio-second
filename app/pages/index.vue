<script setup lang="ts">
/** Ambient drift reads section signals via `activeSectionSignalKey` from `layouts/default.vue`. */
import { socialLinks, profile } from '~/data/site'
import { useSanityAbout } from '~/composables/useSanityAbout'
import { useSanityStatus } from '~/composables/useSanityStatus'
import HomeIntroSection from '~/components/home/HomeIntroSection.vue'
import HomeWorkSection from '~/components/home/HomeWorkSection.vue'
import HomeStorySection from '~/components/home/HomeStorySection.vue'
import HomeExperienceCapabilitiesSection from '~/components/home/HomeExperienceCapabilitiesSection.vue'
import HomeStatusSection from '~/components/home/HomeStatusSection.vue'
import HomeContactSection from '~/components/home/HomeContactSection.vue'
import GrainBackdrop from '~/components/GrainBackdrop.vue'

const { homeHero, aboutMe: fallbackAboutMe, experiences: fallbackExperiences } = useMockContent()
const { orderedProjects, loading, homePage: cmsHome } = useSanityIndexBundle()
const { statusItems } = useSanityStatus()
const { aboutPage } = useSanityAbout()
const cspNonce = useState<string>('csp-nonce', () => '')

/**
 * Hero copy is intentionally local-only (not CMS-driven) so typography/content
 * refinements are stable and predictable across responsive breakpoints.
 */
const heroTitle = computed(() => homeHero.title)
const heroTaglines = computed(() => homeHero.taglines)

const linkedinHref = computed(() => {
  const list = cmsHome.value?.socialLinks?.length ? cmsHome.value.socialLinks : socialLinks
  const found = list.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})

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

const heroTaglineOneLine = computed(() => {
  const lines = heroTaglines.value
  const segs = lines?.[0]?.segments
  if (!segs?.length) return ''
  const s = segs.map((x) => x.text).join('').trim()
  if (s.length <= 140) return s
  return `${s.slice(0, 137)}…`
})

const tickerList = computed(() => statusItems.value ?? [])

const { siteUrl, siteDescription } = useRuntimeConfig().public
const homeCanonicalUrl = `${String(siteUrl).replace(/\/$/, '')}/`
const homeOgImage = `${String(siteUrl).replace(/\/$/, '')}/og-default.png`

/** Person + WebSite in one `@graph` (Phase 5 structured data). */
const homeStructuredDataJsonLd = computed(() => {
  const base = String(siteUrl).replace(/\/$/, '')
  const imagePath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`
  const personId = `${base}/#person`

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    jobTitle: profile.role,
    image: `${base}${imagePath}`,
    url: homeCanonicalUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: linkedinHref.value ? [linkedinHref.value] : [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'business inquiries',
      url: `${homeCanonicalUrl}#contact`,
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: 'Bryan X. Mendez',
    url: homeCanonicalUrl,
    description: siteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': personId },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [person, website],
  }
})

useHead(() => ({
  title: 'Bryan X. Mendez',
  /** Avoid “Name · Name” from the global `titleTemplate`. */
  titleTemplate: '%s',
  link: [{ rel: 'canonical', href: homeCanonicalUrl }],
  script: [
    {
      key: 'ldjson-site-graph',
      type: 'application/ld+json',
      nonce: cspNonce.value || undefined,
      children: JSON.stringify(homeStructuredDataJsonLd.value),
    },
  ],
}))

useSeoMeta({
  description: siteDescription,
  ogTitle: 'Bryan X. Mendez',
  ogDescription: siteDescription,
  ogUrl: homeCanonicalUrl,
  ogImage: homeOgImage,
  twitterTitle: 'Bryan X. Mendez',
  twitterDescription: siteDescription,
  twitterImage: homeOgImage,
})
</script>

<template>
  <div class="page-content page-content--home content-flow">
    <GrainBackdrop />
    <HomeIntroSection
      :hero-title="heroTitle"
      :hero-taglines="heroTaglines"
      :linkedin-href="linkedinHref"
      intro-cta-to="/#story"
      intro-cta-label="Resume"
      :availability-line="hero.availabilityText"
      :tagline-one-line="heroTaglineOneLine"
    />
    <HomeWorkSection :projects="orderedProjects" :loading="loading" />
    <HomeStorySection
      :name="hero.name"
      :avatar="hero.avatar"
      :story="story"
      :resume-href="resumeHref"
    />
    <HomeStatusSection v-if="tickerList.length" :status-items="tickerList" layout="ticker" />
    <HomeExperienceCapabilitiesSection
      :experience-items="experienceItems"
      :groups="groupedCapabilities"
    />
    <HomeContactSection :linkedin-href="linkedinHref" />
  </div>
</template>
