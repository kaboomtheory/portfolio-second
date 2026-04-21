import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import type { SanityImage } from '~/types/project'

/** Tuned widths for CDN resizing (Sanity Image API). */
export type SanityImageSize =
  | 'thumbnail'
  | 'card'
  | 'content'
  | 'hero'
  /** Homepage / grid project cards — wide enough for retina multi-column layouts */
  | 'grid'

const SIZE_PRESETS: Record<
  SanityImageSize,
  { width: number; quality: number }
> = {
  thumbnail: { width: 400, quality: 80 },
  card: { width: 720, quality: 82 },
  content: { width: 1600, quality: 85 },
  hero: { width: 2200, quality: 85 },
  grid: { width: 2800, quality: 92 },
}

const SANITY_CDN_HOST = 'cdn.sanity.io'

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function canBuildImageSource(source: SanityImageSource): boolean {
  if (!source) return false
  if (typeof source === 'string') return source.trim().length > 0
  if (typeof source === 'object') {
    const candidate = source as { asset?: { _ref?: string; _id?: string } }
    return Boolean(candidate.asset?._ref || candidate.asset?._id)
  }
  return false
}

/**
 * Full-resolution URLs are avoided by default: pass a size preset for CDN transforms.
 */
export function buildImageUrl(
  source: SanityImageSource,
  size: SanityImageSize = 'content',
): string {
  if (!canBuildImageSource(source)) return ''
  const { width, quality } = SIZE_PRESETS[size]
  return buildImageUrlWithProps(source, { width, quality, auto: 'format' })
}

export function buildImageUrlWithProps(
  source: SanityImageSource,
  props: { width?: number; height?: number; quality?: number; format?: 'jpg' | 'png' | 'webp'; auto?: 'format' }
): string {
  if (!canBuildImageSource(source)) return ''

  const config = useRuntimeConfig()
  const projectId = (config.public.sanityProjectId as string)?.trim()
  const dataset = (config.public.sanityDataset as string)?.trim()
  if (!projectId || !dataset) return ''

  try {
    let builder = createImageUrlBuilder({
      projectId,
      dataset,
    }).image(source)

    if (props.width) builder = builder.width(props.width)
    if (props.height) builder = builder.height(props.height)
    if (props.quality) builder = builder.quality(props.quality)
    if (props.format) builder = builder.format(props.format)
    if (props.auto) builder = builder.auto(props.auto)

    return builder.url() || ''
  } catch {
    return ''
  }
}

export function isSanityCdnUrl(url: string | null | undefined): boolean {
  if (!isValidString(url)) return false
  try {
    return new URL(url).hostname === SANITY_CDN_HOST
  } catch {
    return false
  }
}

// Type guard to check if something is a Sanity image
export function isSanityImage(value: unknown): value is SanityImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_type' in value &&
    (value as SanityImage)._type === 'image' &&
    'asset' in value
  )
}
