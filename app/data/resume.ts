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
    title: 'Senior Product Designer',
    company: 'You.com',
    year: '2025 - Present',
    description:
      'Designed conversational AI surfaces focused on answer trust, task continuity, and multimodal interactions.',
    image: 'https://picsum.photos/seed/logo-you/120/120',
  },
  {
    title: 'Senior Product Designer II',
    company: 'Mosaic Finance',
    year: '2023 - 2025',
    description:
      'Led product strategy and interface architecture for planning workflows, model views, and executive reporting.',
    image: 'https://picsum.photos/seed/logo-mosaic/120/120',
  },
  {
    title: 'Design Manager',
    company: 'AuditBoard',
    year: '2021 - 2023',
    description:
      'Managed brand and digital initiatives across events, campaigns, and key product launch moments.',
    image: 'https://picsum.photos/seed/logo-audit/120/120',
  },
  {
    title: 'Founding Designer',
    company: 'A Parent Media Co.',
    year: '2018 - 2021',
    description:
      'Built early product and brand foundations for a family-focused streaming platform spanning multiple devices.',
    image: 'https://picsum.photos/seed/logo-apmc/120/120',
  },
]

export const clients: ClientItem[] = [
  {
    name: 'Northbound Studio',
    tags: ['Brand Systems', 'Website'],
    year: '2026',
  },
  {
    name: 'Lumen Therapeutics',
    tags: ['Product Strategy', 'UX'],
    year: '2025',
  },
  {
    name: 'Pilotwave',
    tags: ['Design Ops', 'Prototyping'],
    year: '2024',
  },
]
