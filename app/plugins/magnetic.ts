export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('magnetic', {
    mounted(el, binding) {
      if (!import.meta.client) return

      const strength = binding.value || 0.3
      let isHovering = false
      let rect: DOMRect | null = null

      el._onMouseMove = (e: MouseEvent) => {
        if (!isHovering) return
        if (!rect) rect = el.getBoundingClientRect()

        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const dx = (e.clientX - cx) * strength
        const dy = (e.clientY - cy) * strength

        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      }

      el._onMouseEnter = () => {
        isHovering = true
        rect = el.getBoundingClientRect()
        el.style.transition = 'transform 0.1s ease-out'
      }

      el._onMouseLeave = () => {
        isHovering = false
        rect = null
        el.style.transform = 'translate3d(0, 0, 0)'
        el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
      }

      el.addEventListener('mousemove', el._onMouseMove)
      el.addEventListener('mouseenter', el._onMouseEnter)
      el.addEventListener('mouseleave', el._onMouseLeave)
    },
    unmounted(el) {
      if (!import.meta.client) return
      el.removeEventListener('mousemove', el._onMouseMove)
      el.removeEventListener('mouseenter', el._onMouseEnter)
      el.removeEventListener('mouseleave', el._onMouseLeave)
    }
  })
})
