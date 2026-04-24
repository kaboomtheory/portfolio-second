// Public project list. This endpoint is intentionally safe to serve
// without auth: `sections` and `passwordHash` are never included for
// protected projects. Full protected content is served by
// `/api/project/[slug]` after a valid unlock cookie is presented.
export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "project" && defined(slug.current)]|order(order asc, name asc){
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
  }`) || []
}, {
  maxAge: 5,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-projects',
  group: 'sanity',
})
