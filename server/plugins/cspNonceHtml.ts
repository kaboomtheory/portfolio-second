export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (process.env.NODE_ENV !== 'production') return
    if (typeof response.body !== 'string') return

    const nonce = (event.context as { cspNonce?: string }).cspNonce
    const contentType = String(response.headers?.['content-type'] || '')

    if (!nonce || !contentType.includes('text/html')) {
      return
    }

    response.body = response.body
      .replace(/<script(?![^>]*\bnonce=)/g, `<script nonce="${nonce}"`)
      .replace(/<style(?![^>]*\bnonce=)/g, `<style nonce="${nonce}"`)
  })
})
