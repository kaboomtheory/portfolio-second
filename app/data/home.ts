export interface StatusItem {
  type: 'Logo' | 'Games' | 'Music'
  label: string
  title: string
  content: string
  link: string
  images: string[]
  icon?: string
}

/** One hero tagline line: plain segments + optional emphasized phrase */
export interface HomeHeroTaglineLine {
  segments: { text: string; em?: boolean }[]
}

export const homeHero = {
  title: 'Bryan X. Mendez',
  /** Scannable lines; `em` renders as strong for key terms */
  taglines: [
    {
      segments: [
        { text: 'Bryan Mendez is a multidisciplinary designer with a sharp eye for ' },
        { text: 'branding', em: true },
        { text: ', hands-on experience across ' },
        { text: 'digital marketing, web, print, and packaging', em: true },
        { text: ', and a natural pull toward wherever the ' },
        { text: 'most interesting visual problem', em: true },
        { text: ' is.' },
      ],
    },
  ] satisfies HomeHeroTaglineLine[],
  description: '',
}

export interface AboutMeData {
  name: string
  avatar: string
  intro: string
  story: string[]
  skills: { category: string; items: string[] }[]
  tools: string[]
  interests: { icon: string; label: string }[]
}

export const aboutMe: AboutMeData = {
  name: 'Bryan X. Mendez',
  avatar: 'https://picsum.photos/seed/avery-profile/400/400',
  intro:
    'I work on brand identities, packaging, and digital experiences, with a focus on craft, clarity, and work that feels intentional.',
  story: [
    'I studied Graphic Design at Cal State Northridge, where I got my first taste of collaborative creative work developing print, digital, and social media campaigns at IntersectLA alongside a team of 20+ creatives.',
    'From there I spent several years honing my craft across branding, packaging, and visual identity before landing at NAXA Electronics, where I now lead brand design for the Victor and Emerson product lines. My work spans marketing assets for major retail platforms, product packaging, Shopify storefronts, and sales materials for events like CES.',
  ],
  skills: [
    { category: 'Design', items: ['Branding', 'Logo Design', 'Print Design', 'Packaging Design', 'Visual Design'] },
    { category: 'Digital', items: ['Web Design', 'UX Design', 'CSS/HTML', 'Photo Manipulation', 'Stable Diffusion'] },
  ],
  /** Software only (disciplines live under skills) */
  tools: [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe InDesign',
    'Adobe Creative Suite',
    'Figma',
    'Framer',
    'Blender',
    'Easy Catalog',
  ],
  interests: [
    { icon: 'lucide:camera', label: 'Film Photography' },
    { icon: 'lucide:mountain', label: 'Hiking' },
    { icon: 'lucide:music', label: 'Vinyl Records' },
    { icon: 'lucide:book-open', label: 'Sci-Fi Novels' },
    { icon: 'lucide:gamepad-2', label: 'Indie Games' },
    { icon: 'lucide:coffee', label: 'Specialty Coffee' },
  ],
}

export const currentStatus: StatusItem[] = [
  {
    type: 'Games',
    label: 'Currently Watching',
    title: 'A Knight of the Seven Kingdoms',
    content: '',
    link: '',
    images: ['/KOTSK.jpg'],
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
    label: 'Currently Listening',
    title: 'Grace',
    content: 'Jeff Buckley',
    link: '',
    images: ['https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Jeff_Buckley_grace.jpg/250px-Jeff_Buckley_grace.jpg'],
  },
]
