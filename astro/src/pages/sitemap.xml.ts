/**
 * /sitemap.xml, built from Sanity. Replaces @nuxtjs/sitemap and
 * server/api/__sitemap__/urls.get.ts. Protected projects, /password/* and
 * /theme-lab are left out, as before. Cached at the Vercel edge for a day.
 */
import type { APIRoute } from 'astro'
import { sanityQuery } from '~/lib/sanity'

export const prerender = false

interface SitemapProject {
  slug?: { current?: string }
  _updatedAt?: string
}

const sitemapProjectsQuery = `*[_type == "project" && defined(slug.current) && protected != true] | order(order asc, name asc){
  slug,
  _updatedAt
}`

interface Entry {
  loc: string
  changefreq: string
  priority: number
  lastmod?: string
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || 'https://bryanxmendez.com/').replace(/\/$/, '')
  const projects = (await sanityQuery<SitemapProject[] | null>(sitemapProjectsQuery)) ?? []

  const entries: Entry[] = [
    { loc: '/', changefreq: 'weekly', priority: 1 },
    { loc: '/about', changefreq: 'monthly', priority: 0.6 },
    { loc: '/privacy', changefreq: 'yearly', priority: 0.2 },
    ...projects
      .map((p) => ({ slug: p.slug?.current?.trim(), lastmod: p._updatedAt }))
      .filter((p): p is { slug: string; lastmod: string | undefined } => Boolean(p.slug))
      .map((p) => ({
        loc: `/projects/${encodeURIComponent(p.slug)}`,
        changefreq: 'monthly',
        priority: 0.7,
        ...(p.lastmod ? { lastmod: p.lastmod.slice(0, 10) } : {}),
      })),
  ]

  const urls = entries
    .map((e) => [
      '  <url>',
      `    <loc>${escapeXml(base + e.loc)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : '',
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n'))
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
