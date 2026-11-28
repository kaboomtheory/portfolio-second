/** Small helpers for the redesigned pages. */

/** Same Sanity CDN image at another width. Leaves non-Sanity URLs alone. */
export function sized(url: string | undefined | null, width: number): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (!u.hostname.endsWith('sanity.io')) return url
    u.searchParams.set('w', String(width))
    return u.toString()
  } catch {
    return url
  }
}

/** srcset across a few widths, capped at what the layout can use. */
export function srcset(url: string | undefined | null, max = 2200): string {
  if (!url || !/sanity\.io/.test(url)) return ''
  return [480, 720, 960, 1280, 1600, 2200]
    .filter((w) => w <= max)
    .map((w) => `${sized(url, w)} ${w}w`)
    .join(', ')
}

/**
 * Sanity asset URLs end in `<hash>-<width>x<height>.<ext>`, so the original
 * pixel size is known without fetching. Used by the dimension marks.
 */
export function sanityDims(url: string | undefined | null): { w: number; h: number } | null {
  const m = url?.match(/-(\d+)x(\d+)\.[a-z]+(?:\?|$)/i)
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null
}

/** Two digits: 1 -> "01". */
export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Keep a quoted label to one or two words. */
export function shortLabel(text: string | undefined | null): string {
  return (text ?? '').trim().split(/\s+/).slice(0, 2).join(' ')
}
