export async function sanityQuery<T>(query: string): Promise<T> {
  const config = useRuntimeConfig()
  const projectId = config.sanity?.projectId || process.env.SANITY_PROJECT_ID || 'ns0czoug'
  const dataset = config.sanity?.dataset || process.env.SANITY_DATASET || 'production'
  const apiVersion = config.sanity?.apiVersion || process.env.SANITY_API_VERSION || '2025-01-01'

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Sanity API error: ${response.statusText}`,
    })
  }

  const data = await response.json()
  return data.result
}
