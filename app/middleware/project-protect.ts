import { normalizeProjectSlug } from '~/utils/projectSlug'

export default defineNuxtRouteMiddleware(async (to) => {
  // SPA-only (ssr: false). The real gate is the HttpOnly cookie
  // enforced server-side by /api/project/[slug]; this middleware is
  // only UX — redirecting to the password page when the server says
  // the cookie is missing or expired.
  if (!import.meta.client) return

  const slug = normalizeProjectSlug(to.params.slug)
  if (!slug) return

  try {
    const status = await $fetch<{ protected: boolean; unlocked: boolean }>(
      '/api/project-access',
      { params: { slug } },
    )
    if (status.protected && !status.unlocked) {
      return navigateTo(`/password/${slug}`)
    }
  } catch {
    // If the access probe fails we let the page render; the
    // `/api/project/[slug]` call will still enforce auth.
  }
})
