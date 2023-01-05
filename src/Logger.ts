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
    var logstr = "[" + category + ", " + action + "] ";
    if (year) {
      logstr += year + ", ";
    }
    if (label) {
      logstr += label;
    }
    Logger.logToServer(category, action, logstr);
  };

  // TODO: Should probably log some errors in some places.
  static error = (e: Error) => {
    Logger.logToServer("error", "error", e.toString());
  };
}
