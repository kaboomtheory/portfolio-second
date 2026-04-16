// Normalizes the `slug` route param for the projects route. The
// middleware used to join multi-segment slugs with `/` while the
// page itself took only the first segment, which meant a multi-
// segment URL could bypass the protect middleware. This helper is
// the single source of truth for both.
export function normalizeProjectSlug(source: unknown): string {
  if (Array.isArray(source)) {
    const first = source[0]
    return typeof first === 'string' ? first : ''
  }
  if (typeof source === 'string') return source
  if (source == null) return ''
  return String(source)
}
