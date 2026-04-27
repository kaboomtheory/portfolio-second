import type { SanityProjectItem } from '~/types/project'
import {
  projectItemsFromSanityRaw,
} from '~/composables/useSanityProjects'
import {
  homePageDataFromSanityRaw,
  type HomePageData,
  type SanityHomePageRaw,
} from '~/composables/useSanityHome'

interface SanityIndexPayload {
  projects: SanityProjectItem[]
  home: SanityHomePageRaw | null
}

/**
 * Single request for home page: projects + home CMS (saves a round trip
 * vs separate fetches). Password hashes are never exposed through this API —
 * see /api/project-unlock for the auth flow.
 */
export function useSanityIndexBundle() {
  const { data, pending: loading, error, refresh } = useFetch<SanityIndexPayload>('/api/sanity-index', {
    key: 'sanity-index',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const projects = computed(() => projectItemsFromSanityRaw(data.value?.projects))

  const orderedProjects = computed(() => {
    const list = [...projects.value]
    list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    return list
  })

  const homePage = computed<HomePageData | null>(() =>
    homePageDataFromSanityRaw(data.value?.home),
  )

  return {
    orderedProjects,
    homePage,
    loading,
    error,
    refresh,
  }
}
