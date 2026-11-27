import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Site-wide settings singleton (document id: "siteSettings").
 *
 * Holds content that was hardcoded in app/data/site.ts, app/data/home.ts,
 * nuxt.config.ts, AppFooter.vue and pages/privacy.vue, so the Astro rebuild
 * can read it from one query instead of shipping it in code.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'profile', title: 'Profile', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'contact', title: 'Contact & Social' },
    { name: 'personal', title: 'Personal' },
    { name: 'footer', title: 'Footer' },
    { name: 'privacy', title: 'Privacy Page' },
  ],
  fields: [
    // ── Profile (app/data/site.ts `profile`) ──────────────────────────
    defineField({
      name: 'profile',
      type: 'object',
      title: 'Profile',
      group: 'profile',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          validation: (rule) => rule.required(),
          initialValue: 'Bryan X. Mendez',
        }),
        defineField({
          name: 'role',
          type: 'string',
          title: 'Role',
          description: 'Shown in the home intro and used as jobTitle in structured data',
          validation: (rule) => rule.required(),
          initialValue: 'Visual Designer',
        }),
        defineField({
          name: 'location',
          type: 'object',
          title: 'Location',
          description: 'Display label plus the parts used for schema.org PostalAddress',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Display Label',
              initialValue: 'Los Angeles, CA',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'locality', type: 'string', title: 'City', initialValue: 'Los Angeles' }),
            defineField({ name: 'region', type: 'string', title: 'State / Region', initialValue: 'CA' }),
            defineField({
              name: 'country',
              type: 'string',
              title: 'Country Code',
              description: 'ISO 3166-1 alpha-2, e.g. US',
              initialValue: 'US',
              validation: (rule) => rule.length(2).uppercase(),
            }),
          ],
        }),
        defineField({
          name: 'photo',
          type: 'image',
          title: 'Profile Photo',
          description: 'Used for structured data and social previews',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        }),
      ],
    }),

    // ── SEO defaults (nuxt.config.ts) ─────────────────────────────────
    defineField({
      name: 'seo',
      type: 'object',
      title: 'Default SEO',
      group: 'seo',
      fields: [
        defineField({
          name: 'siteTitle',
          type: 'string',
          title: 'Site Title',
          initialValue: 'Bryan X. Mendez Graphic Design Portfolio',
          validation: (rule) => rule.required().max(70),
        }),
        defineField({
          name: 'titleSuffix',
          type: 'string',
          title: 'Title Suffix',
          description: 'Appended to page titles, e.g. "About — Bryan X. Mendez"',
          initialValue: 'Bryan X. Mendez',
        }),
        defineField({
          name: 'description',
          type: 'text',
          title: 'Default Meta Description',
          rows: 3,
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'ogImage',
          type: 'image',
          title: 'Default Social Share Image',
          description: '1200×630 recommended. Replaces /og-default.png',
        }),
      ],
    }),

    // ── Navigation (app/data/site.ts `navItems`) ──────────────────────
    defineField({
      name: 'navItems',
      type: 'array',
      title: 'Navigation',
      group: 'navigation',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          title: 'Nav Item',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Label',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'path',
              type: 'string',
              title: 'Path',
              description: 'Internal path or anchor, e.g. /#work or /about',
              validation: (rule) =>
                rule.required().custom((value) =>
                  !value || value.startsWith('/') ? true : 'Path must start with /',
                ),
            }),
            defineField({
              name: 'group',
              type: 'string',
              title: 'Group',
              options: { list: ['Work', 'Personal'], layout: 'radio', direction: 'horizontal' },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              type: 'string',
              title: 'Icon',
              description: 'Iconify identifier, e.g. lucide:house',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'path' } },
        }),
      ],
    }),

    // ── Contact & social (moves off homePage) ─────────────────────────
    defineField({
      name: 'contactEmail',
      type: 'string',
      title: 'Contact Email',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'availabilityText',
      type: 'string',
      title: 'Availability Text',
      group: 'contact',
      description: 'e.g. "Open to Work". Moves from About Page > Hero',
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      title: 'Social Links',
      group: 'contact',
      description: 'Also used for schema.org sameAs',
      of: [
        defineArrayMember({
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
              description: 'Iconify identifier with prefix, e.g. ri:linkedin-fill',
              validation: (rule) =>
                rule.required().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, {
                  name: 'iconify id',
                  invert: false,
                }),
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'URL',
              validation: (rule) =>
                rule.required().uri({ allowRelative: false, scheme: ['http', 'https', 'mailto'] }),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),

    // ── Personal (app/data/home.ts `aboutMe.interests`) ───────────────
    defineField({
      name: 'interests',
      type: 'array',
      title: 'Interests',
      group: 'personal',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'interest',
          title: 'Interest',
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
              description: 'Iconify identifier, e.g. lucide:camera',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'icon' } },
        }),
      ],
    }),

    // ── Footer (AppFooter.vue time-of-day lines) ──────────────────────
    defineField({
      name: 'footerTaglines',
      type: 'object',
      title: 'Footer Taglines',
      group: 'footer',
      description: 'Line shown in the footer, picked by the visitor’s local time',
      fields: [
        defineField({ name: 'morning', type: 'string', title: 'Morning', initialValue: 'Made with coffee in Los Angeles' }),
        defineField({ name: 'evening', type: 'string', title: 'Evening', initialValue: 'Made after-hours in Los Angeles' }),
        defineField({ name: 'night', type: 'string', title: 'Night', initialValue: 'Made past bedtime in Los Angeles' }),
        defineField({
          name: 'fallback',
          type: 'string',
          title: 'Fallback',
          description: 'Used before the visitor’s time is known (SSR)',
          initialValue: 'Made with care in Los Angeles',
        }),
      ],
    }),

    // ── Privacy page (pages/privacy.vue) ──────────────────────────────
    defineField({
      name: 'privacyPage',
      type: 'object',
      title: 'Privacy Page',
      group: 'privacy',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          initialValue: 'Privacy Policy',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'description',
          type: 'text',
          title: 'Meta Description',
          rows: 2,
          validation: (rule) => rule.max(160),
        }),
        defineField({
          name: 'body',
          type: 'blockContent',
          title: 'Body',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'lastUpdated',
          type: 'date',
          title: 'Last Updated',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
