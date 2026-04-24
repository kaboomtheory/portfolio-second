export default defineNuxtPlugin(() => {
  const nonceState = useState('csp-nonce', () => '')
  const event = useRequestEvent()
  const nonce = ((event?.context as { cspNonce?: string } | undefined)?.cspNonce) || ''

  nonceState.value = nonce

  if (nonce) {
    useHead({
      meta: [
        {
          name: 'csp-nonce',
          content: nonce,
        },
      ],
    })
  }
})
