export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "project" && defined(slug.current)]|order(order asc, name asc){
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
  }`) || []
}, {
  maxAge: 300,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-projects',
  group: 'sanity',
})
