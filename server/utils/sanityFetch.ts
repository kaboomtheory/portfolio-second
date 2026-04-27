interface SanityQueryOptions {
  params?: Record<string, unknown>
  // When true, include the SANITY_READ_TOKEN in the request. Use for
  // any query that touches fields that should NOT be served via the
  // public CDN/dataset (for example, project password hashes).
  useToken?: boolean
}

export async function sanityQuery<T>(
  query: string,
  options: SanityQueryOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const projectId = config.sanity?.projectId || process.env.SANITY_PROJECT_ID || 'ns0czoug'
  const dataset = config.sanity?.dataset || process.env.SANITY_DATASET || 'production'
  const apiVersion = config.sanity?.apiVersion || process.env.SANITY_API_VERSION || '2025-01-01'

  const searchParams = new URLSearchParams()
  searchParams.set('query', query)
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      searchParams.set(`$${key}`, JSON.stringify(value))
    }
  }

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?${searchParams.toString()}`

  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = options.useToken ? process.env.SANITY_READ_TOKEN : undefined
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Sanity API error: ${response.statusText}`,
    })
  }

  const data = await response.json()
  return data.result
}
