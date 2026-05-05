import { createImageUrlBuilder, type FitMode, type SanityImageSource } from '@sanity/image-url'
import type { SanityImage } from '~/types/project'

/** Tuned widths for CDN resizing (Sanity Image API). */
export type SanityImageSize =
  | 'thumbnail'
  | 'card'
  | 'content'
  | 'hero'
  /** Homepage / grid project cards — tuned to avoid oversized first-scroll decodes */
  | 'grid'

const SIZE_PRESETS: Record<
  SanityImageSize,
  { width: number; quality: number }
> = {
  thumbnail: { width: 400, quality: 80 },
  card: { width: 720, quality: 82 },
  content: { width: 1600, quality: 85 },
  hero: { width: 2200, quality: 85 },
  grid: { width: 960, quality: 82 },
}

const SANITY_CDN_HOST = 'cdn.sanity.io'
const RESPONSIVE_IMAGE_WIDTHS = [400, 720, 960, 1200, 1600, 2200]
const SANITY_DIMENSION_PATTERN = /-(\d+)x(\d+)\.[a-z0-9]+(?:$|\?)/

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
  return buildImageUrlWithProps(source, { width, quality, auto: 'format', fit: 'max' })
}

export function buildImageUrlWithProps(
  source: SanityImageSource,
  props: {
    width?: number
    height?: number
    quality?: number
    format?: 'jpg' | 'png' | 'webp'
    auto?: 'format'
    fit?: FitMode
  },
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
    if (props.fit) builder = builder.fit(props.fit)

    return builder.url() || ''
  } catch {
    return ''
  }
}

export function buildSanitySrcset(url: string | null | undefined): string {
  if (!isValidString(url) || !isSanityCdnUrl(url)) return ''

  try {
    const parsedUrl = new URL(url)
    const sourceWidth = Number(parsedUrl.searchParams.get('w'))
    const maxWidth = Number.isFinite(sourceWidth) && sourceWidth > 0
      ? sourceWidth
      : RESPONSIVE_IMAGE_WIDTHS.at(-1) || 2200

    return RESPONSIVE_IMAGE_WIDTHS
      .filter((width) => width <= maxWidth)
      .map((width) => {
        const candidateUrl = new URL(parsedUrl)
        candidateUrl.searchParams.set('w', String(width))
        return `${candidateUrl.toString()} ${width}w`
      })
      .join(', ')
  } catch {
    return ''
  }
}

export function getSanityImageDimensions(url: string | null | undefined): {
  width: number
  height: number
} | null {
  if (!isValidString(url) || !isSanityCdnUrl(url)) return null

  try {
    const { pathname } = new URL(url)
    const match = pathname.match(SANITY_DIMENSION_PATTERN)
    if (!match) return null

    const width = Number(match[1])
    const height = Number(match[2])
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null
    }

    return { width, height }
  } catch {
    return null
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
