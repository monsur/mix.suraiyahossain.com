
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

// Retrive the label from the url.
// The label is expected to be in the url hash, e.g. #2020
Page.prototype.getMixLabel = function() {
  var re = /(20\d\d)/;
  var mixLabel = "";
  if (window.location.hash) {
    mixLabel = window.location.hash.substr(1);
  }
  var matches = re.exec(mixLabel);
  if ((matches && matches.length > 1) || mixLabel == "all") {
    return mixLabel;
  }
  return MAX_YEAR;
};

// Entry point for loading the entire page.
// Runs once per-page load.
Page.prototype.loadPage = function() {
  var that = this;

  this.createYearNav();

  this.loadMix(function() {
    that.loadPageEnd();
  });
};

// Create the navigation links for each year at the bottom of the page.
// Doesn't rely on state so can be run once when the page loads.
Page.prototype.createYearNav = function() {
  var itemsPerLine = 7;

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

  window.addEventListener("hashchange", function() {
    Events.onHashChange(that);
  })

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

  document.getElementById("prevaction").addEventListener("mousedown", function() {
    Events.previousButtonPress(that);
  });

  document.getElementById("prevaction").addEventListener("touchstart", function() {
    Events.previousButtonPress(that);
  });

  document.getElementById("prevaction").addEventListener("mouseup", function() {
    Events.previousButtonRelease(that);
  });

  document.getElementById("prevaction").addEventListener("touchend", function() {
    Events.previousButtonRelease(that);
  });

  document.getElementById("prevaction").addEventListener("touchcancel", function() {
    Events.previousButtonRelease(that);
  });

  document.getElementById("nextaction").addEventListener("click", function() {
    Events.clickNextTrack(that);
  });

  document.getElementById("nextaction").addEventListener("mousedown", function() {
    Events.nextButtonPress(that);
  });

  document.getElementById("nextaction").addEventListener("touchstart", function() {
    Events.nextButtonPress(that);
  });

  document.getElementById("nextaction").addEventListener("mouseup", function() {
    Events.nextButtonRelease(that);
  });

  document.getElementById("nextaction").addEventListener("touchend", function() {
    Events.nextButtonRelease(that);
  });

  document.getElementById("nextaction").addEventListener("touchcancel", function() {
    Events.nextButtonRelease(that);
  });
};

Page.prototype.updateTrack = function(track, nextTrack, action, isPlaying) {
  if (track) {
    this.player.setCurrentTrack(track, isPlaying);
    if (this.prevTrackYear != track.getYear()) {
      this.ui.setPageTitle(track.getMixTitle());
      this.ui.setAlbumArt(track.getFrontCoverLink(), track.getBackCoverLink(), track.getMixTitle());
      this.ui.setDownloadLink(track.getDownloadLink());
      this.ui.setSpotifyLink(track.getSpotifyLink());
      this.prevTrackYear == track.getYear();
    }
    this.ui.setCurrentTrack(track);
    this.ui.setNextTrack(nextTrack);
    Analytics.log(track.getYear(), action, track.toString());
  }
};

Page.prototype.loadMix = function(callback) {
  var that = this;
  var label = this.getMixLabel()

  var callbackWrapper = function(mix) {
    that.loadMixEnd(mix, callback);
  };

  if (label == "all") {
    this.mixes.loadAll(callbackWrapper);
  } else {
    Analytics.year = label;
    this.mixes.load(label, callbackWrapper);
  }
}

Page.prototype.loadMixEnd = function(mix, callback) {
    var ui = this.ui;
    var player = this.player;
    var track = mix.getCurrentTrack();

    this.updateTrack(track, mix.getNextTrack(), "load");

    if (callback) {
      callback.call();
    }
};
