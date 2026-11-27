/* Applies the saved theme before first paint. Loaded as a blocking file so the hash-based CSP allows it. */
(function () {
  try {
    var saved = localStorage.getItem('color-mode')
    var el = document.documentElement
    var mode = saved === 'dark' ? 'dark' : 'light'
    el.classList.toggle('dark', mode === 'dark')
    el.dataset.theme = mode
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff')
  } catch (e) {}
})()
