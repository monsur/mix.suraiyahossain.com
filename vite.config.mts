import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { sentryVitePlugin } from "@sentry/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    // Upload source maps to Sentry for better error tracking
    // Only run when SENTRY_AUTH_TOKEN is available (production builds)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './build/**',
        filesToDeleteAfterUpload: ['./build/**/*.map'],
      },
      release: {
        name: process.env.SENTRY_RELEASE || `${Date.now()}`,
        deploy: {
          env: 'production',
        },
      },
    }),
  ].filter(Boolean),
  build: {
    outDir: 'build',
    // Enable source maps for Sentry
    sourcemap: true,
  },
  // For custom domain, base is '/'
  base: '/',
})
