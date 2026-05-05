import { aboutMe, homeHero } from '~/data/home'
import { experiences } from '~/data/resume'

/**
 * Static content composable - contains all non-Sanity managed content
 * For projects, use useSanityProjects() directly instead
 */
export function useMockContent() {
  return {
    homeHero,
    aboutMe,
    experiences,
  }
}
