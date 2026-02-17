export interface StatusItem {
  type: 'Logo' | 'Games' | 'Music'
  label: string
  title: string
  content: string
  link: string
  images: string[]
}

export const homeHero = {
  title: 'Designing thoughtful brand and product experiences.',
  subtitle: 'Based in Orange County, CA.',
  description:
    'This MVP clone uses placeholder content to mirror the structure and rhythm of the original portfolio experience.',
}

export const currentStatus: StatusItem[] = [
  {
    type: 'Logo',
    label: 'Now Building',
    title: 'A pattern-first dashboard toolkit',
    content: 'Exploring reusable information architecture for data-heavy product teams.',
    link: 'https://example.com/placeholder',
    images: [
      'https://picsum.photos/seed/status-logo-1/240/160',
      'https://picsum.photos/seed/status-logo-2/240/160',
    ],
  },
  {
    type: 'Games',
    label: 'Currently Playing',
    title: 'Slow strategy and puzzle sessions',
    content: 'A balance between systems thinking and decompression.',
    link: 'https://example.com/games',
    images: [
      'https://picsum.photos/seed/status-games-1/240/160',
      'https://picsum.photos/seed/status-games-2/240/160',
    ],
  },
  {
    type: 'Music',
    label: 'On Repeat',
    title: 'Ambient focus playlists',
    content: 'Low-key textures for deep work and writing windows.',
    link: 'https://example.com/music',
    images: ['https://picsum.photos/seed/status-music/240/160'],
  },
]
