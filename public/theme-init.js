(function () {
  try {
    var saved = localStorage.getItem('color-mode')
    var el = document.documentElement
    var mode = saved === 'dark' ? 'dark' : 'light'
    el.classList.toggle('dark', mode === 'dark')
    el.dataset.theme = mode
    var themeMeta = document.querySelector('meta[name="theme-color"]')
    if (themeMeta) {
      themeMeta.setAttribute('content', mode === 'dark' ? '#212530' : '#ffffff')
    }
  } catch (error) {
    console.error('[theme-init] failed', error)
  }
}())
