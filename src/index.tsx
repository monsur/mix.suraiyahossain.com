import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ErrorFallback } from "./ErrorFallback";
import "@fontsource/pontano-sans";

// Initialize Sentry error tracking
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Only send errors in production
    beforeSend(event, hint) {
      // Don't send errors in development
      if (import.meta.env.DEV) {
        console.error("Sentry (dev mode, not sent):", hint.originalException || hint.syntheticException);
        return null;
      }
      return event;
    },
  });
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={(errorData) => <ErrorFallback error={errorData.error} resetError={errorData.resetError} />}
      showDialog
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
