declare global {
  interface TurnstileRenderOptions {
    sitekey: string
    /** CSP nonce; must match the nonce on the Turnstile `api.js` script tag. */
    nonce?: string
    theme?: 'auto' | 'light' | 'dark'
    action?: string
    callback?: (token: string) => void
    'expired-callback'?: () => void
    'error-callback'?: () => void
  }

  interface Turnstile {
    render: (container: Element, options: TurnstileRenderOptions) => string | number
    reset: (widgetId?: string | number) => void
    remove: (widgetId?: string | number) => void
  }

  interface Window {
    turnstile?: Turnstile
  }
}

export {}
