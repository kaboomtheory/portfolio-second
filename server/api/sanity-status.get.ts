export default defineCachedEventHandler(async () => {
  return await sanityQuery(`*[_type == "statusItem"]|order(order asc){
    _id,
    label,
    title,
    content,
    link,
    image,
    icon,
    order
  }`) || []
}, {
  maxAge: 60 * 60 * 24,
  swr: true,
  staleMaxAge: 60 * 60 * 24,
  name: 'sanity-status',
  group: 'sanity',
})
