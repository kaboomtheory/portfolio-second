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
        { text: 'Multidisciplinary designer' },
        { text: ' crafting ' },
        { text: 'sharp brand visuals' },
        { text: ' across ' },
        { text: 'digital, web, print, and packaging.', em: true },
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
    'From there I spent several years freelancing across branding, packaging, and visual identity, then joined NAXA Electronics, where I designed marketing assets, packaging, Shopify storefronts, and CES sales materials for the Victor and Emerson product lines.',
    'Today I\u2019m a designer at Citrus Studios in Los Angeles, building brands, websites, and social media assets for small businesses and organizations, with a focus on accessibility, SEO, and site performance.',
  ],
  skills: [
    { category: 'Design', items: ['Branding', 'Logo Design', 'Packaging Design', 'Print Design', 'Photo Manipulation'] },
    { category: 'Web', items: ['Web Design', 'UX Design', 'WordPress', 'Shopify', 'Wix', 'Framer', 'CSS/HTML', 'WCAG/ADA Accessibility', 'SEO'] },
  ],
  /** Software only (disciplines live under skills) */
  tools: [
    'Figma',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe InDesign',
    'Adobe After Effects',
    'Blender',
    'Easy Catalog',
    'Airtable',
    'Claude',
    'ComfyUI',
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
