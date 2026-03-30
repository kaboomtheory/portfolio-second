import type { SanityImage } from '~/types/project'
import { buildImageUrl } from '~/utils/sanity'

interface SanityAboutHero {
  name: string
  role: string
  location: string
  avatar?: SanityImage
  availabilityText?: string
}

interface SanityExperienceEntry {
  title: string
  company: string
  year: string
  description: string
  logo?: SanityImage
}

interface SanityCapability {
  name: string
  category: string
}

interface SanityAboutPage {
  hero?: SanityAboutHero
  story?: string[]
  experiences?: SanityExperienceEntry[]
  capabilities?: SanityCapability[]
  resumeUrl?: string
}

export interface AboutHero {
  name: string
  role: string
  location: string
  avatar: string | null
  availabilityText: string
}

export interface AboutExperienceEntry {
  title: string
  company: string
  year: string
  description: string
  image: string | null
}

export interface AboutCapability {
  name: string
  category: string
}

export function useSanityAbout() {
  const { data: raw, pending: loading, error, refresh } = useFetch<SanityAboutPage | null>('/api/sanity-about', {
    key: 'sanity-about',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const aboutPage = computed(() => {
    if (!raw.value) return null

    return {
      hero: raw.value.hero
        ? {
            name: raw.value.hero.name,
            role: raw.value.hero.role,
            location: raw.value.hero.location,
            avatar: raw.value.hero.avatar ? buildImageUrl(raw.value.hero.avatar) : null,
            availabilityText: raw.value.hero.availabilityText || 'Available for freelance',
          } as AboutHero
        : null,
      story: raw.value.story || [],
      experiences: (raw.value.experiences || []).map((exp) => ({
        title: exp.title,
        company: exp.company,
        year: exp.year,
        description: exp.description,
        image: exp.logo ? buildImageUrl(exp.logo) : null,
      })) as AboutExperienceEntry[],
      capabilities: (raw.value.capabilities || []) as AboutCapability[],
      resumeUrl: raw.value.resumeUrl || null,
    }
  })

  return { aboutPage, loading, error, refresh }
}
