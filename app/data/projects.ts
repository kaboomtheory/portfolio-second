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
    category: 'Healthtech',
    year: '2024',
    summary:
      'Placeholder case study for a remote dermatology platform focused on clarity, comfort, and treatment follow-through.',
    thumbnail: 'https://picsum.photos/seed/teladerma/1280/720',
    tags: ['Brand', 'Service Design', 'Mobile'],
    sections: [
      {
        heading: 'Brand Reset',
        body: 'We replaced clinical language with a warm, outcome-focused voice while keeping medical trust cues intact.',
        image: 'https://picsum.photos/seed/teladerma-brand/1280/720',
      },
      {
        heading: 'Flow Redesign',
        body: 'Intake, diagnosis, and care plans were consolidated into a single step-by-step flow for less cognitive load.',
        image: 'https://picsum.photos/seed/teladerma-flow/1280/720',
      },
      {
        heading: 'Result',
        body: 'New patients completed intake faster and reported a stronger sense of confidence in next steps.',
        image: 'https://picsum.photos/seed/teladerma-result/1280/720',
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
