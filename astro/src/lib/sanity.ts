import { createClient, type QueryParams } from '@sanity/client'

/** Same defaults as sanity-studio/sanity.config.ts. Override with env vars for other datasets. */
export const sanityConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'ns0czoug',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || '2025-01-01',
}

/** Public reads go through the Sanity CDN. */
const publicClient = createClient({ ...sanityConfig, useCdn: true, perspective: 'published' })

/**
 * Token reads hit the live API. Only for fields that must never be served
 * publicly (password hashes, protected case study sections). Server only.
 */
function tokenClient() {
  const token = import.meta.env.SANITY_READ_TOKEN
  if (!token) throw new Error('SANITY_READ_TOKEN is not set')
  return createClient({ ...sanityConfig, useCdn: false, perspective: 'published', token })
}

export async function sanityQuery<T>(
  query: string,
  params: QueryParams = {},
  options: { useToken?: boolean } = {},
): Promise<T> {
  const client = options.useToken ? tokenClient() : publicClient
  return client.fetch<T>(query, params)
}
