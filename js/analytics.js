var Analytics = function () {};

Analytics.logToServer = function(action, label) {
  if (window.gtag) {
    gtag("event", action, { event_label: label });
  }
};

Analytics.log = function (mix, action, label) {
  var logstr = "LOG: " + mix + ", " + action;
  if (label) {
    logstr += ", " + label;
  }
  if (window.console) {
    console.log(logstr);
  }
  Analytics.logToServer(action, logstr);
};

Analytics.error = function (e) {
  if (window.console) {
    console.error(e);
  }
  Analytics.logToServer("error", e.toString());
};
