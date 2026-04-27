import { getCookie, getQuery } from 'h3'
import { sanityQuery } from '../utils/sanityFetch'
import { ACCESS_COOKIE_NAME, verifyAccessToken } from '../utils/projectAccess'

// Client-side guard helper. Given a slug, reports whether the project
// is protected and whether the current visitor's cookie unlocks it.
// Without a slug, returns the full list of currently-unlocked slugs.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = typeof query.slug === 'string' ? query.slug.trim() : ''
  const unlocked = verifyAccessToken(getCookie(event, ACCESS_COOKIE_NAME))

  if (!slug) {
    return { slugs: unlocked }
  }

  const row = await sanityQuery<{ protected?: boolean } | null>(
    `*[_type == "project" && slug.current == $slug][0]{ protected }`,
    { params: { slug } },
  )

  return {
    slug,
    protected: Boolean(row?.protected),
    unlocked: unlocked.includes(slug),
  }
})
