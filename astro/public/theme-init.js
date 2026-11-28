/* The site is light only. Clears any theme saved by the old dark mode toggle. */
(function () {
  try {
    var el = document.documentElement
    el.classList.remove('dark')
    el.dataset.theme = 'light'
    localStorage.removeItem('color-mode')
  } catch (e) {}
})()
