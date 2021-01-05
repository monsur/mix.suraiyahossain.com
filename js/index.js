"use strict";

/******************************************************************************
**
** GLOBAL VARIABLES
**
******************************************************************************/

var S3_PREFIX = "https://s3.amazonaws.com/mix.suraiyahossain.com/";
var MIN_YEAR = 2007;
var MAX_YEAR = 2020;

/******************************************************************************
** END GLOBAL VARIABLES
******************************************************************************/

/******************************************************************************
** OBJECT: Analytics
******************************************************************************/

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

/******************************************************************************
** OBJECT: Track
******************************************************************************/

var Track = function(data, year, s3prefix) {
  this.data = data;
  this.year = year;
  this.s3prefix = s3prefix;
};

Track.prototype.getTitle = function() {
  return this.data.title;
};

Track.prototype.getArtist = function() {
  return this.data.artist;
};

Track.prototype.getLink = function() {
  return this.s3prefix + this.year + "/tracks/" + this.data.src;
};

Track.prototype.toString = function() {
  return this.getArtist() + " - " + this.getTitle();
};

/******************************************************************************
** OBJECT: Mix
******************************************************************************/

var Mix = function(data, s3prefix) {
  this.data = data;
  this.s3prefix = s3prefix;
  this.currentTrackId = 0;

  var tracks = [];
  for (var i = 0; i < data.tracks.length; i++) {
    tracks.push(new Track(data.tracks[i], this.data.year, s3prefix));
  }
  this.tracks = tracks;
};

Mix.prototype.getTitle = function() {
  return this.data.title;
};

Mix.prototype.getFrontCoverLink = function() {
  return "years/" + this.data.year + "/front.jpg";
};

Mix.prototype.getBackCoverLink = function() {
  return "years/" + this.data.year + "/back.jpg";
};

Mix.prototype.getBackgroundColor = function() {
  return this.data.backgroundColor;
};

Mix.prototype.getSpotifyLink = function() {
  return this.data.spotify;
};

Mix.prototype.getDownloadLink = function() {
  return this.s3prefix + this.data.year + "/" + this.getTitle() + ".zip"
};

Mix.prototype.getTrack = function(i) {
  return this.tracks[i];
};

Mix.prototype.getCurrentTrack = function() {
  return this.getTrack(this.currentTrackId);
};

Mix.prototype.getNextTrack = function() {
  var pos = this.currentTrackId + 1;
  if (pos < this.tracks.length) {
    return this.tracks[pos];
  }
  return null;
};

Mix.prototype.getPreviousTrack = function() {
  if (this.currentTrackId > 0) {
    return this.tracks[this.currentTrackId - 1];
  }
  return null;
};

Mix.prototype.playNextTrack = function() {
  var track = this.getNextTrack();
  if (track) {
    this.currentTrackId++;
    return track;
  }
  return null;
};

Mix.prototype.playPreviousTrack = function() {
  var track = this.getPreviousTrack();
  if (track) {
    this.currentTrackId--;
    return track;
  }
  return null;
};

Mix.prototype.isFinished = function() {
  return this.currentTrackId == this.tracks.length - 1;
};

Mix.prototype.startOver = function() {
  this.currentTrackId = 0;
};

/******************************************************************************
** OBJECT: Mixes
******************************************************************************/

var Mixes = function(s3prefix) {
  this.mixes = {};
  this.s3prefix = s3prefix || S3_PREFIX;
  this.year = MAX_YEAR;
};

Mixes.getDataLink = function(year) {
  return "years/" + year + "/data.json";
};

Mixes.prototype.load = function(year, callback) {
  var that = this;
  var req = new XMLHttpRequest();
  req.addEventListener("load", function() {
    var mix = new Mix(JSON.parse(req.responseText), that.s3prefix);
    that.mixes[year] = mix;
    if (callback) {
      callback.call(null, mix);
    }
  });
  req.open("GET", Mixes.getDataLink(year));
  req.send();
};

