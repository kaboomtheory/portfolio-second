import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Hero Title',
      validation: (rule) => rule.required(),
      initialValue: 'Bryan X. Mendez',
    }),
    defineField({
      name: 'taglines',
      type: 'array',
      title: 'Taglines',
      description: 'Each line can have multiple segments, with optional emphasis on key phrases',
      of: [
        {
          type: 'object',
          name: 'taglineLine',
          title: 'Tagline Line',
          fields: [
            defineField({
              name: 'segments',
              type: 'array',
              title: 'Segments',
              of: [
                {
                  type: 'object',
                  name: 'taglineSegment',
                  title: 'Segment',
                  fields: [
                    defineField({
                      name: 'text',
                      type: 'string',
                      title: 'Text',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'em',
                      type: 'boolean',
                      title: 'Emphasize',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: 'text', em: 'em' },
                    prepare({ title, em }) {
                      return { title: em ? `**${title}**` : title }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { segments: 'segments' },
            prepare({ segments }) {
              const text = (segments || []).map((s: { text: string }) => s.text).join('')
              return { title: text || 'Empty line' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'intro',
      type: 'text',
      title: 'Intro Paragraph',
      rows: 3,
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Contact Email',
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      title: 'Social Links',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              type: 'string',
              title: 'Icon',
              description: 'Iconify icon identifier, e.g. ri:linkedin-fill, lucide:github',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule) =>
                rule.required().uri({
                  allowRelative: false,
                  scheme: ['http', 'https', 'mailto'],
                }),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
