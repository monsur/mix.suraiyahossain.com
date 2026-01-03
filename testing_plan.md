# Testing Plan for mix.suraiyahossain.com

## Overview

This document outlines a comprehensive testing strategy for the Suraiya's Mixtape music player application. The application is a React + TypeScript music player built with Vite that displays annual mixtapes with audio playback, navigation, and album art.

## Testing Frameworks & Tools

### Core Testing Stack

- **Vitest** - Fast unit test runner designed for Vite projects
  - Native ESM support
  - Compatible with Vite configuration
  - Jest-compatible API
  - Built-in TypeScript support

- **React Testing Library** - Component testing
  - User-centric testing approach
  - Works with Vitest
  - Focuses on testing behavior rather than implementation

- **jsdom** - DOM environment for testing
  - Simulates browser environment in Node.js
  - Required for testing React components

### Additional Testing Tools

- **@testing-library/user-event** - Simulating user interactions
- **@vitest/ui** - Visual test runner UI (optional)
- **@testing-library/jest-dom** - Custom matchers for DOM testing

### End-to-End Testing (Optional)

- **Playwright** - E2E testing framework
  - Cross-browser testing
  - Visual regression testing
  - Network interception for testing audio loading

## Test Categories

### 1. Unit Tests

#### 1.1 Utility Classes

**UrlHelper.ts** ([src/UrlHelper.ts](src/UrlHelper.ts))
- Test URL generation for different years
- Test path prefix generation
- Test S3 URL construction
- Test data file URL generation
- Test album art URL generation (front/back)
- Test download URL generation
- Test track URL generation
- Test TEST_AUDIO mode behavior

**Loader.ts** ([src/Loader.ts](src/Loader.ts))
- Test `shuffleArray()` function
  - Verify array is randomized
  - Verify all elements are preserved
  - Verify array length remains the same
- Test `loadYear()` function
  - Test caching mechanism
  - Test data transformation (raw to TrackData)
  - Test URL assignment to tracks
  - Mock fetch calls
- Test `loadAll()` function
  - Test loading multiple years
  - Test shuffle functionality
  - Test Promise resolution
- Test `getSourceData()` private method (via public methods)
  - Verify global fields are extracted correctly
  - Verify album art URLs are added
  - Verify download URL is added

**Logger.ts** ([src/Logger.ts](src/Logger.ts))
- Test logging functionality
- Test different log levels
- Mock console methods

#### 1.2 Helper Scripts

**create_track_names.js** ([create_track_names.js](create_track_names.js))
- Test `scrubString()` function with various inputs
  - Special characters removal
  - Unicode handling
  - Spaces and symbols
- Test `isValidChar()` function
  - Valid character ranges
  - Invalid characters
- Test `getTrackNo()` function
  - Single digit padding
  - Double digit numbers
- Test `processMix()` function
  - Complete track processing
  - Source filename generation

#### 1.3 Routing Logic

**App.tsx** ([src/App.tsx](src/App.tsx))
- Test `getYear()` function
  - Valid year parsing
  - Invalid year handling (NaN)
  - Out of range years (below MIN_YEAR, above MAX_YEAR)
  - Undefined/null input
  - Edge cases

### 2. Component Tests

#### 2.1 Player Component

**Player.tsx** ([src/Player.tsx](src/Player.tsx))
- Test play/pause functionality
- Test next track navigation
  - Regular next behavior
  - Behavior at end of playlist
- Test previous track navigation
  - Regular previous behavior
  - Reset time when at first track
- Test auto-advance when track ends
- Test audio source changes
- Test cleanup on unmount
- Test error handling for AbortError
- Mock Audio element and its methods
- Test Logger integration

#### 2.2 Album Art Components

**AlbumArt.tsx, AlbumArtSmall.tsx, AlbumArtLarge.tsx**
- Test image source rendering
- Test responsive behavior
- Test alt text
- Test click handlers (if any)
- Test loading states

#### 2.3 Navigation Component

**Navigation.tsx** ([src/Navigation.tsx](src/Navigation.tsx))
- Test year selection
- Test shuffle mode activation
- Test navigation between years
- Test active year highlighting

#### 2.4 Track Info Component

**TrackInfo.tsx** ([src/TrackInfo.tsx](src/TrackInfo.tsx))
- Test track metadata display
- Test Spotify link rendering
- Test download link rendering
- Test proper data binding

#### 2.5 Links Component

**Links.tsx** ([src/Links.tsx](src/Links.tsx))
- Test external link rendering
- Test link attributes (target, rel)

#### 2.6 Root Component

**Root.tsx** ([src/Root.tsx](src/Root.tsx))
- Test initial state
- Test track loading from loader
- Test track position management
- Test error boundary behavior
- Test loading states

### 3. Integration Tests

#### 3.1 Route Loading
- Test loading specific year via route
- Test shuffle route
- Test loader integration with router
- Test invalid routes

#### 3.2 Data Flow
- Test data loading → component rendering pipeline
- Test track selection → player update flow
- Test navigation → data loading → UI update

#### 3.3 Player Interactions
- Test play → track end → next track → play sequence
- Test navigation while playing
- Test track position persistence

### 4. Data Validation Tests

