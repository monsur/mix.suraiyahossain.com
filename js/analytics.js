var Analytics = function () {};

Analytics.log = function (mix, action, label) {
  if (window.console) {
    var logstr = "LOG: " + mix + ", " + action;
    if (label) {
      logstr += ", " + label;
    }
    console.log(logstr);
  }
  if (window.ga) {
    ga("send", "event", Analytics.year, action, label);
  }
};

Analytics.error = function(mix, e) {
  Analytics.log(mix, "error", e);
};
