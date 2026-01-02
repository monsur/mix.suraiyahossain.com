# mix.suraiyahossain.com

A React + TypeScript music player for Suraiya's annual mixtape collection. Built with [Vite](https://vitejs.dev/).

The biggest development since this README was first written: AI. If you get stuck, ask Claude for help.

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
npm run dev
npm run build
```

## Available Scripts

### `npm run dev`

Starts the Vite development server with instant hot module replacement (HMR).

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page reloads instantly when you make edits.

**Why it's fast:** Vite uses native ES modules in development - no bundling required!

### `npm run build`

Builds the app for production to the `build` folder.

```bash
npm run build
```

The build:
- Runs TypeScript type checking first (`tsc`)
- Bundles with Vite using Rollup
- Optimizes and minifies code
- Outputs to `build/` directory (ready for gh-pages)

### `npm run preview`

Preview the production build locally before deploying.

```bash
npm run preview
```

This serves the `build` folder so you can test the production build on [http://localhost:4173](http://localhost:4173).

### `npm run deploy`

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

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool and dev server
- **React Router 7** - Hash-based routing
- **vite-plugin-svgr** - SVG as React components

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration for source code
- `tsconfig.node.json` - TypeScript configuration for Vite config
- `.eslintrc.cjs` - ESLint rules
- `index.html` - Entry point (Vite uses this directly)
- `.nvmrc` - Node.js version for nvm
- `.node-version` - Node.js version for other version managers (fnm, asdf, etc.)

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Vite Features Guide](https://vitejs.dev/guide/features.html)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
