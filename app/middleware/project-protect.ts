import { projectPasswords } from '~/data/projects'

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) {
    return
  }

  const source = to.params.slug
  const slug = Array.isArray(source) ? source.join('/') : String(source || '')

  const requiredPassword = projectPasswords[slug]
  if (!requiredPassword) {
    return
  }

  const enteredPassword = localStorage.getItem(`entered_password_${slug}`)
  if (enteredPassword !== requiredPassword) {
    return navigateTo(`/password/${slug}`)
  }
})
