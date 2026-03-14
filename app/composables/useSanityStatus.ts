import type { StatusItem } from '~/data/home'
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
  const { data: rawStatus, pending: loading, error, refresh } = useLazyFetch<SanityStatusItem[]>('/api/sanity-status')

  const statusItems = computed<StatusItem[]>(() => {
    if (!rawStatus.value || !Array.isArray(rawStatus.value)) return []

    return rawStatus.value.map((item: SanityStatusItem) => ({
      type: 'Logo',
      label: item.label || '',
      title: item.title || '',
      content: item.content || '',
      link: item.link || '',
      images: item.image ? [buildImageUrl(item.image)] : [],
      icon: item.icon,
    }))
  })

  return {
    statusItems,
    loading,
    error,
    refresh,
  }
}
