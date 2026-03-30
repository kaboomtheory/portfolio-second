export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "aboutPage" && _id == "aboutPage"][0]{
    hero,
    story,
    experiences,
    capabilities,
    resumeUrl
  }`) || null
}, {
  maxAge: 600,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-about',
  group: 'sanity',
})
