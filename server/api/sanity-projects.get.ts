export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const projectId = config.sanity?.projectId || process.env.SANITY_PROJECT_ID || 'ns0czoug'
  const dataset = config.sanity?.dataset || process.env.SANITY_DATASET || 'production'
  const apiVersion = config.sanity?.apiVersion || process.env.SANITY_API_VERSION || '2025-01-01'

  const query = `*[_type == "project" && defined(slug.current)]|order(name asc){
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
    collaborators
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
    return data.result || []
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects from Sanity',
    })
  }
})
