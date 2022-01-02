var _PAGE = new Page();
window.onload = function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./serviceworker.js");
  }

  _PAGE.loadPage();
};
