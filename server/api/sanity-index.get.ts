import { sanityQuery } from '../utils/sanityFetch'

// Public index bundle. Password hashes are NOT returned here — they are
// compared server-side in `/api/project-unlock`. Protected projects
// have their `sections` stripped; full protected content is served
// by `/api/project/[slug]` after unlock.
export default defineCachedEventHandler(async () => {
  const [projects, home] = await Promise.all([
    sanityQuery(`*[_type == "project" && defined(slug.current)]|order(order asc, name asc){
    _id,
    _type,
    name,
    slug,
    summary,
    thumbnail,
    protected,
    tags,
    "sections": select(protected == true => null, sections),
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
  ])

  return { projects, home }
}, {
  maxAge: 5,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-index',
  group: 'sanity',
})
