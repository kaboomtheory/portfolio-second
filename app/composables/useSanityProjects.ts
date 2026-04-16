import type { SanityProjectItem, ProjectItem, ContentBlock, ProjectStorySection } from '~/types/project'
import { buildImageUrl } from '~/utils/sanity'

function mapSection(section: ContentBlock): ProjectStorySection {
  switch (section._type) {
    case 'textSection':
      return {
        type: 'textSection',
        heading: section.heading,
        body: section.body,
      }
    case 'singleImage':
      return {
        type: 'singleImage',
        image: section.image ? buildImageUrl(section.image, 'content') : undefined,
        layout: section.layout,
        caption: section.caption,
      }
    case 'imageGallery':
      return {
        type: 'imageGallery',
        layout: section.layout,
        images: section.images?.map((img) => ({
          image: buildImageUrl(img.image, 'content'),
          alt: img.alt,
          caption: img.caption,
        })),
      }
    case 'imageTextBlock':
      return {
        type: 'imageTextBlock',
        image: section.image ? buildImageUrl(section.image, 'content') : undefined,
        heading: section.heading,
        body: section.body,
        position: section.position,
      }
    case 'videoEmbed':
      return {
        type: 'videoEmbed',
        url: section.url,
        layout: section.layout,
        caption: section.caption,
      }
    case 'quote':
      return {
        type: 'quote',
        body: section.quote,
        author: section.author,
        role: section.role,
      }
    case 'statsRow':
      return {
        type: 'statsRow',
        stats: section.stats,
      }
    case 'spacer':
      return {
        type: 'spacer',
        size: section.size,
      }
    case 'section':
      return {
        type: 'section',
        heading: section.heading,
        body: section.body,
        image: section.image ? buildImageUrl(section.image, 'content') : undefined,
      }
    default:
      return {}
  }
}

export function projectItemsFromSanityRaw(
  rawProjects: SanityProjectItem[] | null | undefined,
): ProjectItem[] {
  if (!rawProjects || !Array.isArray(rawProjects)) return []

  return rawProjects.map((project: SanityProjectItem) => ({
    slug: project.slug?.current || '',
    name: project.name || '',
    summary: project.summary || '',
    thumbnail: project.thumbnail ? buildImageUrl(project.thumbnail, 'grid') : '',
    protected: project.protected || false,
    tags: project.tags || [],
    sections: (project.sections || []).map(mapSection),
    order: project.order,
    client: project.client,
    role: project.role,
    projectUrl: project.projectUrl,
    heroImage: project.heroImage ? buildImageUrl(project.heroImage, 'hero') : undefined,
    color: project.color,
    collaborators: project.collaborators,
  }))
}

export function useSanityProjects() {
  const { data: rawProjects, pending: loading, error, refresh } = useFetch<SanityProjectItem[]>('/api/sanity-projects', {
    key: 'sanity-projects',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const projects = computed<ProjectItem[]>(() =>
    projectItemsFromSanityRaw(rawProjects.value),
  )

  const orderedProjects = computed<ProjectItem[]>(() => {
    const list = [...projects.value]
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    return list
  })

  return {
    projects,
    orderedProjects,
    loading,
    error,
    refresh,
  }
}
