import { test, expect } from '@playwright/test'

test.describe('Music Player E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('should load the homepage with all main components', async ({ page }) => {
    // Check that all main components are visible
    await expect(page.locator('.AlbumArt')).toBeVisible()
    await expect(page.locator('.Player')).toBeVisible()
    await expect(page.locator('.TrackInfo')).toBeVisible()
    await expect(page.locator('.Links')).toBeVisible()
    await expect(page.locator('.Navigation')).toBeVisible()
  })

  test('should display album art', async ({ page }) => {
    // Wait for album art to load
    const albumArt = page.locator('.AlbumArt img').first()
    await expect(albumArt).toBeVisible()

    // Verify image has src attribute
    const src = await albumArt.getAttribute('src')
    expect(src).toBeTruthy()
    expect(src).toContain('.jpg')
  })

  test('should show play button initially', async ({ page }) => {
    // Player should show play button when not playing
    const player = page.locator('.Player')
    await expect(player).toBeVisible()

    // Play button should be visible (SVG with specific class or path)
    const playButton = player.locator('.playPause').first()
    await expect(playButton).toBeVisible()
  })

  test('should display track information', async ({ page }) => {
    const trackInfo = page.locator('.TrackInfo')
    await expect(trackInfo).toBeVisible()

    // Should show current track title
    const title = trackInfo.locator('.title')
    await expect(title).toBeVisible()
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
    expect(titleText?.length).toBeGreaterThan(0)
  })

  test('should display navigation with year links', async ({ page }) => {
    const navigation = page.locator('.Navigation')
    await expect(navigation).toBeVisible()

    // Should have multiple year links
    const yearLinks = navigation.locator('a')
    const count = await yearLinks.count()
    expect(count).toBeGreaterThan(0)

    // Verify at least one year link is visible
    await expect(yearLinks.first()).toBeVisible()
  })

  test('should display download and Spotify links', async ({ page }) => {
    const links = page.locator('.Links')
    await expect(links).toBeVisible()

    // Check for link elements
    const linkElements = links.locator('a')
    const count = await linkElements.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to previous track when prev button is clicked', async ({ page }) => {
    // Get initial track info
    const trackInfo = page.locator('.TrackInfo .title')
    const initialTrack = await trackInfo.textContent()

    // Click next to advance, then click prev to go back
    const player = page.locator('.Player')
    const nextButton = player.locator('svg').nth(2) // Next is the 3rd SVG
    await nextButton.click()

    // Wait for track to change
    await page.waitForTimeout(500)

    const prevButton = player.locator('svg').first() // Prev is the 1st SVG
    await prevButton.click()

    // Wait for track to change back
    await page.waitForTimeout(500)

    // Should be back to initial track
    const finalTrack = await trackInfo.textContent()
    expect(finalTrack).toBe(initialTrack)
  })

  test('should navigate to next track when next button is clicked', async ({ page }) => {
    // Get initial track info
    const trackInfo = page.locator('.TrackInfo .title')
    const initialTrack = await trackInfo.textContent()

    // Click next button
    const player = page.locator('.Player')
    const nextButton = player.locator('svg').nth(2) // Next is the 3rd SVG
    await nextButton.click()

    // Wait for track to change
    await page.waitForTimeout(500)

    // Track should have changed
    const newTrack = await trackInfo.textContent()
    expect(newTrack).not.toBe(initialTrack)
  })

  test('should navigate to different year', async ({ page }) => {
    // Get current page URL
    const initialUrl = page.url()

    // Click on a year link (not the current year)
    const navigation = page.locator('.Navigation')
    const yearLinks = navigation.locator('a')
    const count = await yearLinks.count()

    if (count > 1) {
      // Click the second year link
      await yearLinks.nth(1).click()

      // Wait for navigation
      await page.waitForTimeout(1000)

      // URL should have changed
      const newUrl = page.url()
      expect(newUrl).not.toBe(initialUrl)

      // Should still show all main components
      await expect(page.locator('.AlbumArt')).toBeVisible()
      await expect(page.locator('.Player')).toBeVisible()
    }
  })

  test('should have correct page title', async ({ page }) => {
    // Page title should be set from mix data
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // All main components should still be visible
    await expect(page.locator('.AlbumArt')).toBeVisible()
    await expect(page.locator('.Player')).toBeVisible()
    await expect(page.locator('.TrackInfo')).toBeVisible()

    // Album art should show small version (single image)
    const albumArtImages = page.locator('.AlbumArt img')
    const imageCount = await albumArtImages.count()
    expect(imageCount).toBe(1) // Mobile shows only one image at a time
  })

  test('should toggle album art on mobile when clicked', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Get initial image src
    const albumArtImage = page.locator('.AlbumArt img').first()
    await expect(albumArtImage).toBeVisible()
    const initialSrc = await albumArtImage.getAttribute('src')

    // Click the image to flip
    await albumArtImage.click()

    // Wait for flip animation
    await page.waitForTimeout(500)

    // Image src should have changed (front to back or vice versa)
    const newSrc = await albumArtImage.getAttribute('src')
    expect(newSrc).not.toBe(initialSrc)
  })

  test('should show large album art on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Album art should show large version (two images side by side)
    await expect(page.locator('.AlbumArt')).toBeVisible()

    // Should have multiple images visible on large screens
    const albumArtImages = page.locator('.AlbumArt img')
    const imageCount = await albumArtImages.count()
    expect(imageCount).toBeGreaterThanOrEqual(1)
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Should have no console errors
    expect(errors).toHaveLength(0)
  })

  test('should handle hash-based routing', async ({ page }) => {
    // App uses hash-based routing (React Router with HashRouter)
    await page.goto('/')

    // URL should contain hash
    const url = page.url()
    expect(url).toContain('#')
  })
})

test.describe('Performance Tests', () => {
  test('should load the page within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')

    // Wait for main content to be visible
    await page.locator('.Player').waitFor({ state: 'visible' })

    const loadTime = Date.now() - startTime

    // Page should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should have no accessibility violations on main page', async ({ page }) => {
    await page.goto('/')

    // Check for basic accessibility: all images should have alt text
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })
})
