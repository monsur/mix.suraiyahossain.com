var Analytics = function () {};

Analytics.logToServer = function (category, action, label) {
  if (window.gtag) {
    gtag("event", action, { event_category: category, event_label: label });
  }
};

Analytics.log = function (category, action, label, year) {
  var logstr = "[" + category + ", " + action + "] ";
  if (year) {
    logstr += year + ", ";
  }
  if (label) {
    logstr += label;
  }
  if (window.console) {
    console.log(logstr);
  }
  Analytics.logToServer(category, action, logstr);
};

Analytics.error = function (e) {
  if (window.console) {
    console.error(e);
  }
  Analytics.logToServer("error", "error", e.toString());
};
