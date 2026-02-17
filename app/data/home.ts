export interface StatusItem {
  type: 'Logo' | 'Games' | 'Music'
  label: string
  title: string
  content: string
  link: string
  images: string[]
  icon?: string
}

export const homeHero = {
  title: 'Designing thoughtful brand and product experiences.',
  subtitle: 'Based in Orange County, CA.',
  description:
    'This MVP clone uses placeholder content to mirror the structure and rhythm of the original portfolio experience.',
}

export interface AboutMeData {
  name: string
  role: string
  location: string
  avatar: string
  intro: string
  story: string[]
  skills: { category: string; items: string[] }[]
  tools: string[]
  interests: { icon: string; label: string }[]
  facts: { label: string; value: string }[]
}

export const aboutMe: AboutMeData = {
  name: 'Avery Holt',
  role: 'Product Designer & Creative Technologist',
  location: 'Orange County, CA',
  avatar: 'https://picsum.photos/seed/avery-profile/400/400',
  intro: 'I design digital products that feel like they were made for humans, not users.',
  story: [
    'My journey started in architecture—thinking about how people move through physical spaces. Eventually I realized the same principles apply to digital ones, just with faster iteration cycles and way less concrete.',
    'Now I spend my time at the intersection of design and engineering, building products that are both beautiful and functional. I believe the best design is invisible—it just works.',
    'When I\'m not pushing pixels, you\'ll find me exploring hiking trails, experimenting with film photography, or diving down some obscure Wikipedia rabbit hole at 2am.',
  ],
  skills: [
    { category: 'Design', items: ['Product Strategy', 'Design Systems', 'Prototyping', 'User Research', 'Visual Design'] },
    { category: 'Development', items: ['Vue/Nuxt', 'React', 'TypeScript', 'Tailwind CSS', 'Motion Design'] },
    { category: 'Other', items: ['Figma Wizardry', 'Presentation Design', 'Workshop Facilitation', 'Coffee Making'] },
  ],
  tools: ['Figma', 'VS Code', 'Blender', 'After Effects', 'Notion', 'Arc Browser'],
  interests: [
    { icon: 'lucide:camera', label: 'Film Photography' },
    { icon: 'lucide:mountain', label: 'Hiking' },
    { icon: 'lucide:music', label: 'Vinyl Records' },
    { icon: 'lucide:book-open', label: 'Sci-Fi Novels' },
    { icon: 'lucide:gamepad-2', label: 'Indie Games' },
    { icon: 'lucide:coffee', label: 'Specialty Coffee' },
  ],
  facts: [
    { label: 'Years Designing', value: '7+' },
    { label: 'Projects Shipped', value: '50+' },
    { label: 'Coffee Consumed', value: '∞' },
    { label: 'Git Commits', value: '2,847' },
  ],
}

export const currentStatus: StatusItem[] = [
  {
    type: 'Logo',
    label: 'This sandwich',
    title: 'Website',
    content: '',
    link: '',
    images: [],
    icon: 'lucide:hard-hat',
  },
  {
    type: 'Games',
    label: 'Currently Playing',
    title: 'Arc Raiders',
    content: '',
    link: '',
    images: ['/arc-raiders.jpg'],
  },
  {
    type: 'Music',
    label: 'Current Listens',
    title: 'Grace',
    content: 'Jeff Buckley',
    link: '',
    images: ['https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Jeff_Buckley_grace.jpg/250px-Jeff_Buckley_grace.jpg'],
  },
]
