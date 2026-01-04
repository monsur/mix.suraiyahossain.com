# Sentry Error Tracking Setup Guide

This project uses [Sentry](https://sentry.io) for error tracking and monitoring. This guide will help you set up and test error reporting.

## What's Been Implemented

✅ **Error Boundaries** - Catches React component errors
✅ **Global Error Handlers** - Catches uncaught exceptions and promise rejections
✅ **Enhanced Player Error Handling** - Audio playback errors
✅ **Enhanced Loader Error Handling** - Data fetching errors
✅ **Logger Integration** - Logs errors to console, Google Analytics, and Sentry
✅ **Error Fallback UI** - User-friendly error screen
✅ **Source Maps** - Automatic upload for production debugging
✅ **Session Replay** - Records sessions when errors occur

## Setup Instructions

### 1. Create a Sentry Account (3 minutes)

1. Go to [https://sentry.io/signup/](https://sentry.io/signup/)
2. Sign up with GitHub or email
3. Create a new project:
   - Select **React** as the platform
   - Name it: `mix-suraiyahossain-com` (or your preference)
   - Skip the SDK setup wizard (we've already done this!)

### 2. Get Your DSN (1 minute)

1. In your Sentry project, go to **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
2. Copy the **DSN** - it looks like:
   ```
   https://abc123def456@o0000000.ingest.sentry.io/0000000
   ```

### 3. Configure Environment Variables (2 minutes)

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your DSN:

```bash
# Required: Your Sentry DSN
VITE_SENTRY_DSN=https://your-public-key@o0000000.ingest.sentry.io/0000000

# Optional (for source map uploads in production):
SENTRY_AUTH_TOKEN=your-auth-token-here
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
```

**Note:** Source map upload is optional for initial testing. You can add it later when deploying to production.

### 4. Test Locally (2 minutes)

Start the development server:

```bash
npm run dev
```

**Important:** In development mode, errors are logged to console but **NOT sent to Sentry**. This prevents cluttering your Sentry dashboard during development.

To test the error fallback UI in development, see the testing section below.

### 5. Test in Production Build (2 minutes)

Build and preview the production version:

```bash
npm run build
npm run preview
```

Now errors **will be sent to Sentry**. Try triggering a test error (see testing section).

## Testing Error Reporting

### Method 1: Test Button (Easiest)

Add a test button temporarily to [src/App.tsx](src/App.tsx):

```tsx
// Add inside your App component's return statement
<button onClick={() => {
  throw new Error("Test error from App component");
}}>
  Trigger Test Error
</button>
```

Click the button and check:
1. Error fallback UI appears
2. Error appears in Sentry dashboard (in production build only)

### Method 2: Console Test

Open browser console and run:

```javascript
// Test uncaught error
throw new Error("Test error from console");

// Test unhandled promise rejection
Promise.reject(new Error("Test promise rejection"));
```

### Method 3: Simulate Real Errors

**Audio Playback Error:**
- Modify a track URL in [public/years/2025.json](public/years/2025.json) to an invalid URL
- Try playing that track

**Data Loading Error:**
- Rename a year file (e.g., `2025.json` → `2025-backup.json`)
- Try loading that year
- The Loader will catch and report the error to Sentry

### Method 4: Test with Sentry Test Command

Add a test button that uses Sentry's built-in test:

```tsx
import * as Sentry from "@sentry/react";

<button onClick={() => {
  Sentry.captureException(new Error("Manual Sentry test"));
}}>
  Send Test to Sentry
</button>
```

## What Gets Reported to Sentry

When an error occurs, Sentry receives:

- **Stack trace** (with source maps in production)
- **Error message and type**
- **Component name** (where error occurred)
- **User context:**
  - URL where error happened
  - Browser and OS info
  - Screen resolution
- **Breadcrumbs** (timeline of events leading to error):
  - User actions (clicks, navigation)
  - Console logs
  - API calls
- **Custom context:**
  - Track info (for Player errors)
  - Year info (for Loader errors)
  - Component tags

## Viewing Errors in Sentry

1. Go to [https://sentry.io](https://sentry.io)
2. Select your project
3. Click **Issues** in the sidebar
4. Click on an error to see:
   - Full stack trace
   - User context
   - Breadcrumbs timeline
   - Tags and metadata
   - Session replay (if error occurred during recorded session)

## Source Map Upload (Optional)

Source maps allow Sentry to show you the exact line in your **TypeScript** code (not minified JavaScript).

### Setup Source Map Upload:

1. Create a Sentry auth token:
   - Go to [https://sentry.io/settings/account/api/auth-tokens/](https://sentry.io/settings/account/api/auth-tokens/)
   - Click **Create New Token**
   - Name: `CI Source Maps Upload`
   - Scopes: Select `project:releases` and `org:read`
   - Copy the token

2. Add to your `.env` file:
   ```bash
   SENTRY_AUTH_TOKEN=sntrys_your_token_here
   SENTRY_ORG=your-org-slug  # Find in Sentry URL
   SENTRY_PROJECT=your-project-slug
   ```

3. Build for production:
   ```bash
   npm run build
   ```

Source maps will be automatically uploaded to Sentry during the build process, then deleted from the build folder (so they're not deployed to users).

## Alerts and Notifications

To avoid being overwhelmed:

1. **Configure Alert Rules:**
   - Go to **Settings** → **Alerts**
   - Set up rules like:
     - "Alert me when a new issue is created"
     - "Alert me when an issue affects > 10 users"
   - Choose Slack, email, or just in-app notifications

2. **Issue Grouping:**
   - Sentry automatically groups similar errors
   - You'll see "100 events" for the same bug, not 100 separate emails

3. **Release Tracking:**
   - Errors are tracked per release
   - See which deploy introduced a bug

## Cost and Limits

**Free Tier:**
- 5,000 errors/month
- 1 user
- 30-day retention
- 10,000 performance transactions/month
- 50 session replays/month

For a personal project, the free tier should be plenty!

## Disabling Sentry

To temporarily disable Sentry:

1. **Development:** Already disabled by default
2. **Production:** Remove or comment out `VITE_SENTRY_DSN` from `.env`

## Troubleshooting

### "Errors not appearing in Sentry"

1. Check you're running a **production build** (`npm run build && npm run preview`)
2. Verify `VITE_SENTRY_DSN` is set in `.env`
3. Check browser console for Sentry initialization messages
4. Verify you're looking at the correct project in Sentry dashboard

### "Source maps not working"

1. Verify `SENTRY_AUTH_TOKEN` is set correctly
2. Check build output for source map upload confirmation
3. Ensure your Sentry token has `project:releases` scope
4. Check Sentry project settings → Source Maps

### "Too many errors being reported"

1. Review **beforeSend** hook in [src/index.tsx](src/index.tsx) to filter errors
2. Adjust sample rates (currently 10% for performance, 100% for errors)
3. Set up better alert rules to reduce notifications

## Additional Resources

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Best Practices](https://docs.sentry.io/platforms/javascript/best-practices/)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Support

If you have questions or issues:
1. Check the [Sentry documentation](https://docs.sentry.io/)
2. Review the code in [src/index.tsx](src/index.tsx), [src/ErrorFallback.tsx](src/ErrorFallback.tsx), and [src/Logger.ts](src/Logger.ts)
3. Open an issue in this repository
