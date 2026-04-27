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
  maxAge: 5,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-status',
  group: 'sanity',
})
