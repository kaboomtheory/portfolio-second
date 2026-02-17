export interface FriendItem {
  name: string
  title: string
  tags: string[]
  link: string
  image: string
}

export const friends: FriendItem[] = [
  {
    name: 'Nora Campos',
    title: 'Design Director at Northfield',
    tags: ['Design', 'Leadership'],
    link: 'https://example.com/nora',
    image: 'https://picsum.photos/seed/friend-nora/220/220',
  },
  {
    name: 'Evan Rhee',
    title: 'Staff Product Designer',
    tags: ['Product', 'Research'],
    link: 'https://example.com/evan',
    image: 'https://picsum.photos/seed/friend-evan/220/220',
  },
  {
    name: 'Maya Patel',
    title: 'Brand Strategist',
    tags: ['Brand', 'Writing'],
    link: 'https://example.com/maya',
    image: 'https://picsum.photos/seed/friend-maya/220/220',
  },
  {
    name: 'Theo Kim',
    title: 'Creative Developer',
    tags: ['Code', 'Motion'],
    link: 'https://example.com/theo',
    image: 'https://picsum.photos/seed/friend-theo/220/220',
  },
  {
    name: 'Lina Forbes',
    title: 'Principal Designer',
    tags: ['Design', 'Mentorship'],
    link: 'https://example.com/lina',
    image: 'https://picsum.photos/seed/friend-lina/220/220',
  },
  {
    name: 'Jules Moreno',
    title: 'Creative Producer',
    tags: ['Brand', 'Operations'],
    link: 'https://example.com/jules',
    image: 'https://picsum.photos/seed/friend-jules/220/220',
  },
]
