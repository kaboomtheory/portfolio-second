export interface WritingItem {
  id: string
  title: string
  subtitle: string
  excerpt: string
  date: string
  tags: string[]
  heroImage: string
  body: string[]
}

export const writings: WritingItem[] = [
  {
    id: 'you-should-not-become-a-designer',
    title: 'You probably should not become a designer',
    subtitle: 'A placeholder long-form reflection on craft, expectations, and career narratives.',
    excerpt:
      'Design can be deeply rewarding, but the day-to-day work often looks different from what social media suggests.',
    date: '2026-01-18',
    tags: ['Career', 'Opinion'],
    heroImage: 'https://picsum.photos/seed/writing-career/1200/700',
    body: [
      'This placeholder article explores the mismatch between early expectations and real project constraints. Most teams need clear decisions, not visual fireworks.',
      'In practice, designers spend a lot of time clarifying goals, negotiating trade-offs, and building trust with engineers, PMs, and stakeholders.',
      'The craft still matters. It just lives inside systems thinking, communication, and consistency over one-off cleverness.',
    ],
  },
  {
    id: 'building-a-portfolio-that-works',
    title: 'Build a portfolio that helps people hire you',
    subtitle: 'Placeholder practical notes for framing project work with context and outcomes.',
    excerpt:
      'A strong portfolio is less about volume and more about showing your choices, process, and measurable impact.',
    date: '2025-11-02',
    tags: ['Portfolio', 'Process'],
    heroImage: 'https://picsum.photos/seed/writing-portfolio/1200/700',
    body: [
      'Most reviewers scan quickly. Lead with the problem, your role, and why your decisions mattered.',
      'Use fewer projects, but make each one clear and credible. Replace vague claims with concrete evidence.',
      'Add frictionless navigation and readable layouts so content does not fight attention.',
    ],
  },
  {
    id: 'systems-over-screens',
    title: 'Design systems over single screens',
    subtitle: 'Placeholder essay on designing relationships, not isolated artifacts.',
    excerpt:
      'Teams scale better when design outputs are documented as decisions and reusable patterns.',
    date: '2025-06-10',
    tags: ['Systems', 'Product'],
    heroImage: 'https://picsum.photos/seed/writing-systems/1200/700',
    body: [
      'A screen is a moment. A system is behavior over time. Product quality depends on how those moments connect.',
      'Reusable patterns reduce accidental inconsistency and speed up iteration under deadlines.',
      'Design systems are not static libraries. They should evolve with product strategy and user feedback.',
    ],
  },
  {
    id: 'faster-feedback-loops',
    title: 'Faster feedback loops win teams',
    subtitle: 'Placeholder note on prototypes, rituals, and shrinking cycle time.',
    excerpt:
      'The teams that learn faster usually ship better outcomes, even without perfect initial plans.',
    date: '2025-02-27',
    tags: ['Collaboration', 'Iteration'],
    heroImage: 'https://picsum.photos/seed/writing-feedback/1200/700',
    body: [
      'Use lightweight prototypes to answer one critical question at a time.',
      'Capture decisions as reusable notes so future work starts with context, not confusion.',
      'Respect momentum: fewer handoffs and tighter loops produce compounding gains.',
    ],
  },
]
