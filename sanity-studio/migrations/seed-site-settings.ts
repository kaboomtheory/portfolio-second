/**
 * Seed the siteSettings singleton from the values hardcoded in the Nuxt app
 * (app/data/site.ts, app/data/home.ts, nuxt.config.ts, AppFooter.vue,
 * pages/privacy.vue) plus the copies already in homePage / aboutPage.
 *
 * Dry run (prints the document, writes nothing):
 *   npx sanity exec migrations/seed-site-settings.ts --with-user-token
 *
 * Write as a DRAFT (drafts.siteSettings), to review and publish in Studio:
 *   npx sanity exec migrations/seed-site-settings.ts --with-user-token -- --write
 *
 * Never overwrites: uses createIfNotExists on the draft id, and refuses to run
 * if a published siteSettings already exists.
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2025-01-01' })
const write = process.argv.includes('--write')

const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)

/** Old homePage icons were stored without a prefix (e.g. "linkedin-box-fill"). */
const normalizeIcon = (icon?: string) => (!icon ? 'ri:linkedin-fill' : icon.includes(':') ? icon : `ri:${icon}`)

async function main() {
  const existing = await client.fetch<string | null>(`*[_id == "siteSettings"][0]._id`)
  if (existing) {
    console.error('A published siteSettings already exists. Aborting so nothing is overwritten.')
    process.exit(1)
  }

  const cms = await client.fetch<{
    email?: string
    socialLinks?: { label: string; icon?: string; href: string }[]
    availabilityText?: string
  }>(`{
    "email": *[_id == "homePage"][0].email,
    "socialLinks": *[_id == "homePage"][0].socialLinks[]{label, icon, href},
    "availabilityText": *[_id == "aboutPage"][0].hero.availabilityText
  }`)

  const socialLinks = (cms.socialLinks?.length
    ? cms.socialLinks
    : [{ label: 'LinkedIn', icon: 'ri:linkedin-fill', href: 'https://www.linkedin.com/in/bryan-mendez/' }]
  ).map((l) => ({ _type: 'socialLink', _key: key(l.label), label: l.label, icon: normalizeIcon(l.icon), href: l.href }))

  const doc = {
    _id: 'drafts.siteSettings',
    _type: 'siteSettings',
    profile: {
      name: 'Bryan X. Mendez',
      role: 'Visual Designer',
      location: { label: 'Los Angeles, CA', locality: 'Los Angeles', region: 'CA', country: 'US' },
      // photo: upload /public/profile-photo.webp in Studio (asset upload is manual on purpose)
    },
    seo: {
      siteTitle: 'Bryan X. Mendez Graphic Design Portfolio',
      titleSuffix: 'Bryan X. Mendez',
      description:
        'Portfolio of Bryan X. Mendez — graphic designer in Los Angeles. Brand identity, packaging, and digital experiences.',
      // ogImage: upload /public/og-default.png in Studio
    },
    navItems: [
      { _type: 'navItem', _key: 'home', group: 'Work', title: 'Home', path: '/#intro', icon: 'lucide:house' },
      { _type: 'navItem', _key: 'work', group: 'Work', title: 'Work', path: '/#work', icon: 'lucide:layout-grid' },
      { _type: 'navItem', _key: 'about', group: 'Personal', title: 'About', path: '/#story', icon: 'lucide:user' },
    ],
    contactEmail: cms.email,
    availabilityText: cms.availabilityText,
    socialLinks,
    interests: [
      ['lucide:camera', 'Film Photography'],
      ['lucide:mountain', 'Hiking'],
      ['lucide:music', 'Vinyl Records'],
      ['lucide:book-open', 'Sci-Fi Novels'],
      ['lucide:gamepad-2', 'Indie Games'],
      ['lucide:coffee', 'Specialty Coffee'],
    ].map(([icon, label]) => ({ _type: 'interest', _key: key(label), icon, label })),
    footerTaglines: {
      morning: 'Made with coffee in Los Angeles',
      evening: 'Made after-hours in Los Angeles',
      night: 'Made past bedtime in Los Angeles',
      fallback: 'Made with care in Los Angeles',
    },
    privacyPage: {
      title: 'Privacy Policy',
      description: 'How this portfolio uses Microsoft Clarity for analytics, heatmaps, and session replays.',
      body: [
        {
          _type: 'block',
          _key: 'privacy1',
          style: 'normal',
          markDefs: [{ _type: 'link', _key: 'msprivacy', href: 'https://privacy.microsoft.com/en-us/privacystatement' }],
          children: [
            {
              _type: 'span',
              _key: 's1',
              marks: [],
              text:
                "This website uses Microsoft Clarity to capture how you interact with my portfolio through behavioral metrics, heatmaps, and session replays to improve my site's usability. Web usage data is captured using first and third-party cookies. By using this site, you agree that this data may be shared with Microsoft for their commercial purposes. For more information about how Microsoft collects and uses your data, visit the ",
            },
            { _type: 'span', _key: 's2', marks: ['msprivacy'], text: 'Microsoft Privacy Statement' },
            { _type: 'span', _key: 's3', marks: [], text: '.' },
          ],
        },
      ],
    },
  }

  console.log(JSON.stringify(doc, null, 2))
  if (!write) {
    console.log('\nDry run. Re-run with -- --write to create drafts.siteSettings.')
    return
  }
  await client.createIfNotExists(doc)
  console.log('\nCreated drafts.siteSettings (or it already existed). Review and publish it in Studio.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
