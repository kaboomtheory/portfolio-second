import type { PortableTextBlock } from '@portabletext/types'

export type AboutStory = string[] | PortableTextBlock[]

export function isPortableTextStory(story: AboutStory | undefined): story is PortableTextBlock[] {
  if (!story?.length) return false
  const first = story[0]
  return typeof first === 'object' && first !== null && '_type' in first
}

export function portableTextBlockKey(block: PortableTextBlock, index: number): string {
  return block._key || `story-block-${index}`
}
