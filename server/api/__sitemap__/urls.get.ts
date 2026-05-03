import { sanityQuery } from '../../utils/sanityFetch'

interface SitemapProject {
  slug?: {
    current?: string
  }
}

export default defineCachedEventHandler(async () => {
  const projects = await sanityQuery<SitemapProject[]>(`
    *[_type == "project" && defined(slug.current) && protected != true] | order(order asc, name asc) {
      slug
    }
  `)

  const projectUrls = (projects ?? [])
    .map((project) => project.slug?.current?.trim())
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      loc: `/projects/${slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    }))

  return [
    {
      loc: '/',
      changefreq: 'weekly',
      priority: 1,
    },
    {
      loc: '/about',
      changefreq: 'monthly',
      priority: 0.6,
    },
    ...projectUrls,
  ]
}, {
  maxAge: 60 * 60,
  swr: true,
  staleMaxAge: 60 * 60 * 24,
  name: 'sitemap-urls',
  group: 'sitemap',
})
