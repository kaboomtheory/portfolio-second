import { sanityQuery } from '../utils/sanityFetch'

export default defineCachedEventHandler(async () => {
  const [projects, home, passwordRows] = await Promise.all([
    sanityQuery(`*[_type == "project" && defined(slug.current)]|order(order asc, name asc){
    _id,
    _type,
    name,
    slug,
    category,
    year,
    summary,
    thumbnail,
    protected,
    tags,
    sections,
    client,
    role,
    projectUrl,
    heroImage,
    color,
    collaborators,
    order
  }`) || [],
    sanityQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    title,
    taglines,
    intro,
    email,
    socialLinks
  }`) || null,
    sanityQuery<Array<{ slug: { current: string }; password: string }>>(
      `*[_type == "project" && protected == true && defined(password)]{
      slug,
      password
    }`,
    ) || [],
  ])

  const passwords: Record<string, string> = {}
  for (const p of passwordRows) {
    passwords[p.slug.current] = p.password
  }

  return { projects, home, passwords }
}, {
  maxAge: 60,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-index',
  group: 'sanity',
})
