import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import type { SanityImage } from '~/types/project'

export function buildImageUrl(source: SanityImageSource): string {
  // Get config from runtime config
  const config = useRuntimeConfig()
  const projectId = config.public.sanityProjectId as string
  const dataset = config.public.sanityDataset as string

  const builder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || 'production',
  })

  return builder.image(source).url() || ''
}

export function buildImageUrlWithProps(
  source: SanityImageSource,
  props: { width?: number; height?: number; quality?: number; format?: 'jpg' | 'png' | 'webp'; auto?: 'format' }
): string {
  const config = useRuntimeConfig()
  const projectId = config.public.sanityProjectId as string
  const dataset = config.public.sanityDataset as string

  let builder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || 'production',
  }).image(source)

  if (props.width) builder = builder.width(props.width)
  if (props.height) builder = builder.height(props.height)
  if (props.quality) builder = builder.quality(props.quality)
  if (props.format) builder = builder.format(props.format)
  if (props.auto) builder = builder.auto(props.auto)

  return builder.url() || ''
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
