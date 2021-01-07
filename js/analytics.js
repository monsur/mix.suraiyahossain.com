var Analytics = function() { };

Analytics.year = null;

Analytics.log = function(action, label) {
  if (Analytics.year == null) {
    console.log("Analytics not available until year is available.");
    return;
  }
  if (window.console) {
    var logstr = "LOG: " + Analytics.year + ", " + action;
    if (label) {
      logstr += ", " + label;
    }
    console.log(logstr);
  }
  if (window.ga) {
    ga("send", "event", Analytics.year, action, label);
  }
};
