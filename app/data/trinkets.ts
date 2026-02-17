export interface TrinketItem {
  id: string
  name: string
  brand: string
  description: string
  image: string
  link: string
  featured?: boolean
}

export const trinkets: TrinketItem[] = [
  {
    id: 'field-notebook',
    name: 'Pocket Field Notebook',
    brand: 'North Paper Co.',
    description: 'A compact ruled notebook for quick capture during workshops, calls, and commute ideation.',
    image: 'https://picsum.photos/seed/trinket-notebook/700/700',
    link: 'https://example.com/notebook',
    featured: true,
  },
  {
    id: 'desk-lamp',
    name: 'Warm Desk Lamp',
    brand: 'Studio Light',
    description: 'Adjustable matte lamp that keeps evening sessions comfortable without harsh glare.',
    image: 'https://picsum.photos/seed/trinket-lamp/700/700',
    link: 'https://example.com/lamp',
    featured: true,
  },
  {
    id: 'keychron-keyboard',
    name: 'Mechanical Keyboard',
    brand: 'Typecraft',
    description: 'Reliable keyboard with tactile feedback and a calm sound profile for long writing sessions.',
    image: 'https://picsum.photos/seed/trinket-keyboard/700/700',
    link: 'https://example.com/keyboard',
    featured: true,
  },
  {
    id: 'camera-bag',
    name: 'Compact Camera Sling',
    brand: 'Carryline',
    description: 'Small sling for daily walks and weekend photo studies. Minimal footprint, quick access.',
    image: 'https://picsum.photos/seed/trinket-camera/700/700',
    link: 'https://example.com/camera-bag',
    featured: true,
  },
  {
    id: 'espresso-cup',
    name: 'Stone Espresso Cup',
    brand: 'Clayroom',
    description: 'A heavy ceramic cup that keeps heat longer and makes mornings feel intentional.',
    image: 'https://picsum.photos/seed/trinket-cup/700/700',
    link: 'https://example.com/cup',
  },
  {
    id: 'planner-pad',
    name: 'Weekly Planner Pad',
    brand: 'Plain Grid',
    description: 'Simple tear-off planner for weekly priorities and team sync prep.',
    image: 'https://picsum.photos/seed/trinket-planner/700/700',
    link: 'https://example.com/planner',
  },
]
