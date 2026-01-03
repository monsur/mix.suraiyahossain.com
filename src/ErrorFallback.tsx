import "./ErrorFallback.css";

interface ErrorFallbackProps {
  error: Error | unknown;
  resetError?: () => void;
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
