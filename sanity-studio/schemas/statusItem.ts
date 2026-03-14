import { defineField, defineType } from 'sanity'

export const statusItem = defineType({
  name: 'statusItem',
  title: 'Status Item',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'e.g., Currently Watching, Currently Playing',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Main title of the item',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'string',
      title: 'Content',
      description: 'Subtitle or secondary text (e.g., artist name)',
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link URL',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description: 'Iconify icon name (e.g., lucide:music). If provided, image is hidden.',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Order',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
      media: 'image',
    },
  },
})
