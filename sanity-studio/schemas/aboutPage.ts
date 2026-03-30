import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      type: 'object',
      title: 'Hero Section',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'avatar',
          type: 'image',
          title: 'Avatar',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        }),
        defineField({
          name: 'availabilityText',
          type: 'string',
          title: 'Availability Text',
          description: 'e.g., "Available for freelance"',
          initialValue: 'Available for freelance',
        }),
      ],
    }),
    defineField({
      name: 'story',
      type: 'array',
      title: 'Background Story',
      description: 'Paragraphs for the background section',
      of: [{ type: 'text', rows: 4 }],
    }),
    defineField({
      name: 'experiences',
      type: 'array',
      title: 'Experience',
      of: [
        {
          type: 'object',
          name: 'experienceEntry',
          title: 'Experience Entry',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Job Title',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'company',
              type: 'string',
              title: 'Company',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'year',
              type: 'string',
              title: 'Year Range',
              description: 'e.g., "2024 - Present"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 3,
            }),
            defineField({
              name: 'logo',
              type: 'image',
              title: 'Company Logo',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            }),
          ],
          preview: {
            select: { title: 'company', subtitle: 'title', media: 'logo' },
          },
        },
      ],
    }),
    defineField({
      name: 'capabilities',
      type: 'array',
      title: 'Capabilities',
      description: 'Skills and software — each tagged with a category for grouping',
      of: [
        {
          type: 'object',
          name: 'capability',
          title: 'Capability',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'category',
              type: 'string',
              title: 'Category',
              description: 'e.g., Design, Digital, Software',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'category' },
          },
        },
      ],
    }),
    defineField({
      name: 'resumeUrl',
      type: 'url',
      title: 'Resume URL',
      description: 'Link to downloadable resume PDF',
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ['http', 'https'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'hero.name',
      subtitle: 'hero.availabilityText',
      media: 'hero.avatar',
    },
  },
})
