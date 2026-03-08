import { useEffect } from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import "./ErrorFallback.css";

interface ErrorFallbackProps {
  error: Error | unknown;
  resetError?: () => void;
}

// Used as the route-level errorElement. React Router catches render errors
// before they reach Sentry.ErrorBoundary, so this component captures them
// to Sentry manually and renders the same ErrorFallback UI.
export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();

  useEffect(() => {
    Sentry.captureException(error, { tags: { source: "route-error" } });
  }, [error]);

  return (
    <ErrorFallback error={error} resetError={() => navigate(0)} />
  );
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  const errorStack = error instanceof Error ? error.stack : undefined;
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <h1>Oops! Something went wrong</h1>
        <p className="error-message">
          We've encountered an unexpected error. The issue has been automatically reported.
        </p>

        <div className="error-actions">
          {resetError && (
            <button onClick={resetError} className="error-button">
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.href = "/"}
            className="error-button error-button-secondary"
          >
            Go to Home
          </button>
        </div>

        {import.meta.env.DEV && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="error-stack">
              <code>
                {errorMessage}
                {errorStack && "\n\n"}
                {errorStack}
              </code>
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
