import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // === Basic Identification ===
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      type: 'string',
      title: 'Project Name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Display Order',
      description: 'Controls position on homepage mosaic (0 = first). Leave empty to sort alphabetically.',
      initialValue: 0,
    }),

    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
    }),

    // === Description ===
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary',
      rows: 3,
    }),

    // === Project Metadata ===
    defineField({
      name: 'client',
      type: 'string',
      title: 'Client Name',
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Your Role',
      description: 'e.g., Lead Designer, Creative Director',
    }),
    defineField({
      name: 'projectUrl',
      type: 'url',
      title: 'Live Project URL',
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'color',
      type: 'string',
      title: 'Project Accent Color',
      description: 'Hex color for project theming (e.g., #FF5500)',
    }),
    defineField({
      name: 'collaborators',
      type: 'array',
      title: 'Collaborators',
      of: [
        defineType({
          type: 'object',
          name: 'collaborator',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name' }),
            defineField({ name: 'role', type: 'string', title: 'Role' }),
            defineField({ name: 'url', type: 'url', title: 'Website/Profile URL' }),
          ],
        }),
      ],
    }),

    // === Thumbnail ===
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),

    // === Content Blocks ===
    defineField({
      name: 'sections',
      type: 'array',
      title: 'Content Blocks',
      of: [
        // Text Section
        defineType({
          type: 'object',
          name: 'textSection',
          title: 'Text Section',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Heading' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 4 }),
          ],
        }),

        // Legacy Section (for backward compatibility with existing data)
        defineType({
          type: 'object',
          name: 'section',
          title: 'Section (Legacy)',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Heading' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 4 }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            }),
          ],
        }),

        // Single Image
        defineType({
          type: 'object',
          name: 'singleImage',
          title: 'Single Image',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            }),
            defineField({
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: {
                list: [
                  { title: 'Full Width', value: 'full' },
                  { title: 'Large', value: 'large' },
                  { title: 'Medium', value: 'medium' },
                ],
              },
              initialValue: 'large',
            }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),

        // Image Gallery
        defineType({
          type: 'object',
          name: 'imageGallery',
          title: 'Image Gallery',
          fields: [
            defineField({
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: {
                list: [
                  { title: '2 Column', value: 'two-col' },
                  { title: '3 Column', value: 'three-col' },
                  { title: '4 Column', value: 'four-col' },
                  { title: 'Masonry', value: 'masonry' },
                ],
              },
              initialValue: 'two-col',
            }),
            defineField({
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [
                defineType({
                  type: 'object',
                  name: 'galleryImage',
                  fields: [
                    defineField({
                      name: 'image',
                      type: 'image',
                      options: { hotspot: true },
                    }),
                    defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
                    defineField({ name: 'caption', type: 'string', title: 'Caption' }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Image + Text Side by Side
        defineType({
          type: 'object',
          name: 'imageTextBlock',
          title: 'Image & Text',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            }),
            defineField({ name: 'heading', type: 'string', title: 'Heading' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 4 }),
            defineField({
              name: 'position',
              type: 'string',
              title: 'Image Position',
              options: {
                list: [
                  { title: 'Image Left', value: 'left' },
                  { title: 'Image Right', value: 'right' },
                ],
              },
              initialValue: 'left',
            }),
          ],
        }),

        // Video Embed
        defineType({
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            defineField({ name: 'url', type: 'url', title: 'Video URL (YouTube/Vimeo)' }),
            defineField({
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: {
                list: [
                  { title: 'Full Width', value: 'full' },
                  { title: 'Large', value: 'large' },
                  { title: 'Medium', value: 'medium' },
                ],
              },
              initialValue: 'large',
            }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),

        // Quote / Testimonial
        defineType({
          type: 'object',
          name: 'quote',
          title: 'Quote / Testimonial',
          fields: [
            defineField({ name: 'quote', type: 'text', title: 'Quote', rows: 3 }),
            defineField({ name: 'author', type: 'string', title: 'Author' }),
            defineField({ name: 'role', type: 'string', title: 'Author Role/Title' }),
          ],
        }),

        // Stats Row
        defineType({
          type: 'object',
          name: 'statsRow',
          title: 'Statistics Row',
          fields: [
            defineField({
              name: 'stats',
              type: 'array',
              title: 'Statistics',
              of: [
                defineType({
                  type: 'object',
                  name: 'stat',
                  fields: [
                    defineField({ name: 'value', type: 'string', title: 'Value (e.g., 150%)' }),
                    defineField({ name: 'label', type: 'string', title: 'Label' }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Spacer / Divider
        defineType({
          type: 'object',
          name: 'spacer',
          title: 'Spacer',
          fields: [
            defineField({
              name: 'size',
              type: 'string',
              title: 'Size',
              options: {
                list: [
                  { title: 'Small', value: 'small' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Large', value: 'large' },
                ],
              },
              initialValue: 'medium',
            }),
          ],
        }),
      ],
    }),

    // === Protection ===
    defineField({
      name: 'protected',
      type: 'boolean',
      title: 'Password Protected',
      initialValue: false,
    }),
    defineField({
      name: 'password',
      type: 'string',
      title: 'Password',
      hidden: ({ document }) => !document?.protected,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      tags: 'tags',
      client: 'client',
      media: 'thumbnail',
    },
    prepare({ title, tags, client, media }) {
      const tagList = Array.isArray(tags) ? tags.filter(Boolean).slice(0, 3).join(', ') : ''
      const subtitle = client?.trim() || tagList || undefined
      return { title, subtitle, media }
    },
  },
})
