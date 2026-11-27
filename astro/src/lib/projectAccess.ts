/**
 * Server-side gate for password-protected case studies. Replaces the Nuxt
 * routes /api/project-access and /api/project/[slug]: the project page calls
 * this in its frontmatter and redirects to /password/[slug] on null.
 */
import type { AstroCookies } from 'astro'
import type { SanityProjectItem } from '~/types/project'
import { sanityQuery } from '~/lib/sanity'
import { ACCESS_COOKIE_NAME, verifyAccessToken } from '~/lib/server/accessToken'

/** Full project including sections. Never selects `passwordHash`. */
const projectWithSectionsQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  _type,
  name,
  slug,
  summary,
  thumbnail,
  protected,
  underConstruction,
  tags,
  "sections": select(underConstruction == true => null, sections),
  client,
  role,
  projectUrl,
  heroImage,
  color,
  collaborators,
  order
}`

/** Slugs the visitor's `project_access` cookie currently unlocks. */
export function getUnlockedSlugs(cookies: AstroCookies): string[] {
  return verifyAccessToken(cookies.get(ACCESS_COOKIE_NAME)?.value)
}

/**
 * Returns the full project when the visitor may see it: the cookie unlocks
 * this slug, or the project is not protected. Returns null when it is
 * protected and locked, or when it does not exist.
 */
export async function getUnlockedProject(slug: string, cookies: AstroCookies): Promise<SanityProjectItem | null> {
  const clean = slug.trim()
  if (!clean) return null

  const project = await sanityQuery<SanityProjectItem | null>(
    projectWithSectionsQuery,
    { slug: clean },
    { useToken: true },
  )
  if (!project) return null
  if (project.underConstruction) return { ...project, sections: undefined }
  if (project.protected && !getUnlockedSlugs(cookies).includes(clean)) return null
  return project
}
