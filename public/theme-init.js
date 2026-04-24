(function () {
  try {
    var saved = localStorage.getItem('color-mode')
    var dark = saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    var el = document.documentElement
    var mode = dark ? 'dark' : 'light'
    el.classList.toggle('dark', dark)
    el.dataset.theme = mode
    var themeMeta = document.querySelector('meta[name="theme-color"]')
    if (themeMeta) {
      themeMeta.setAttribute('content', dark ? '#212530' : '#ffffff')
    }
  } catch (error) {
    console.error('[theme-init] failed', error)
  }
}())