Mixes.prototype.get = function(year, callback, background) {
  var mix = this.mixes[year];
  background = background || false;
  var that = this;

  var callbackWrapper = function(mix) {
    // If the loading was successful, set the current year before calling the
    // user's callback.
    if (!background) {
      that.year = year;
    }
    if (callback) {
      callback.call(null, mix);
    }
  };

  if (mix) {
    callbackWrapper.call(null, mix);
    return;
  }

  this.load(year, callbackWrapper);
};

Mixes.prototype.getCurrentMix = function() {
  // get() must have been called successfully once before calling
  // getCurrentMix()
  return this.mixes[this.year];
}

Mixes.prototype.loadAll = function(year, callback) {
  var that = this;
  if (arguments.length == 1) {
    if (!(typeof year === "number")) {
      callback = year;
      year = MIN_YEAR;
    }
  } else if (arguments.length == 0) {
    year = MIN_YEAR;
    callback = function() {};
  }
  this.get(year, function() {
    var nextYear = year + 1;
    if (nextYear <= MAX_YEAR) {
      that.loadAll(nextYear, callback);
    } else if (callback) {
      callback.call(null);
    }
  }, true);
};

/******************************************************************************
** OBJECT: Player
******************************************************************************/

var Player = function() {
  this.htmlPlayer = document.getElementById("audioplayer");
};

Player.prototype.onError = function(callback) {
  var that = this;
  this.htmlPlayer.addEventListener("error", function() {
    if (that.isPlaying()) {
      that.htmlPlayer.pause();
    }
    if (callback) {
      callback.call(null);
    }
  });
};

Player.prototype.onEnded = function(callback) {
  this.htmlPlayer.addEventListener("ended", callback);
};

Player.prototype.setCurrentTrack = function(track, isPlaying) {
  // TODO: There's an exception if you play a new track before the old track is
  // finshed loading. Figure out if this is a problem.
  // Error message: "The play() request was interrupted by a new load request."
  isPlaying = isPlaying || this.isPlaying();
  this.htmlPlayer.src = track.getLink();
  this.htmlPlayer.load();
  if (isPlaying) {
    // If the player is playing, keep playing.
    this.htmlPlayer.play();
  }
};

Player.prototype.togglePlay = function() {
  var isPlaying = this.isPlaying();
  if (isPlaying) {
    this.htmlPlayer.pause();
  } else {
    this.htmlPlayer.play();
  }
  return !isPlaying;
};

Player.prototype.isPlaying = function() {
  return !this.htmlPlayer.paused;
}

/******************************************************************************
** OBJECT: UiController
******************************************************************************/

var UiController = function() {
  document.getElementById("albumart").style.display = "block";
  this.showPlay();
  this.mode = null;
  this.frontCover = null;
  this.backCover = null;
};

UiController.PLAY_ICON = "images/play.png";
UiController.PAUSE_ICON = "images/pause.png";

UiController.prototype.resize = function() {
  // This function needs to be called once onload (after the mix is loaded),
  // and then once every time the window is resized.
  var imgWidth;
  var contentWidth;
  var marginTop;
  var viewportWidth = window.innerWidth;
  if (viewportWidth <= 505) {
    this.mode = "small";
    contentWidth = viewportWidth;
    imgWidth = contentWidth;
    marginTop = 0;
  } else if (viewportWidth <= 900) {
    this.mode = "medium";
    contentWidth = viewportWidth;
    imgWidth = contentWidth/2;
    marginTop = 60;
  } else {
    this.mode = "large";
    contentWidth = 900;
    imgWidth = contentWidth/2;
    marginTop = 60;
  }
  if (this.mode == "small") {
    document.getElementById("albumartback").style.display = "none";
  } else {
    document.getElementById("albumartback").style.display = "block";
    document.getElementById("albumartfrontimg").src = this.frontCover;
  }
  document.getElementById("albumart").style.marginTop = marginTop + "px";
  document.getElementById("content").style.width = contentWidth + "px";

  var width = imgWidth + "px";
  document.getElementById("albumartbackimg").style.width = width;
  document.getElementById("albumartbackimg").style.height = width;
  document.getElementById("albumartfrontimg").style.width = width;
  document.getElementById("albumartfrontimg").style.height = width;
};

