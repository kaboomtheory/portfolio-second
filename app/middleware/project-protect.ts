import { useSanityProjects } from '~/composables/useSanityProjects'

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) {
    return
  }

  const source = to.params.slug
  const slug = Array.isArray(source) ? source.join('/') : String(source || '')

  const { projectPasswords } = useSanityProjects()
  const requiredPassword = projectPasswords.value[slug]
  if (!requiredPassword) {
    return
  }

  const enteredPassword = localStorage.getItem(`entered_password_${slug}`)
  if (enteredPassword !== requiredPassword) {
    return navigateTo(`/password/${slug}`)
  }
})
