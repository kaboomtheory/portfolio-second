/**
 * Server-side loaders. Each page fetches what it needs in its frontmatter and
 * passes plain props to the Vue islands, so no Sanity request runs in the browser.
 */
import type { SanityImage, SanityProjectItem } from '~/types/project'
import type { StatusItem } from '~/data/home'
import type { AboutStory } from '~/utils/aboutStory'
import { resolveRegistryIcon } from '~/data/iconRegistry'
import { buildImageUrl } from '~/utils/sanity'
import { sanityQuery } from './sanity'
import { aboutPageQuery, homePageQuery, projectsIndexQuery, statusItemsQuery } from './queries'
import { projectItemsFromSanityRaw } from './projects'
import { homePageDataFromSanityRaw, type SanityHomePageRaw } from './home'

interface SanityAboutPage {
  hero?: { name: string; avatar?: SanityImage; availabilityText?: string }
  story?: AboutStory
  experiences?: { title: string; company: string; year: string; description: string; logo?: SanityImage }[]
  capabilities?: { name: string; category: string }[]
  resumeUrl?: string
}

interface SanityStatusItem {
  _id: string
  label: string
  title: string
  content?: string
  link?: string
  image?: { asset: { _ref: string }; alt?: string }
  icon?: string
  order?: number
}

export interface AboutExperienceEntry {
  title: string
  company: string
  year: string
  description: string
  image: string | null
}

export function mapAboutPage(raw: SanityAboutPage | null) {
  if (!raw) return null
  const avatar = raw.hero?.avatar ? buildImageUrl(raw.hero.avatar, 'card') : ''
  return {
    hero: raw.hero
      ? {
          name: raw.hero.name,
          avatar: avatar || null,
          availabilityText: raw.hero.availabilityText || 'Available for freelance',
        }
      : null,
    story: raw.story || [],
    experiences: (raw.experiences || []).map((exp): AboutExperienceEntry => {
      const image = exp.logo ? buildImageUrl(exp.logo, 'icon') : ''
      return {
        title: exp.title,
        company: exp.company,
        year: exp.year,
        description: exp.description,
        image: image || null,
      }
    }),
    capabilities: raw.capabilities || [],
    resumeUrl: raw.resumeUrl || null,
  }
}

export function mapStatusItems(raw: SanityStatusItem[] | null): StatusItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => {
    const icon = resolveRegistryIcon(item.icon)
    const image = !icon && item.image ? buildImageUrl(item.image, 'icon') : ''
    return {
      type: 'Logo',
      label: item.label || '',
      title: item.title || '',
      content: item.content || '',
      link: item.link?.trim() || '',
      images: image ? [image] : [],
      icon,
    }
  })
}

/** Everything the home page needs, in one round of parallel requests. */
export async function getHomeContent() {
  const [projects, home, about, status] = await Promise.all([
    sanityQuery<SanityProjectItem[] | null>(projectsIndexQuery),
    sanityQuery<SanityHomePageRaw | null>(homePageQuery),
    sanityQuery<SanityAboutPage | null>(aboutPageQuery),
    sanityQuery<SanityStatusItem[] | null>(statusItemsQuery),
  ])

  const orderedProjects = projectItemsFromSanityRaw(projects).sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  )

  return {
    projects: orderedProjects,
    homePage: homePageDataFromSanityRaw(home),
    aboutPage: mapAboutPage(about),
    statusItems: mapStatusItems(status),
  }
}

/** Public project list, ordered as on the home page. Protected projects have no sections. */
export async function getProjects() {
  const raw = await sanityQuery<SanityProjectItem[] | null>(projectsIndexQuery)
  return projectItemsFromSanityRaw(raw).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

/** About page content (also used by the home page story and background sections). */
export async function getAboutPage() {
  return mapAboutPage(await sanityQuery<SanityAboutPage | null>(aboutPageQuery))
}
