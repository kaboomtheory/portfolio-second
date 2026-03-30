export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    title,
    taglines,
    intro,
    email,
    socialLinks
  }`) || null
}, {
  maxAge: 600,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-home',
  group: 'sanity',
})
