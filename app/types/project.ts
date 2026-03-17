// Sanity image type
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

// Collaborator type
export interface SanityCollaborator {
  name: string
  role?: string
  url?: string
}

// Content block types
export interface TextSection {
  _type: 'textSection'
  _key: string
  heading?: string
  body?: string
}

export interface SingleImage {
  _type: 'singleImage'
  _key: string
  image: SanityImage
  layout?: 'full' | 'large' | 'medium'
  caption?: string
}

export interface ImageGallery {
  _type: 'imageGallery'
  _key: string
  layout?: 'two-col' | 'three-col' | 'four-col' | 'masonry'
  images: Array<{
    image: SanityImage
    alt?: string
    caption?: string
  }>
}

export interface ImageTextBlock {
  _type: 'imageTextBlock'
  _key: string
  image: SanityImage
  heading?: string
  body?: string
  position?: 'left' | 'right'
}

export interface VideoEmbed {
  _type: 'videoEmbed'
  _key: string
  url: string
  layout?: 'full' | 'large' | 'medium'
  caption?: string
}

export interface Quote {
  _type: 'quote'
  _key: string
  quote: string
  author?: string
  role?: string
}

export interface StatsRow {
  _type: 'statsRow'
  _key: string
  stats: Array<{
    value: string
    label: string
  }>
}

export interface Spacer {
  _type: 'spacer'
  _key: string
  size?: 'small' | 'medium' | 'large'
}

// Legacy section type (for backward compatibility with existing Sanity data)
export interface LegacySection {
  _type: 'section'
  _key: string
  heading?: string
  body?: string
  image?: SanityImage
}

export type ContentBlock =
  | TextSection
  | SingleImage
  | ImageGallery
  | ImageTextBlock
  | VideoEmbed
  | Quote
  | StatsRow
  | Spacer
  | LegacySection

// Legacy section type (for backward compatibility)
export interface SanityProjectStorySection {
  _key: string
  heading?: string
  body?: string
  image?: SanityImage
}

// Full Sanity project type
export interface SanityProjectItem {
  _id: string
  _type: 'project'
  slug: {
    _type: 'slug'
    current: string
  }
  name: string
  category: string
  year?: string
  summary?: string
  thumbnail?: SanityImage
  protected?: boolean
  password?: string
  tags?: string[]
  sections?: ContentBlock[]
  order?: number
  // Metadata
  client?: string
  role?: string
  projectUrl?: string
  heroImage?: SanityImage
  color?: string
  collaborators?: SanityCollaborator[]
}

// Legacy project interface
export interface ProjectItem {
  slug: string
  name: string
  category: string
  year?: string
  summary?: string
  thumbnail: string
  protected?: boolean
  tags?: string[]
  sections: ProjectStorySection[]
  order?: number
  // Metadata
  client?: string
  role?: string
  projectUrl?: string
  heroImage?: string
  color?: string
  collaborators?: Array<{
    name: string
    role?: string
    url?: string
  }>
}

export interface ProjectStorySection {
  type?: 'textSection' | 'singleImage' | 'imageGallery' | 'imageTextBlock' | 'videoEmbed' | 'quote' | 'statsRow' | 'spacer' | 'section'
  heading?: string
  body?: string
  image?: string
  caption?: string
  layout?: 'full' | 'large' | 'medium' | 'two-col' | 'three-col' | 'four-col' | 'masonry' | 'left' | 'right'
  images?: Array<{
    image: string
    alt?: string
    caption?: string
  }>
  position?: 'left' | 'right'
  url?: string
  author?: string
  role?: string
  stats?: Array<{
    value: string
    label: string
  }>
  size?: 'small' | 'medium' | 'large'
}

// Adapter to convert Sanity project to legacy interface
export function sanityProjectToLegacy(
  project: SanityProjectItem,
  buildImageUrl: (image: SanityImage) => string
): ProjectItem {
  return {
    slug: project.slug.current,
    name: project.name,
    category: project.category,
    year: project.year,
    summary: project.summary,
    thumbnail: project.thumbnail ? buildImageUrl(project.thumbnail) : '',
    protected: project.protected,
    tags: project.tags,
    sections: (project.sections || []).map((section) => {
      if (section._type === 'textSection') {
        return {
          heading: section.heading,
          body: section.body,
        }
      }
      if (section._type === 'singleImage') {
        return {
          image: buildImageUrl(section.image),
          caption: section.caption,
        }
      }
      return {}
    }),
    client: project.client,
    role: project.role,
    projectUrl: project.projectUrl,
    heroImage: project.heroImage ? buildImageUrl(project.heroImage) : undefined,
    color: project.color,
    collaborators: project.collaborators,
  }
}
