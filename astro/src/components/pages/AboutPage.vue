<script setup lang="ts">
/** About page body as one island, so the sections stay direct siblings like in the Nuxt page. */
import HomeStorySection from '~/components/home/HomeStorySection.vue'
import HomeExperienceCapabilitiesSection from '~/components/home/HomeExperienceCapabilitiesSection.vue'

defineProps<{
  heroName: string
  heroAvatar: any
  story: any
  resumeHref: string
  experienceItems: any[]
  groups: any[]
}>()
</script>

<template>
  <div class="page-content content-flow">
    <HomeStorySection :name="heroName" :avatar="heroAvatar" :story="story" :resume-href="resumeHref" />
    <HomeExperienceCapabilitiesSection :experience-items="experienceItems" :groups="groups" />
  </div>
</template>
