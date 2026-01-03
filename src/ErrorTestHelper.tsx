/**
 * Error Test Helper Component
 *
 * This component is for TESTING PURPOSES ONLY.
 * It provides buttons to trigger different types of errors to verify Sentry integration.
 *
 * To use:
 * 1. Import this component in App.tsx
 * 2. Add <ErrorTestHelper /> temporarily in your render
 * 3. Test the error reporting
 * 4. Remove the component before deploying to production
 *
 * Example usage in App.tsx:
 * import { ErrorTestHelper } from './ErrorTestHelper';
 *
 * // Inside your component:
 * {import.meta.env.DEV && <ErrorTestHelper />}
 */

import * as Sentry from "@sentry/react";
import "./ErrorTestHelper.css";

export function ErrorTestHelper() {
  const triggerComponentError = () => {
    throw new Error("Test: Component error from ErrorTestHelper");
  };

  const triggerPromiseRejection = () => {
    Promise.reject(new Error("Test: Unhandled promise rejection"));
  };

  const triggerManualCapture = () => {
    Sentry.captureException(new Error("Test: Manual Sentry.captureException"));
    alert("Manual error sent to Sentry! Check your dashboard.");
  };

  const triggerConsoleError = () => {
    // This simulates an error that would be caught by window.onerror
    setTimeout(() => {
      throw new Error("Test: Uncaught error from setTimeout");
    }, 100);
  };

  return (
    <div className="error-test-helper">
      <div className="error-test-header">
        <h3>🧪 Error Testing (Dev Only)</h3>
        <p>Click buttons to test error reporting</p>
      </div>

      <div className="error-test-buttons">
        <button onClick={triggerComponentError} className="test-button red">
          Component Error
        </button>
        <button onClick={triggerPromiseRejection} className="test-button orange">
          Promise Rejection
        </button>
        <button onClick={triggerManualCapture} className="test-button blue">
          Manual Capture
        </button>
        <button onClick={triggerConsoleError} className="test-button purple">
          Uncaught Error
        </button>
      </div>

      <div className="error-test-info">
        <small>
          <strong>Note:</strong> Errors in development mode are logged but not sent to Sentry.
          Run <code>npm run build && npm run preview</code> to test production error reporting.
        </small>
      </div>
    </div>
  );
}
