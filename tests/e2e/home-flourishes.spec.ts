import { expect, test } from '@playwright/test'

/**
 * Phase 6 — Homepage flourishes: validation that editorial markers, anchors,
 * ambient drift, and contact field affordances render without console errors.
 */
test.describe('home flourishes', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('has expected section anchors and editorial markers', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto('/')
    await expect(page.locator('#intro')).toBeVisible()
    await expect(page.locator('#work')).toBeVisible()
    await expect(page.locator('#story')).toBeVisible()
    await expect(page.locator('#experience')).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()

    await expect(page.locator('.work-marker .section-marker-word')).toHaveText('Work')
    await expect(page.locator('.story-marker .section-marker-word')).toHaveText('Story')
    await expect(page.locator('.resume-marker .section-marker-word')).toHaveText('Background')
    await expect(page.locator('.closing-marker .section-marker-word')).toHaveText('Contact')

    await expect(page.locator('.work-marker .section-marker-num')).toHaveText('02')
    await expect(page.locator('.story-marker .section-marker-num')).toHaveText('03')
    await expect(page.locator('.resume-marker .section-marker-num')).toHaveText('05')
    await expect(page.locator('.closing-marker .section-marker-num')).toHaveText('06')

    const status = page.locator('#status')
    if (await status.count()) {
      await expect(page.locator('.ticker-header .section-marker-num')).toHaveText('04')
      await expect(page.locator('.ticker-header .section-marker-word')).toHaveText('Right Now')
    }

    expect(errors, `console errors: ${errors.join('\n')}`).toEqual([])
  })

  test('hides scroll drift when prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('.scroll-drift-root')).toHaveCount(0)
  })

  test('contact name field shows label check pseudo when filled', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()

    const nameInput = page.locator('.closing-form input[name="name"]')
    await nameInput.fill('Test User')

    const afterOpacity = await page.evaluate(() => {
      const input = document.querySelector('.closing-form input[name="name"]') as HTMLInputElement | null
      const label = input?.nextElementSibling as HTMLElement | null
      if (!label) return null
      return getComputedStyle(label, '::after').opacity
    })
    expect(afterOpacity).toBe('1')
  })

  test('hero headline tilt host is present for gentle useCardTilt', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.intro-bento__tile--headline .intro-headline-tilt')).toBeVisible()
  })
})
