export default defineCachedEventHandler(async () => {
  try {
    const result = await sanityQuery<Array<{ slug: { current: string }; password: string }>>(`*[_type == "project" && protected == true && defined(password)]{
      slug,
      password
    }`) || []

    const record: Record<string, string> = {}
    result.forEach((p) => {
      record[p.slug.current] = p.password
    })

    return record
  } catch (error) {
    console.error('Error fetching passwords:', error)
    return {}
  }
}, {
  maxAge: 300,
  swr: true,
  staleMaxAge: 3600,
  name: 'sanity-passwords',
  group: 'sanity',
})
