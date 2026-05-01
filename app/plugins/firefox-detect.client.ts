export default defineNuxtPlugin(() => {
  if (/firefox/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('firefox')
  }
})
