import type { SanityProjectItem, ProjectItem, ContentBlock } from '~/types/project'
import { buildImageUrl } from '~/utils/sanity'

function mapSection(section: ContentBlock): { heading?: string; body?: string; image?: string; caption?: string; type?: string; layout?: string; images?: Array<{ image: string; alt?: string; caption?: string }>; position?: string; url?: string; author?: string; role?: string; stats?: Array<{ value: string; label: string }>; size?: string } {
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
        image: section.image ? buildImageUrl(section.image) : undefined,
        layout: section.layout,
        caption: section.caption,
      }
    case 'imageGallery':
      return {
        type: 'imageGallery',
        layout: section.layout,
        images: section.images?.map((img) => ({
          image: buildImageUrl(img.image),
          alt: img.alt,
          caption: img.caption,
        })),
      }
    case 'imageTextBlock':
      return {
        type: 'imageTextBlock',
        image: section.image ? buildImageUrl(section.image) : undefined,
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
        image: section.image ? buildImageUrl(section.image) : undefined,
      }
    default:
      return {}
  }
}

export function useSanityProjects() {
  const { data: rawProjects, pending: loading, error, refresh } = useLazyFetch<SanityProjectItem[]>('/api/sanity-projects')
  const { data: rawPasswords } = useLazyFetch<Record<string, string>>('/api/sanity-passwords')

  const projects = computed<ProjectItem[]>(() => {
    if (!rawProjects.value || !Array.isArray(rawProjects.value)) return []

    return rawProjects.value.map((project: SanityProjectItem) => ({
      slug: project.slug?.current || '',
      name: project.name || '',
      category: project.category || '',
      year: project.year || '',
      summary: project.summary || '',
      thumbnail: project.thumbnail ? buildImageUrl(project.thumbnail) : '',
      protected: project.protected || false,
      tags: project.tags || [],
      sections: (project.sections || []).map(mapSection),
      order: project.order,
      client: project.client,
      role: project.role,
      projectUrl: project.projectUrl,
      heroImage: project.heroImage ? buildImageUrl(project.heroImage) : undefined,
      color: project.color,
      collaborators: project.collaborators,
    }))
  })

  const projectPasswords = computed<Record<string, string>>(() => {
    if (!rawPasswords.value) return {}
    return rawPasswords.value || {}
  })

  return {
    projects,
    projectPasswords,
    loading,
    error,
    refresh,
  }
}
