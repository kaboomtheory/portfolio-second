import type { StatusItem } from '~/data/home'
import { resolveRegistryIcon } from '~/data/iconRegistry'
import { buildImageUrl } from '~/utils/sanity'

interface SanityStatusItem {
  _id: string
  label: string
  title: string
  content?: string
  link?: string
  image?: { asset: { _ref: string }; alt?: string }
  icon?: string
  order?: number
}

export function useSanityStatus() {
  const { data: rawStatus, pending: loading, error, refresh } = useFetch<SanityStatusItem[]>('/api/sanity-status', {
    key: 'sanity-status',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })

  const statusItems = computed<StatusItem[]>(() => {
    if (!rawStatus.value || !Array.isArray(rawStatus.value)) return []

    return rawStatus.value.map((item: SanityStatusItem) => {
      const icon = resolveRegistryIcon(item.icon)
      const image =
        !icon && item.image ? buildImageUrl(item.image, 'icon') : ''
      return {
        type: 'Logo',
        label: item.label || '',
        title: item.title || '',
        content: item.content || '',
        link: item.link?.trim() || '',
        images: image ? [image] : [],
        icon,
      }
    })
  })

  return {
    statusItems,
    loading,
    error,
    refresh,
  }
}
