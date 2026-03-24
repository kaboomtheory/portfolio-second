export interface ExperienceItem {
  title: string
  company: string
  year: string
  description: string
  image: string
}

export interface ClientItem {
  name: string
  tags: string[]
  year: string
}

export const experiences: ExperienceItem[] = [
  {
    title: 'Graphic Designer',
    company: 'NAXA Electronics',
    year: '2024 - Present',
    description:
      'Led brand and marketing asset design for the Victor and Emerson product lines, including packaging for 20+ new products, retail materials for Amazon and Walmart, redesigned Shopify landing and product pages, and catalogs and sales sheets for CES 2025.',
    image: 'https://picsum.photos/seed/logo-naxa/120/120',
  },
  {
    title: 'Freelance Graphic Designer',
    company: 'Freelance',
    year: '2018 - 2024',
    description:
      'Freelance graphic design on client projects spanning branding, logo design, packaging, print layout, and brochures for small businesses, YouTube creators, and companies in cosmetics and finance.',
    image: 'https://picsum.photos/seed/logo-freelance/120/120',
  },
  {
    title: 'Graphic Designer',
    company: 'IntersectLA (Formerly VISCOM)',
    year: '2017 - 2018',
    description:
      'Collaborated with a team of 20+ creatives to execute strategies across 10+ projects with a 100% client satisfaction rate. Developed print, digital, and social media assets spanning posters, banners, and branded content.',
    image: 'https://picsum.photos/seed/logo-intersect/120/120',
  },
]

export const clients: ClientItem[] = [
  {
    name: 'Victor & Emerson — CES 2025',
    tags: ['Print', 'Catalogs', 'Salesheets'],
    year: '2025',
  },
  {
    name: 'Amazon & Walmart Retail',
    tags: ['Marketing Assets', 'Packaging', 'Web'],
    year: '2024',
  },
  {
    name: 'IntersectLA — Creative Campaigns',
    tags: ['Print', 'Digital', 'Social Media'],
    year: '2017',
  },
]
