import { expect, test } from '@playwright/test'

test.describe('theme persistence', () => {
  test.use({
    viewport: { width: 1280, height: 720 },
  })

  test('keeps dark mode after reload when user toggled to dark', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('color-mode'))
    await page.reload()

    const toggle = page.getByRole('switch', { name: /switch to dark theme/i })
    await toggle.click()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('color-mode')))
      .toBe('dark')

    await page.reload()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('switch', { name: /switch to light theme/i })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})
