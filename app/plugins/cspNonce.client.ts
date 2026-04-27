export default defineNuxtPlugin(() => {
  const nonceState = useState('csp-nonce', () => '')

  if (!nonceState.value) {
    nonceState.value = document
      .querySelector('meta[name="csp-nonce"]')
      ?.getAttribute('content') || ''
  }
})
