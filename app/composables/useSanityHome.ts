interface SanityTaglineSegment {
  text: string
  em?: boolean
}

interface SanityTaglineLine {
  segments?: SanityTaglineSegment[]
}

interface SanitySocialLink {
  label: string
  icon: string
  href: string
}

interface SanityHomePage {
  title?: string
  taglines?: SanityTaglineLine[]
  intro?: string
  email?: string
  socialLinks?: SanitySocialLink[]
}

export interface HomeHeroData {
  title: string
  taglines: { segments: { text: string; em?: boolean }[] }[]
}

export interface HomePageData {
  hero: HomeHeroData
  intro: string
  email: string
  socialLinks: { label: string; icon: string; href: string }[]
}

export function useSanityHome() {
  const { data: raw, pending: loading, error, refresh } = useLazyFetch<SanityHomePage | null>('/api/sanity-home')

  const homePage = computed<HomePageData | null>(() => {
    if (!raw.value) return null

    return {
      hero: {
        title: raw.value.title || '',
        taglines: (raw.value.taglines || []).map((line) => ({
          segments: (line.segments || []).map((seg) => ({
            text: seg.text,
            em: seg.em,
          })),
        })),
      },
      intro: raw.value.intro || '',
      email: raw.value.email || '',
      socialLinks: (raw.value.socialLinks || []).map((link) => ({
        label: link.label,
        icon: link.icon,
        href: link.href,
      })),
    }
  })

  return { homePage, loading, error, refresh }
}
