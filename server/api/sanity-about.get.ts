export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "aboutPage" && _id == "aboutPage"][0]{
    hero,
    story,
    experiences,
    capabilities,
    resumeUrl
  }`) || null
}, {
  maxAge: 60 * 60 * 24,
  swr: true,
  staleMaxAge: 60 * 60 * 24,
  name: 'sanity-about',
  group: 'sanity',
})
