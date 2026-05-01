import { expect, test } from '@playwright/test'

test.describe('light theme default', () => {
  test.use({
    viewport: { width: 1280, height: 720 },
  })

  test('loads light mode when there is no stored preference, even if the OS prefers dark', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addInitScript(() => {
      localStorage.removeItem('color-mode')
    })

    await page.goto('/')

    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#ffffff')
  })
})
