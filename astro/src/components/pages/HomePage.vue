<script setup lang="ts">
/**
 * Home page body as one island. The section rules in main.css use
 * `.page-content--home > section` and `section + section`, which only match
 * when the sections are direct siblings, as they are in the Nuxt page. Separate
 * islands per section wrap each one in <astro-island> and break those rules.
 */
import HomeIntroSection from '~/components/home/HomeIntroSection.vue'
import HomeWorkSection from '~/components/home/HomeWorkSection.vue'
import HomeStorySection from '~/components/home/HomeStorySection.vue'
import HomeStatusSection from '~/components/home/HomeStatusSection.vue'
import HomeExperienceCapabilitiesSection from '~/components/home/HomeExperienceCapabilitiesSection.vue'
import HomeContactSection from '~/components/home/HomeContactSection.vue'

defineProps<{
  heroTitle: any
  heroTaglines: any
  linkedinHref: string
  availabilityLine?: string
  taglineOneLine: string
  projects: any[]
  heroName: string
  heroAvatar: any
  story: any
  resumeHref: string
  statusItems: any[]
  experienceItems: any[]
  groups: any[]
}>()
</script>

<template>
  <div class="page-content page-content--home content-flow">
    <HomeIntroSection
      :hero-title="heroTitle"
      :hero-taglines="heroTaglines"
      :linkedin-href="linkedinHref"
      intro-cta-to="/#story"
      intro-cta-label="Resume"
      :availability-line="availabilityLine"
      :tagline-one-line="taglineOneLine"
    />
    <HomeWorkSection :projects="projects" :loading="false" />
    <HomeStorySection :name="heroName" :avatar="heroAvatar" :story="story" :resume-href="resumeHref" />
    <HomeStatusSection v-if="statusItems.length > 0" :status-items="statusItems" layout="ticker" />
    <HomeExperienceCapabilitiesSection :experience-items="experienceItems" :groups="groups" />
    <HomeContactSection :linkedin-href="linkedinHref" />
  </div>
</template>
