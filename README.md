# mix.suraiyahossain.com

A React + TypeScript music player for Suraiya's annual mixtape collection. Built with [Vite](https://vitejs.dev/).

The biggest development since this README was first written: AI. If you get stuck, ask Claude for help.

## Error Tracking

This project uses [Sentry](https://sentry.io) for error tracking and monitoring. See [docs/SENTRY_SETUP.md](docs/SENTRY_SETUP.md) for complete setup instructions.

## First Time Setup

1. **Install Node.js** (recommended: use nvm)
   ```bash
   # Automatically uses the version specified in .nvmrc
   nvm install
   nvm use

   # Update npm to latest
   npm install -g npm@latest
   ```

   > **Note:** This project includes `.nvmrc` and `.node-version` files that specify Node.js 24.12.0 LTS. Most version managers (nvm, fnm, asdf) will automatically detect and use this version.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Annual Update Process

When updating dependencies once a year:

```bash
# 1. Update Node.js to latest LTS
nvm ls-remote --lts
nvm install --lts
nvm use --lts
npm install -g npm@latest

# 2. Update .nvmrc and .node-version files
node --version > .nvmrc
node --version > .node-version

# 3. Clean install with updated packages
rm -rf node_modules package-lock.json
npm i -g npm-check-updates
ncu -u
npm install

# 4. Test everything works
npm run test:run
npm run dev
npm run build
```

## Available Scripts

### Development

#### `npm run dev`

Starts the Vite development server with instant hot module replacement (HMR).

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page reloads instantly when you make edits.

**Why it's fast:** Vite uses native ES modules in development - no bundling required!

### Testing

#### `npm test`

Runs the test suite in watch mode. Tests will automatically re-run when you make changes.

```bash
npm test
```

This project uses [Vitest](https://vitest.dev/) with React Testing Library for comprehensive test coverage.

#### `npm run test:run`

Runs all tests once (useful for CI/CD).

```bash
npm run test:run
```

#### `npm run test:coverage`

Generates a detailed code coverage report.

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and displayed in the terminal.

#### `npm run test:ui`

Opens the Vitest UI for interactive test exploration and debugging.

```bash
npm run test:ui
```

**Test Coverage:** The project maintains 93%+ overall test coverage including:
- Unit tests for utilities (UrlHelper, Loader, routing logic)
- Component tests for all UI components
- Integration tests for the Root component
- Mock implementations for Audio API, Router, and external dependencies

See [docs/testing_plan.md](docs/testing_plan.md) for detailed testing documentation.

#### E2E Testing

The project includes comprehensive End-to-End tests using [Playwright](https://playwright.dev/) that run in real browsers.

##### `npm run test:e2e`

Runs E2E tests in all configured browsers (Chromium, Firefox, WebKit) in headless mode.

```bash
npm run test:e2e
```

##### `npm run test:e2e:ui`

Opens Playwright's interactive UI for running and debugging tests.

```bash
npm run test:e2e:ui
```

##### `npm run test:e2e:headed`

Runs tests with visible browsers (useful for watching test execution).

```bash
npm run test:e2e:headed
```

##### `npm run test:e2e:debug`

Opens tests in debug mode with step-by-step execution.

```bash
npm run test:e2e:debug
```

##### `npm run test:e2e:report`

Opens the HTML test report showing results, screenshots, and traces.

```bash
npm run test:e2e:report
```

**E2E Test Coverage:** 18 tests covering:
- Full user workflows (play, pause, navigate tracks)
- Cross-browser compatibility (Chromium, Firefox, WebKit)
- Mobile responsiveness (Pixel 5, iPhone 12)
- Real network requests and Audio API interactions
- Performance and accessibility checks

See [docs/e2e-testing.md](docs/e2e-testing.md) for complete E2E testing documentation.

### Build & Deploy

#### `npm run build`

Builds the app for production to the `build` folder.

```bash
npm run build
```

The build:
- Runs TypeScript type checking first (`tsc`)
- Bundles with Vite using Rollup
- Optimizes and minifies code
- Outputs to `build/` directory (ready for gh-pages)

#### `npm run preview`

Preview the production build locally before deploying.

```bash
npm run preview
```

This serves the `build` folder so you can test the production build on [http://localhost:4173](http://localhost:4173).

#### `npm run deploy`

Deploys the site to GitHub Pages.

```bash
npm run deploy
```

This runs `npm run build` then pushes the `build` folder to the `gh-pages` branch.

## Adding a new year

 * Update node and deps (see above)
 * Create a new folder with the year under public/years
 * Add front.jpg and back.jpg album art into the new folder. Size: 1500 x 1500
 * Minify album art using https://tinypng.com/
 * Create a new data.json file into the new folder.
 * Use AI to extract track names from back.jpg into the correct json format.
 * Run `node create_track_names.js {YEAR}` to add an `src` field with the track filename to the json.
 * Rename each MP3 file to those file names
 * Edit MP3 ID3 tags
 * Create a zip of MP3s titled year.zip
 * Upload all that to S3.
 * Update src/Globals.ts to the latest year

## Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool and dev server
- **React Router 7** - Hash-based routing
- **vite-plugin-svgr** - SVG as React components

### Testing
- **Vitest 4** - Fast unit test runner (compatible with Vite)
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing
- **@vitest/coverage-v8** - Code coverage reporting
- **Playwright 1.57** - E2E testing framework with real browsers

## Configuration Files

- `vite.config.mts` - Vite build configuration
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E test configuration
- `tsconfig.json` - TypeScript configuration for source code
- `tsconfig.node.json` - TypeScript configuration for Vite config
- `.eslintrc.cjs` - ESLint rules
- `index.html` - Entry point (Vite uses this directly)
- `.nvmrc` - Node.js version for nvm
- `.node-version` - Node.js version for other version managers (fnm, asdf, etc.)
- `docs/testing_plan.md` - Comprehensive testing documentation and strategy
- `docs/e2e-testing.md` - E2E testing guide with Playwright
- `docs/SENTRY_SETUP.md` - Sentry error tracking setup guide
- `docs/SENTRY_IMPLEMENTATION_SUMMARY.md` - Technical implementation details

## Testing

This project has comprehensive test coverage:
- **Unit & Integration Tests**: 148 tests across 11 test files, maintaining 93%+ code coverage
- **E2E Tests**: 18 tests running across 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)

### Running Tests

```bash
# Watch mode - tests re-run on changes
npm test

# Run once (for CI/CD)
npm run test:run

# Generate coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Test Structure

```
src/
├── UrlHelper.test.ts           # URL generation utilities
├── Loader.test.ts              # Data loading and caching
├── App.test.tsx                # Routing logic
├── Player.test.tsx             # Audio player controls
├── AlbumArt.test.tsx           # Responsive album art
├── AlbumArtSmall.test.tsx      # Small album art with flip
├── AlbumArtLarge.test.tsx      # Large dual-image display
├── Navigation.test.tsx         # Year navigation
├── TrackInfo.test.tsx          # Track metadata display
├── Links.test.tsx              # Download & Spotify links
├── Root.test.tsx               # Integration tests
└── test/
    ├── setup.ts                # Test environment setup
    └── mocks/                  # Mock data and utilities

e2e/
└── music-player.spec.ts        # E2E tests with Playwright
```

For detailed testing documentation:
- [docs/testing_plan.md](docs/testing_plan.md) - Unit and integration testing
- [docs/e2e-testing.md](docs/e2e-testing.md) - E2E testing guide

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Vite Features Guide](https://vitejs.dev/guide/features.html)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
