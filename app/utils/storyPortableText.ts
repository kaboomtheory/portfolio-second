import { h } from 'vue'

export const storyPortableTextComponents = {
  marks: {
    link: ({ value }, { slots }) => {
      const href = value?.href
      if (!href) return slots.default?.()
      const rel = href.startsWith('/') ? undefined : 'noreferrer noopener'
      return h(
        'a',
        {
          href,
          rel,
          class: 'underline underline-offset-2 decoration-[color:var(--fg-muted)]',
        },
        slots.default?.(),
      )
    },
  },
  block: {
    normal: (_, { slots }) => h('p', { class: 'm-0' }, slots.default?.()),
    blockquote: (_, { slots }) =>
      h('blockquote', { class: 'm-0 border-l-2 border-[color:var(--border-subtle)] pl-4 italic' }, slots.default?.()),
  },
  list: {
    bullet: (_, { slots }) => h('ul', { class: 'm-0 list-disc pl-5' }, slots.default?.()),
    number: (_, { slots }) => h('ol', { class: 'm-0 list-decimal pl-5' }, slots.default?.()),
  },
}
