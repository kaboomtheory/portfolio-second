/**
 * Error type for API routes, standing in for h3's `createError`. Throw one
 * anywhere in a handler and `handleApi` turns it into a JSON response with the
 * same `{ statusCode, statusMessage }` shape the Nuxt routes returned, so the
 * existing Vue forms keep reading `statusMessage` for their error text.
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public statusMessage: string,
  ) {
    super(statusMessage)
  }
}

export function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

export async function handleApi(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof HttpError) {
      return json({ statusCode: error.statusCode, statusMessage: error.statusMessage }, error.statusCode)
    }
    console.error('[api] unhandled error', error)
    return json({ statusCode: 500, statusMessage: 'Server error' }, 500)
  }
}

/** Reads a JSON object body, or throws a 400. */
export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    throw new HttpError(400, 'Invalid body')
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new HttpError(400, 'Invalid body')
  }
  return raw as Record<string, unknown>
}
