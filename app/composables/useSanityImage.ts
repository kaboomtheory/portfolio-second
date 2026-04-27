import type { SanityImageSource } from '@sanity/image-url'
import {
  buildImageUrl,
  buildImageUrlWithProps,
  type SanityImageSize,
} from '~/utils/sanity'

/**
 * Vue-facing helpers for Sanity CDN URLs (width/quality via `@sanity/image-url`).
 * Use with `<SanityImage>` or a native `<img>` by passing the returned URL as `src`.
 */
export function useSanityImage() {
  function url(source: SanityImageSource, size: SanityImageSize = 'content') {
    return buildImageUrl(source, size)
  }

  return {
    url,
    urlWithProps: buildImageUrlWithProps,
  }
}
