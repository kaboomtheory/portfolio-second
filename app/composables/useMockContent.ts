import { aboutMe, currentStatus, homeHero } from '~/data/home'
import { friends } from '~/data/friends'
import { clients, experiences } from '~/data/resume'
import { trinkets } from '~/data/trinkets'

/**
 * Static content composable - contains all non-Sanity managed content
 * For projects, use useSanityProjects() directly instead
 */
export function useMockContent() {
  return {
    homeHero,
    currentStatus,
    aboutMe,
    friends,
    trinkets,
    experiences,
    clients,
  }
}
