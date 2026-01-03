import * as Sentry from "@sentry/react";

export default class Logger {
  static logToServer = (category: string, action: string, label: string) => {
    if (window["console"]) {
      window["console"].log("event", action, {
        event_category: category,
        event_label: label,
      });
    }
    if (window["gtag"]) {
      window["gtag"]("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  };

  static log = (
    category: string,
    action: string,
    label?: string,
    year?: number
  ) => {
    let logstr = "[" + category + ", " + action + "] ";
    if (year) {
      logstr += year + ", ";
    }
    if (label) {
      logstr += label;
    }
    Logger.logToServer(category, action, logstr);
  };

  static error = (
    category: string,
    action: string,
    message: string,
    year?: number
  ) => {
    let logstr = "[" + category + ", " + action + "] " + message;
    if (year) {
      logstr += " (year: " + year + ")";
    }

    // Log to console
    if (window["console"]) {
      window["console"].error(logstr);
    }

    // Log to Google Analytics
    if (window["gtag"]) {
      window["gtag"]("event", "error", {
        event_category: category,
        event_label: logstr,
      });
    }

    // Send breadcrumb to Sentry for context
    Sentry.addBreadcrumb({
      category: category,
      message: message,
      level: "error",
      data: {
        action,
        year,
      },
    });
  };
}
