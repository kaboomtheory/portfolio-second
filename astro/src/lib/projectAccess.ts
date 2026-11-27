import type { AstroCookies } from 'astro'
import type { SanityProjectItem } from '~/types/project'

/**
 * Returns the full project (sections included) when the visitor has unlocked
 * it, or null when they have not.
 *
 * STUB: always null for now, so protected projects send people to the
 * password page. The unlock work (signed `project_access` cookie checked
 * against SANITY_READ_TOKEN reads, ported from server/utils/projectAccess.ts
 * and server/api/project/[slug].get.ts) replaces this body.
 */
export async function getUnlockedProject(
  _slug: string,
  _cookies: AstroCookies,
): Promise<SanityProjectItem | null> {
  return null
}
