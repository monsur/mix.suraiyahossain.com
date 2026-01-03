# End-to-End (E2E) Testing Guide

This document provides comprehensive information about the E2E testing setup for the music player application using Playwright.

## Overview

End-to-End tests verify the complete user experience by running tests in real browsers against the actual application. Unlike unit and integration tests that use mocks, E2E tests interact with the real application as a user would.

## What E2E Tests Cover

E2E tests in this project verify:

1. **Full User Workflows**
   - Playing and pausing music
   - Navigating between tracks
   - Switching between years
   - Interacting with album art

2. **Cross-Browser Compatibility**
   - Chromium (Chrome, Edge)
   - Firefox
   - WebKit (Safari)

3. **Responsive Design**
   - Desktop viewports
   - Mobile viewports (Pixel 5, iPhone 12)
   - Touch interactions on mobile

4. **Real-World Scenarios**
   - Actual network requests to data.json files
   - Real DOM interactions
   - Actual routing behavior
   - Performance metrics

## Test Structure

```
e2e/
└── music-player.spec.ts    # Main E2E test suite
```

## Running E2E Tests

### Prerequisites

Make sure you have installed Playwright browsers:

```bash
npx playwright install
```

### Basic Commands

#### Run all E2E tests (headless)
```bash
npm run test:e2e
```

This runs tests in all configured browsers (Chromium, Firefox, WebKit) in headless mode.

#### Run with visible browser (headed mode)
```bash
npm run test:e2e:headed
```

Useful for watching tests execute in real-time.

#### Interactive UI Mode
```bash
npm run test:e2e:ui
```

Opens Playwright's interactive UI for:
- Running individual tests
- Watching test execution
- Debugging failures
- Viewing screenshots and traces

#### Debug Mode
```bash
npm run test:e2e:debug
```

Opens tests in debug mode with Playwright Inspector for step-by-step debugging.

#### View Test Report
```bash
npm run test:e2e:report
```

Opens the HTML test report showing:
- Test results
- Screenshots of failures
- Execution traces
- Performance metrics

### Running Specific Tests

#### Run a specific test file
```bash
npx playwright test e2e/music-player.spec.ts
```

#### Run a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Run mobile tests only
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

#### Run a specific test by name
```bash
npx playwright test -g "should load the homepage"
```

## Test Configuration

Configuration is in `playwright.config.ts`:

### Key Settings

- **testDir**: `./e2e` - Location of test files
- **baseURL**: `http://localhost:5173` - Dev server URL
- **retries**: 2 on CI, 0 locally
- **workers**: 1 on CI (serial), parallel locally
- **timeout**: Default 30 seconds per test
- **webServer**: Automatically starts dev server before tests

### Browsers Configured

1. **Desktop**
   - Chromium (Chrome, Edge, Brave)
   - Firefox
   - WebKit (Safari)

2. **Mobile**
   - Mobile Chrome (Pixel 5)
   - Mobile Safari (iPhone 12)

## Writing E2E Tests

### Best Practices

1. **Use Data Attributes for Selectors**
   ```typescript
   // Good: Stable, semantic
   await page.locator('[data-testid="play-button"]').click()

   // Avoid: Fragile, implementation-dependent
   await page.locator('.btn-primary.play').click()
   ```

2. **Wait for Elements**
   ```typescript
   // Wait for visibility
   await page.locator('.Player').waitFor({ state: 'visible' })

   // Use auto-waiting assertions
   await expect(page.locator('.Player')).toBeVisible()
   ```

3. **Handle Async Operations**
   ```typescript
   // Wait for network or navigation
   await page.waitForTimeout(500) // Use sparingly

   // Better: Wait for specific state
   await expect(page.locator('.track-title')).toContainText('New Track')
   ```

4. **Clean Up State**
   ```typescript
   test.beforeEach(async ({ page }) => {
     // Start from home page for each test
     await page.goto('/')
   })
   ```

### Example Test

