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
  passwords: Record<string, string>
}

/**
 * Single request for home page: projects + home CMS + passwords (saves round trips vs separate fetches).
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

  const projectPasswords = computed(() => data.value?.passwords ?? {})

  const homePage = computed<HomePageData | null>(() =>
    homePageDataFromSanityRaw(data.value?.home),
  )

  return {
    orderedProjects,
    projectPasswords,
    homePage,
    loading,
    error,
    refresh,
  }
}
