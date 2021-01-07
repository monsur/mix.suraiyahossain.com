
// Holds methods related to loading the entire page.
// This is a single-page web app, and there are four
// distinct phases to loading the page:
//
// 1) loadPage (runs once per page)
// 2) loadYear (runs every time the mix changes, could be multiple times per page)
// 3) loadYearEnd (runs after the year data is loaded, could be multiple times per page)
// 4) loadPageEnd (runs before the page is done loading, runs once per page)
var Page = function() {
  this.mixes = new Mixes();
  this.player = new Player();
  this.ui = new UiController();
};

// Retrive the year from the url.
// The year is expected to be in the url hash, e.g. #2020
Page.prototype.getYear = function() {
  var re = /(20\d\d)/;
  var matches = re.exec(window.location.hash);
  if (matches && matches.length > 1) {
    var year = parseInt(matches[1]);
    return year;
  }
  return MAX_YEAR;
};

// Entry point for loading the entire page.
// Runs once per-page load.
Page.prototype.loadPage = function() {
  var that = this;

  this.createYearNav();

  this.loadYear(this.getYear(), function() {
    that.loadPageEnd();
  });
};

// Create the navigation links for each year at the bottom of the page.
// Doesn't rely on state so can be run once when the page loads.
Page.prototype.createYearNav = function() {
  var itemsPerLine = 7;
  var that = this;

  // Create links to mixes from previous year.
  // This is done early because it doesn't rely on any mix-specific data.
  var yearLinks = document.getElementById("yearLinks");
  var pos = 0;
  for (var year = MAX_YEAR; year >= MIN_YEAR; year--) {
    if (pos > 0) {
      if (pos % itemsPerLine == 0) {
        yearLinks.append(document.createElement("br"));
      } else {
        yearLinks.append(document.createTextNode(" | "));
      }
    }
    pos++;

    var a = document.createElement("a");
    a.href = '#' + year;
    a.innerHTML = year;
    a.addEventListener("click", function(year) {
      return function() {
        Events.clickYearNav(that, year);
      }
    }(year));
    yearLinks.append(a);
  }
};

Page.prototype.loadPageEnd = function() {

  this.ui.resize();

  this.addEventListeners();

  // The page is hidden by default on page load.
  // Once the entire page's UI is set, show the page.
  document.getElementById('content').style.display = 'block';
};

// Configure all the event listeners for the page.
// Event listeners should be stateless.
Page.prototype.addEventListeners = function() {
  var that = this;

  window.addEventListener("resize", function() {
    Events.onResize(that);
  });

  this.player.onError(function() {
    Events.onPlayerError(that);
  });

  this.player.onEnded(function() {
    Events.onPlayerEnded(that);
  });

  document.getElementById("downloadLink").addEventListener("click", Events.clickDownloadLink);

  document.getElementById("albumart").addEventListener("click", function() {
    Events.clickAlbumArt(that);
  });

  document.getElementById("playaction").addEventListener("click", function() {
    Events.clickPlay(that);
  });

  document.getElementById("prevaction").addEventListener("click", function() {
    Events.clickPreviousTrack(that);
  });

  document.getElementById("nextaction").addEventListener("click", function() {
    Events.clickNextTrack(that);
  });
};

Page.prototype.updateTrack = function(track, nextTrack, action, isPlaying) {
  if (track) {
    this.player.setCurrentTrack(track, isPlaying);
    this.ui.setCurrentTrack(track);
    this.ui.setNextTrack(nextTrack);
    Analytics.log(action, track.toString());
  }
};

Page.prototype.loadYear = function(year, callback) {
  var that = this;
  Analytics.year = year;
  this.mixes.load(year, function() {
    that.loadYearEnd(callback);
  });
}

Page.prototype.loadYearEnd = function(callback) {

    var mix = this.mixes.getCurrentMix();
    var ui = this.ui;
    var player = this.player;

    ui.setPageTitle(mix.getTitle());
    ui.setAlbumArt(mix.getFrontCoverLink(), mix.getBackCoverLink(), mix.getTitle());
    ui.setDownloadLink(mix.getDownloadLink());
    ui.setSpotifyLink(mix.getSpotifyLink());
    this.updateTrack(mix.getCurrentTrack(), mix.getNextTrack(), "load");

    if (callback) {
      callback.call();
    }
};