```typescript
test('should play music and advance to next track', async ({ page }) => {
  await page.goto('/')

  // Verify initial state
  await expect(page.locator('.Player')).toBeVisible()

  // Click play button
  const playButton = page.locator('.playPause').first()
  await playButton.click()

  // Verify playing state (pause button now visible)
  await expect(page.locator('.playPause')).toBeVisible()

  // Click next track
  const nextButton = page.locator('.Player svg').nth(2)
  await nextButton.click()

  // Verify track changed
  await page.waitForTimeout(500)
  const trackTitle = page.locator('.TrackInfo .title')
  const newTitle = await trackTitle.textContent()
  expect(newTitle).toBeTruthy()
})
```

## Debugging Failed Tests

### 1. Run in Headed Mode
```bash
npm run test:e2e:headed
```

Watch the browser to see what's happening.

### 2. Use Debug Mode
```bash
npm run test:e2e:debug
```

Step through tests line by line with Playwright Inspector.

### 3. Check Screenshots
Failed tests automatically capture screenshots saved to:
```
test-results/
  └── [test-name]/
      └── test-failed-1.png
```

### 4. View Traces
Enable traces in config to record:
- Network requests
- Console logs
- DOM snapshots
- Screenshots at each step

View traces with:
```bash
npx playwright show-trace test-results/.../trace.zip
```

### 5. Console Logs
Add debug output in tests:
```typescript
console.log('Current URL:', page.url())
console.log('Element text:', await element.textContent())
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Performance Considerations

E2E tests are slower than unit/integration tests:

- **Unit tests**: ~100ms per test
- **Integration tests**: ~200-500ms per test
- **E2E tests**: ~2-10 seconds per test

### Optimization Tips

1. **Run in Parallel**
   - Playwright runs tests in parallel by default
   - Reduce `workers` if tests are flaky

2. **Use Selective Testing**
   - Run E2E tests only for critical paths
   - Keep comprehensive unit/integration tests

3. **Share Browser Contexts**
   - Tests in same file can share browser contexts
   - Use `test.describe.configure({ mode: 'serial' })` for dependent tests

4. **Skip Heavy Tests in Development**
   ```typescript
   test.skip(process.env.NODE_ENV === 'development', 'Skip in dev mode')
   ```

## Comparison: E2E vs Integration Tests

| Aspect | E2E Tests | Integration Tests |
|--------|-----------|-------------------|
| **Browser** | Real (Chromium, Firefox, WebKit) | jsdom (simulated) |
| **Speed** | Slow (seconds) | Fast (milliseconds) |
| **Network** | Real HTTP requests | Mocked |
| **Audio** | Real Audio API | Mocked |
| **Confidence** | Highest | Medium |
| **Cost** | High (CI minutes) | Low |
| **Debugging** | Harder | Easier |
| **When to Use** | Critical user paths | Most features |

## When to Use E2E Tests

✅ **Use E2E tests for:**
- Critical user workflows (play music, navigate)
- Cross-browser compatibility issues
- Mobile/responsive behavior
- Real network interactions
- Performance testing
- Visual regression testing

❌ **Don't use E2E tests for:**
- Testing every edge case (use unit tests)
- Testing error states (use integration tests)
- Testing internal logic (use unit tests)
- Rapid development iteration

## Maintenance

### Keeping Tests Stable

1. **Use stable selectors** (data-testid, ARIA labels)
2. **Avoid timing dependencies** (use waitFor instead of sleep)
3. **Keep tests independent** (each test can run alone)
4. **Update regularly** with UI changes
5. **Review flaky tests** and improve or remove them

### Updating Tests

When the UI changes:

1. Run tests to identify failures
2. Update selectors if structure changed
3. Update assertions if behavior changed
4. Verify tests pass in all browsers
5. Check mobile viewports still work

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Guide](https://playwright.dev/docs/ci)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Test Coverage

Current E2E test coverage includes:

- ✅ Homepage loading
- ✅ Component visibility
- ✅ Album art display
- ✅ Track navigation (prev/next)
- ✅ Year navigation
- ✅ Mobile responsiveness
- ✅ Album art flip on mobile
- ✅ Desktop vs mobile layouts
- ✅ Page performance
- ✅ Accessibility basics
- ✅ Hash-based routing
- ✅ Error-free console

**Total E2E Tests**: 18 tests across 5 browsers = 90 test executions per run
