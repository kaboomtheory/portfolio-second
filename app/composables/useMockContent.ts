import { aboutMe, currentStatus, homeHero } from '~/data/home'
import { friends } from '~/data/friends'
import { projectPasswords, projects } from '~/data/projects'
import { clients, experiences } from '~/data/resume'
import { trinkets } from '~/data/trinkets'

export function useMockContent() {
  return {
    homeHero,
    currentStatus,
    aboutMe,
    projects,
    projectPasswords,
    friends,
    trinkets,
    experiences,
    clients,
  }
}
