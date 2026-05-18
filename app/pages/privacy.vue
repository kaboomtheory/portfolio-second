<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public
const privacyCanonicalUrl = `${String(siteUrl).replace(/\/$/, '')}/privacy`
const privacyOgImage = `${String(siteUrl).replace(/\/$/, '')}/og-default.png`
const privacyDescription =
  'How this portfolio uses Microsoft Clarity for analytics, heatmaps, and session replays.'

const microsoftPrivacyUrl = 'https://privacy.microsoft.com/en-us/privacystatement'

useHead({
  title: 'Privacy Policy',
  link: [{ rel: 'canonical', href: privacyCanonicalUrl }],
})

useSeoMeta({
  description: privacyDescription,
  ogTitle: 'Privacy Policy — Bryan X. Mendez',
  ogDescription: privacyDescription,
  ogUrl: privacyCanonicalUrl,
  ogImage: privacyOgImage,
  twitterTitle: 'Privacy Policy — Bryan X. Mendez',
  twitterDescription: privacyDescription,
  twitterImage: privacyOgImage,
})
</script>

<template>
  <div class="page-content content-flow privacy-page">
    <header class="privacy-page__header">
      <h1 class="privacy-page__title">
        Privacy Policy
      </h1>
    </header>
    <p class="privacy-page__body">
      This website uses Microsoft Clarity to capture how you interact with my portfolio through
      behavioral metrics, heatmaps, and session replays to improve my site's usability. Web usage
      data is captured using first and third-party cookies. By using this site, you agree that this
      data may be shared with Microsoft for their commercial purposes. For more information about how
      Microsoft collects and uses your data, visit the
      <a
        :href="microsoftPrivacyUrl"
        target="_blank"
        rel="noopener noreferrer"
      >Microsoft Privacy Statement</a>.
    </p>
  </div>
</template>

<style scoped>
.privacy-page {
  max-width: 42rem;
  margin-inline: auto;
  padding-top: clamp(2.5rem, 6vw, 4rem);
  padding-bottom: clamp(2rem, 5vw, 3.5rem);
}

.privacy-page__title {
  font-size: var(--text-section-title);
  letter-spacing: -0.02em;
  color: var(--fg-primary);
}

.privacy-page__body {
  font-size: var(--text-body-lg);
  line-height: 1.65;
}
</style>
