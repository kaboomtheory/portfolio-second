/** Fallback rules shared by the home and About pages (from app/pages/index.vue and about/index.vue). */
import { aboutMe as fallbackAboutMe } from '~/data/home'
import type { mapAboutPage } from './content'

type AboutPage = ReturnType<typeof mapAboutPage>

export function resolveHero(aboutPage: AboutPage) {
  if (aboutPage?.hero) {
    return {
      name: aboutPage.hero.name,
      avatar: aboutPage.hero.avatar ?? fallbackAboutMe.avatar,
      availabilityText: aboutPage.hero.availabilityText || 'Available for freelance',
    }
  }
  return { name: fallbackAboutMe.name, avatar: fallbackAboutMe.avatar, availabilityText: 'Available for freelance' }
}

export function groupCapabilities(aboutPage: AboutPage) {
  const capabilities = aboutPage?.capabilities?.length
    ? aboutPage.capabilities
    : [
        ...fallbackAboutMe.skills.flatMap((g) => g.items.map((name) => ({ name, category: g.category }))),
        ...fallbackAboutMe.tools.map((name) => ({ name, category: 'Software' })),
      ]
  const groups: Record<string, string[]> = {}
  for (const cap of capabilities) (groups[cap.category] ??= []).push(cap.name)
  return Object.entries(groups).map(([category, items]) => ({ category, items }))
}
