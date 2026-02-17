export interface ProjectStorySection {
  heading: string
  body: string
  image: string
}

export interface ProjectItem {
  slug: string
  name: string
  category: string
  year: string
  summary: string
  thumbnail: string
  protected?: boolean
  tags: string[]
  sections: ProjectStorySection[]
}

export const projectPasswords: Record<string, string> = {
  mosaic: 'letmein!2024',
  you: 'letmein!2024',
}

export const projects: ProjectItem[] = [
  {
    slug: 'mosaic',
    name: 'Mosaic Finance Suite',
    category: 'Fintech',
    year: '2025',
    summary:
      'Placeholder case study for a strategic finance workspace that helps teams forecast scenarios and align stakeholders.',
    thumbnail: 'https://picsum.photos/seed/mosaic/1280/720',
    protected: true,
    tags: ['Strategy', 'Data Product', 'B2B'],
    sections: [
      {
        heading: 'Challenge',
        body: 'The legacy workflow fragmented planning, reporting, and narrative updates across disconnected tools. The redesign centered around one connected operating rhythm.',
        image: 'https://picsum.photos/seed/mosaic-challenge/1280/720',
      },
      {
        heading: 'Approach',
        body: 'We created a planning canvas with model blocks, scenario snapshots, and approval checkpoints. Each block surfaced clear confidence levels and owner context.',
        image: 'https://picsum.photos/seed/mosaic-approach/1280/720',
      },
      {
        heading: 'Outcome',
        body: 'Teams reduced model handoff time and gained a single source of truth for decision making. Leadership updates became faster and easier to trust.',
        image: 'https://picsum.photos/seed/mosaic-outcome/1280/720',
      },
    ],
  },
  {
    slug: 'you',
    name: 'Conversational Search Platform',
    category: 'AI Product',
    year: '2026',
    summary:
      'Placeholder case study for a multi-modal assistant experience focused on confidence, transparency, and task speed.',
    thumbnail: 'https://picsum.photos/seed/you-search/1280/720',
    protected: true,
    tags: ['AI', 'Conversation Design', 'Rapid Prototyping'],
    sections: [
      {
        heading: 'Problem Space',
        body: 'Users liked conversational output but struggled to judge reliability. The product needed clearer framing of source quality and confidence.',
        image: 'https://picsum.photos/seed/you-problem/1280/720',
      },
      {
        heading: 'Design Direction',
        body: 'The response panel evolved into modular cards: answer, confidence meter, references, and next-step actions. This made scanning and follow-up easier.',
        image: 'https://picsum.photos/seed/you-direction/1280/720',
      },
      {
        heading: 'Impact',
        body: 'First-time success rates improved in usability tests, while trust signals increased repeated use over long sessions.',
        image: 'https://picsum.photos/seed/you-impact/1280/720',
      },
    ],
  },
  {
    slug: 'teladerma',
    name: 'Telederma Care',
    category: 'Brand Identity',
    year: '2024',
    summary:
      'A complete visual identity system for a telehealth dermatology startup, balancing clinical trust with approachable warmth.',
    thumbnail: 'https://picsum.photos/seed/teladerma/1280/720',
    tags: ['Branding', 'Logo Design', 'Visual Identity', 'Healthcare'],
    sections: [
      {
        heading: 'The Challenge',
        body: 'Telederma Care needed a brand that stood apart from cold, clinical healthcare aesthetics while maintaining credibility. Their original identity felt sterile and forgettable—patients reported feeling anxious rather than reassured. The goal: create a visual system that communicates medical expertise without sacrificing approachability.',
        image: 'https://picsum.photos/seed/teladerma-challenge/1280/720',
      },
      {
        heading: 'Research & Strategy',
        body: 'We conducted competitor audits and patient interviews across three demographics. Key insights: patients valued warmth over authority, skin tones evoked care and healing, and circular forms suggested completeness and recovery. The strategy positioned Telederma as "expert care, human touch"—professional yet personal.',
        image: 'https://picsum.photos/seed/teladerma-research/1280/720',
      },
      {
        heading: 'Logo Development',
        body: 'The final mark combines a shield form (protection, trust) with organic curves representing skin layers. The overlapping elements create a subtle "T" monogram while the rounded corners soften the clinical association. A secondary wordmark pairs a geometric sans-serif with gentle tracking for readability at small sizes.',
        image: 'https://picsum.photos/seed/teladerma-logo/1280/720',
      },
      {
        heading: 'Color System',
        body: 'Primary palette centers on a calming sage green—evoking nature, healing, and freshness without the coldness of clinical blue. Accents include warm terracotta (approachability) and soft cream backgrounds. A full light/dark mode specification ensures consistency across digital and print applications.',
        image: 'https://picsum.photos/seed/teladerma-color/1280/720',
      },
      {
        heading: 'Typography & Graphics',
        body: 'Primary typeface: a modern geometric sans with humanist touches for body copy. Display headlines use a subtle serif for moments of authority. Iconography follows a 2px stroke weight with rounded caps, creating a friendly yet precise visual language. Custom illustrations depict diverse skin tones and body-positive imagery.',
        image: 'https://picsum.photos/seed/teladerma-type/1280/720',
      },
      {
        heading: 'Brand Guidelines',
        body: 'Delivered a 48-page brand book covering logo usage, spacing rules, color specifications with Pantone/CMYK/HEX values, typography scales, photography direction, and application examples across web, mobile, print collateral, and environmental signage.',
        image: 'https://picsum.photos/seed/teladerma-guidelines/1280/720',
      },
      {
        heading: 'Impact',
        body: 'Post-rebrand patient surveys showed a 34% increase in "feeling confident about care quality" at first impression. The identity scaled successfully to app store assets, social media templates, physician onboarding materials, and clinic wayfinding signage.',
        image: 'https://picsum.photos/seed/teladerma-impact/1280/720',
      },
    ],
  },
  {
    slug: 'orbit-ops',
    name: 'Orbit Ops Console',
    category: 'SaaS',
    year: '2023',
    summary:
      'Placeholder case study for an operations control center with alert triage and workflow automation.',
    thumbnail: 'https://picsum.photos/seed/orbitops/1280/720',
    tags: ['Dashboard', 'Systems', 'Workflow'],
    sections: [
      {
        heading: 'Operations Context',
        body: 'Operators had to jump across many tabs for one incident. We designed a timeline + action panel to keep context intact.',
        image: 'https://picsum.photos/seed/orbitops-context/1280/720',
      },
      {
        heading: 'Automation Surface',
        body: 'Rule cards made automation visible and editable by non-technical team leads, reducing dependency on engineering.',
        image: 'https://picsum.photos/seed/orbitops-rules/1280/720',
      },
      {
        heading: 'Measured Value',
        body: 'Average incident response time dropped with clearer sequencing and less switching cost between tools.',
        image: 'https://picsum.photos/seed/orbitops-value/1280/720',
      },
    ],
  },
]