#### 4.1 JSON Schema Validation
- Test data.json structure for all years
- Required fields: year, mixTitle, backgroundColor, textColor, spotify, tracks
- Track fields: title, artist, src
- Validate color format (hex codes)
- Validate Spotify URL format
- Validate track filename format

#### 4.2 Asset Validation
- Verify front.jpg exists for each year
- Verify back.jpg exists for each year
- Verify data.json exists for each year
- Test Globals.MIN_YEAR and MAX_YEAR consistency

### 5. Build & Type Tests

#### 5.1 TypeScript Type Checking
- Run `tsc` to verify no type errors
- Ensure strict mode compliance
- Test type definitions in Types.ts

#### 5.2 Build Tests
- Test production build succeeds
- Test build output contains expected files
- Test source maps configuration
- Verify asset copying

#### 5.3 Linting
- ESLint configuration validation
- Ensure no lint errors in codebase

### 6. Visual & Accessibility Tests

#### 6.1 Accessibility
- Test keyboard navigation
- Test ARIA labels
- Test screen reader compatibility
- Test color contrast ratios
- Test focus management

#### 6.2 Responsive Design
- Test mobile viewport
- Test tablet viewport
- Test desktop viewport
- Test album art scaling

### 7. Performance Tests

- Test initial load time
- Test audio loading behavior
- Test large playlist handling (shuffle mode with all years)
- Test memory leaks in Player component
- Test caching effectiveness in Loader

### 8. Browser Compatibility Tests

- Test in Chrome (latest)
- Test in Firefox (latest)
- Test in Safari (latest)
- Test in Edge (latest)
- Test Web Audio API compatibility

## Test Execution

### Running Tests

```bash
# Install testing dependencies
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests with UI
npm test -- --ui

# Run specific test file
npm test src/UrlHelper.test.ts
```

### Test Scripts in package.json

Add these scripts to [package.json](package.json):

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### Vitest Configuration

Create [vitest.config.ts](vitest.config.ts):

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [svgr(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
})
```

### Test Setup File

Create [src/test/setup.ts](src/test/setup.ts):

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Audio API
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  duration: 0,
  src: '',
  onended: null,
}))

// Mock fetch for data loading tests
global.fetch = vi.fn()
```

## Test File Structure

```
src/
├── test/
│   ├── setup.ts                 # Test environment setup
│   ├── mocks/
│   │   ├── trackData.ts         # Mock track data
│   │   └── audioMock.ts         # Audio API mock
│   └── utils/
│       └── testHelpers.ts       # Shared test utilities
├── UrlHelper.test.ts            # Unit tests for UrlHelper
├── Loader.test.ts               # Unit tests for Loader
├── Logger.test.ts               # Unit tests for Logger
├── App.test.tsx                 # Tests for App routing
├── Player.test.tsx              # Component tests for Player
├── AlbumArt.test.tsx            # Component tests for AlbumArt
├── Navigation.test.tsx          # Component tests for Navigation
├── TrackInfo.test.tsx           # Component tests for TrackInfo
├── Root.test.tsx                # Integration tests for Root
└── e2e/
    └── player.spec.ts           # E2E tests (if using Playwright)
```

## Coverage Goals

- **Unit Tests**: 80%+ coverage for utility classes
- **Component Tests**: 70%+ coverage for React components
- **Integration Tests**: Key user flows covered
- **Overall**: 75%+ code coverage

## CI/CD Integration

### GitHub Actions Workflow

Create [.github/workflows/test.yml](.github/workflows/test.yml):

```yaml
name: Test

on:
  push:
    branches: [main, migrate-to-vite]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc

      - name: Run tests
        run: npm run test:run

      - name: Run build
        run: npm run build
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Meaningful Test Names**: Describe what is being tested and expected outcome
3. **Mock External Dependencies**: Mock fetch calls, Audio API, external services
4. **Test Error States**: Don't just test happy paths
5. **Keep Tests Fast**: Mock slow operations, avoid actual network calls
6. **Test Accessibility**: Include a11y tests in component tests
7. **Isolate Tests**: Each test should be independent
8. **Use Factories**: Create test data factories for consistent mock data
9. **Test Edge Cases**: Empty lists, boundary values, null/undefined
10. **Maintain Tests**: Update tests when functionality changes

## Priority Testing Roadmap

### Phase 1: Foundation (Week 1)
- Set up testing infrastructure (Vitest, React Testing Library)
- Create test setup and mock utilities
- Write unit tests for UrlHelper
- Write unit tests for Loader

### Phase 2: Core Components (Week 2)
- Test Player component thoroughly
- Test App routing logic
- Test Root component integration

### Phase 3: UI Components (Week 3)
- Test remaining UI components
- Add accessibility tests
- Add visual regression tests

### Phase 4: Integration & E2E (Week 4)
- Integration tests for key flows
- E2E tests for critical user journeys
- Performance testing

### Phase 5: Maintenance
- Achieve coverage goals
- Set up CI/CD
- Document testing patterns for future development

## Maintenance & Continuous Testing

- Run tests before every commit (pre-commit hook)
- Run full test suite in CI/CD pipeline
- Review and update tests when adding new features
- Monitor test execution time and optimize slow tests
- Update test data when adding new years
- Periodically review coverage reports

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Playwright Documentation](https://playwright.dev/) (for E2E)
