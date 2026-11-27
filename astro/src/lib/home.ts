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

export interface SanityHomePageRaw {
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

export function homePageDataFromSanityRaw(
  raw: SanityHomePageRaw | null | undefined,
): HomePageData | null {
  if (!raw) return null

  return {
    hero: {
      title: raw.title || '',
      taglines: (raw.taglines || []).map((line) => ({
        segments: (line.segments || []).map((seg) => ({
          text: seg.text,
          em: seg.em,
        })),
      })),
    },
    intro: raw.intro || '',
    email: raw.email || '',
    socialLinks: (raw.socialLinks || []).map((link) => ({
      label: link.label,
      icon: link.icon,
      href: link.href,
    })),
  }
}
