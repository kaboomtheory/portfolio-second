import { expect, test } from '@playwright/test'

test.describe('dark theme home', () => {
  test.use({
    viewport: { width: 1280, height: 720 },
  })

  test('grain layer does not use blend modes that veil dark UI', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('color-mode', 'dark')
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)

    const blend = await page.locator('.grain-surface').evaluate((el) => getComputedStyle(el).mixBlendMode)
    expect(['overlay', 'normal']).toContain(blend)

    const hero = page.locator('.hero-title')
    await expect(hero).toBeVisible()
    const bg = await hero.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).toMatch(/rgb\(\s*\d+/i)
    const m = bg.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
    expect(m, `expected rgb() background, got ${bg}`).toBeTruthy()
    const [, r, g, b] = m!
    // Dark theme mint tile behind the hero title should read as a light green, not near-black.
    expect(Number(g)).toBeGreaterThan(Number(r) + 20)
    expect(Number(g)).toBeGreaterThan(Number(b) + 20)
  })
})
