import { getCookie, getRouterParam } from 'h3'
import { sanityQuery } from '../../utils/sanityFetch'
import { ACCESS_COOKIE_NAME, verifyAccessToken } from '../../utils/projectAccess'

// Returns a single project including sections. For protected
// projects, requires a valid unlock cookie (set by
// `/api/project-unlock`). Never returns the `passwordHash` field.
export default defineEventHandler(async (event) => {
  const slug = (getRouterParam(event, 'slug') || '').trim()
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const unlocked = verifyAccessToken(getCookie(event, ACCESS_COOKIE_NAME))

  const project = await sanityQuery<{
    _id: string
    protected?: boolean
    slug: { current: string }
    sections?: unknown
  } | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      _id,
      _type,
      name,
      slug,
      summary,
      thumbnail,
      protected,
      tags,
      sections,
      client,
      role,
      projectUrl,
      heroImage,
      color,
      collaborators,
      order
    }`,
    { params: { slug }, useToken: true },
  )

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' })
  }

  if (project.protected && !unlocked.includes(slug)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return project
})
