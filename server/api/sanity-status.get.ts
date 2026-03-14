export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const projectId = config.sanity?.projectId || process.env.SANITY_PROJECT_ID || 'ns0czoug'
  const dataset = config.sanity?.dataset || process.env.SANITY_DATASET || 'production'
  const apiVersion = config.sanity?.apiVersion || process.env.SANITY_API_VERSION || '2025-01-01'

  const query = `*[_type == "statusItem"]|order(order asc){
    _id,
    label,
    title,
    content,
    link,
    image,
    icon,
    order
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
    console.error('Error fetching status items:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch status items from Sanity',
    })
  }
})
