var year = Helpers.parseYear(window.location);
var redirect = "/index.html#" + year;
Analytics.log(
  "navigation",
  "redirect",
  "Redirecting from " + window.location + " to " + redirect,
  year
);
window.location.href = redirect;
