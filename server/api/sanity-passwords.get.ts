export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const projectId = config.sanity?.projectId || process.env.SANITY_PROJECT_ID || 'ns0czoug'
  const dataset = config.sanity?.dataset || process.env.SANITY_DATASET || 'production'
  const apiVersion = config.sanity?.apiVersion || process.env.SANITY_API_VERSION || '2025-01-01'

  const query = `*[_type == "project" && protected == true && defined(password)]{
    slug,
    password
  }`

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.result || []

    // Convert to record
    const record: Record<string, string> = {}
    result.forEach((p: { slug: {current: string }; password: string }) => {
      record[p.slug.current] = p.password
    })

    return record
  } catch (error) {
    console.error('Error fetching passwords:', error)
    // Return empty object on error instead of throwing
    return {}
  }
})