UiController.prototype.togglePlay = function(isPlaying) {
  if (isPlaying) {
    this.showPause();
  } else {
    this.showPlay();
  }
};

UiController.prototype.isPlay = function() {
  return document.getElementById("playaction").src == UiController.PLAY_ICON;
};

UiController.prototype.showPlay = function() {
  document.getElementById("playaction").src = UiController.PLAY_ICON;
};

UiController.prototype.showPause = function() {
  document.getElementById("playaction").src = UiController.PAUSE_ICON;
};

UiController.prototype.setCurrentTrack = function(track) {
  document.getElementById("title").innerHTML = track.getTitle();
  document.getElementById("artist").innerHTML = track.getArtist();
};

UiController.prototype.setNextTrack = function(track) {
  var text = "&nbsp";
  if (track) {
    text = "Next: " + track.getTitle() + " - " + track.getArtist();
  }
  document.getElementById("nexttrack").innerHTML = text;
};

UiController.prototype.setPageTitle = function(title) {
  document.title = title;
};

UiController.prototype.setBackgroundColor = function(color) {
  document.body.style.backgroundColor = color;
};

UiController.prototype.setAlbumArt = function(frontSrc, backSrc, altText) {
 document.getElementById("albumartfrontimg").alt = altText;
 document.getElementById("albumartbackimg").alt = altText;
 document.getElementById("albumartfrontimg").src = frontSrc;
 document.getElementById("albumartbackimg").src = backSrc;
 this.frontCover = frontSrc;
 this.backCover = backSrc;
};

UiController.prototype.setDownloadLink = function(link) {
  document.getElementById("downloadLink").href = link;
};

UiController.prototype.setSpotifyLink = function(link) {
  document.getElementById("spotifyLink").href = link;
};

UiController.prototype.toggleAlbumArt = function() {
  if (this.mode != "small") {
    return;
  }
  var newImg = this.frontCover;
  if (document.getElementById("albumartfrontimg").src.toLowerCase().indexOf(newImg) >= 0) {
    newImg = this.backCover;
  }
  document.getElementById("albumartfrontimg").src = newImg;
  return newImg;
};

/******************************************************************************
** Object: Events
******************************************************************************/

var Events = function() { };

Events.clickYearNav = function(page, year) {
  page.loadYear(year);
};

Events.clickDownloadLink = function() {
  Analytics.log("download");
};

Events.clickAlbumArt = function(page) {
  var newImg = page.ui.toggleAlbumArt();
  Analytics.log('albumart', newImg);
};

Events.onPlayerError = function(page) {
  page.ui.showPlay();
};

Events.onPlayerEnded = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = null;
  var isPlaying = false;
  if (mix.isFinished()) {
    // If mixed is finished, reset to the beginning and stop playing.
    page.ui.showPlay();
    mix.startOver();
    track = mix.getCurrentTrack();
  } else {
    // Otherwise, load next track and continue playing.
    track = mix.playNextTrack();
    isPlaying = true;
  }
  page.updateTrack(track, mix.getNextTrack(), isPlaying ? "play" : "end", isPlaying);
};

Events.clickPlay = function(page) {
  var mix = page.mixes.getCurrentMix();
  var isPlaying = page.player.togglePlay();
  page.ui.togglePlay(isPlaying);
  Analytics.log(isPlaying ? "play" : "pause", mix.getCurrentTrack().toString());
};

Events.clickPreviousTrack = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playPreviousTrack();
  page.updateTrack(track, mix.getNextTrack(), "prev");
};

Events.clickNextTrack = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playNextTrack();
  page.updateTrack(track, mix.getNextTrack(), "next");
};

Events.onResize = function(page) {
  page.ui.resize();
}

/******************************************************************************
** Object: Page
******************************************************************************/

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
  this.mixes.get(year, function() {
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

/******************************************************************************
** Main function
******************************************************************************/
var _PAGE = new Page();
window.onload = function() {
  _PAGE.loadPage();
};
