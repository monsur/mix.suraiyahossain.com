/******************************************************************************
**
** GLOBAL VARIABLES
**
** WARNING: Use sparingly!
**
******************************************************************************/

var S3_PREFIX = 'https://s3.amazonaws.com/mix.suraiyahossain.com/';
var MIN_YEAR = 2007;
var MAX_YEAR = 2020;
var frontCover;
var backCover;
var mode = 'large';

/******************************************************************************
** END GLOBAL VARIABLES
******************************************************************************/

/******************************************************************************
** Helper functions
******************************************************************************/
var parseYearFromQuery = function() {
  var re = /\?year=(20\d\d)/;
  var matches = re.exec(window.location.search);
  if (matches && matches.length > 1) {
    var year = parseInt(matches[1]);
    return year;
  }
  return MAX_YEAR;
};

var createMixLink = function(year) {
  return 'index.html?year=' + year;
};

var resize = function() {
  // This function needs to be called once onload (after the mix is loaded),
  // and then once every time the window is resized.
  var imgWidth, contentWidth, marginTop;
  var viewportWidth = window.innerWidth;
  if (viewportWidth <= 505) {
    mode = 'small';
    contentWidth = viewportWidth;
    imgWidth = contentWidth;
    marginTop = 0;
  } else if (viewportWidth <= 900) {
    mode = 'medium';
    contentWidth = viewportWidth;
    imgWidth = contentWidth/2;
    marginTop = 60;
  } else {
    mode = 'large';
    contentWidth = 900;
    imgWidth = contentWidth/2;
    marginTop = 60;
  }
  if (mode == 'small') {
    document.getElementById('albumartback').style.display = 'none';
  } else {
    document.getElementById('albumartback').style.display = 'block';
    document.getElementById('albumartfrontimg').src = frontCover;
  }
  document.getElementById('albumart').style.marginTop = marginTop + 'px';
  document.getElementById('content').style.width = contentWidth + 'px';

  var width = imgWidth + 'px';
  document.getElementById('albumartbackimg').style.width = width;
  document.getElementById('albumartbackimg').style.height = width;
  document.getElementById('albumartfrontimg').style.width = width;
  document.getElementById('albumartfrontimg').style.height = width;
};

/******************************************************************************
** OBJECT: Analytics
******************************************************************************/

var Analytics = function() { };

Analytics.year = null;

Analytics.log = function(action, count) {
  count = count || 0;
  if (window.ga) {
    ga('send', 'event', Analytics.year, action, null, count);
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
  return this.s3prefix + this.year + '/tracks/' + this.data.src;
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

Mix.prototype.getYear = function() {
  return this.data.year;
};

Mix.prototype.getTitle = function() {
  return this.data.title;
};

Mix.prototype.getFrontCoverLink = function() {
  return 'years/' + this.getYear() + '/front.jpg';
};

Mix.prototype.getBackCoverLink = function() {
  return 'years/' + this.getYear() + '/back.jpg';
};

Mix.prototype.getBackgroundColor = function() {
  return this.data.backgroundColor;
};

Mix.prototype.getSpotifyLink = function() {
  return this.data.spotify;
};

Mix.prototype.getDownloadLink = function() {
  return this.s3prefix + this.getYear() + '/' + this.getTitle() + '.zip'
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
    Analytics.log('next', this.currentTrackId);
    return track;
  }
  return null;
};

Mix.prototype.playPreviousTrack = function() {
  var track = this.getPreviousTrack();
  if (track) {
    this.currentTrackId--;
    Analytics.log('prev', this.currentTrackId);
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
  return 'years/' + year + '/data.json';
};

Mixes.prototype.load = function(year, callback) {
  var that = this;
  var req = new XMLHttpRequest();
  req.addEventListener('load', function() {
    var mix = new Mix(JSON.parse(req.responseText), that.s3prefix);
    that.mixes[year] = mix;
    if (callback) {
      callback.call(null, mix);
    }
  });
  req.open('GET', Mixes.getDataLink(year));
  req.send();
};

Mixes.prototype.get = function(year, callback) {
  var mix = this.mixes[year];
  var that = this;

  var callbackWrapper = function(mix) {
    // If the loading was successful, set the current year before calling the
    // user's callback.
    that.year = year;
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
  // get() must have been called successfully once before calling getCurrentMix()
  return this.mixes[this.year];
}

/******************************************************************************
** OBJECT: Player
******************************************************************************/

var Player = function() {
  this.htmlPlayer = document.getElementById('audioplayer');
};

Player.prototype.onError = function(callback) {
  var that = this;
  this.htmlPlayer.addEventListener('error', function() {
    if (!that.htmlPlayer.paused) {
      that.htmlPlayer.pause();
    }
    if (callback) {
      callback.call(null);
    }
  });
};

Player.prototype.onEnded = function(callback) {
  this.htmlPlayer.addEventListener('ended', callback);
};

Player.prototype.setCurrentTrack = function(track, isPlaying) {
  var isPlaying = isPlaying || !this.htmlPlayer.paused;
  // TODO: There's an exception if you play a new track before the old track is finshed loading.
  // Figure out if this is a problem.
  // Error message: "The play() request was interrupted by a new load request."
  this.htmlPlayer.src = track.getLink();
  this.htmlPlayer.load();
  if (isPlaying) {
    // If the player is playing, keep playing.
    this.htmlPlayer.play();
  }
};

Player.prototype.togglePlay = function() {
  if (this.htmlPlayer.paused) {
    this.htmlPlayer.play();
    Analytics.log('play', this.currentTrackId);
  } else {
    this.htmlPlayer.pause();
    Analytics.log('pause', this.currentTrackId);
  }
  return !this.htmlPlayer.paused;
};

/******************************************************************************
** OBJECT: UiController
******************************************************************************/

var UiController = function() {
  document.getElementById('albumart').style.display = 'block';
  this.showPlay();
};

UiController.PLAY_ICON = 'images/play.png';
UiController.PAUSE_ICON = 'images/pause.png';

UiController.prototype.togglePlay = function(isPlaying) {
  if (isPlaying) {
    this.showPause();
  } else {
    this.showPlay();
  }
};

UiController.prototype.isPlay = function() {
  return document.getElementById('playaction').src == UiController.PLAY_ICON;
};

UiController.prototype.showPlay = function() {
  document.getElementById('playaction').src = UiController.PLAY_ICON;
};

UiController.prototype.showPause = function() {
  document.getElementById('playaction').src = UiController.PAUSE_ICON;
};

UiController.prototype.setCurrentTrack = function(track) {
  document.getElementById('title').innerHTML = track.getTitle();
  document.getElementById('artist').innerHTML = track.getArtist();
};

UiController.prototype.setNextTrack = function(track) {
  var text = '&nbsp';
  if (track) {
    text = 'Next: ' + track.getTitle() + ' - ' + track.getArtist();
  }
  document.getElementById('nexttrack').innerHTML = text;
};

UiController.prototype.setPageTitle = function(title) {
  document.title = title;
};

UiController.prototype.setBackgroundColor = function(color) {
  document.body.style.backgroundColor = color;
};

UiController.prototype.setAlbumArt = function(frontSrc, backSrc, altText) {
 document.getElementById('albumartfrontimg').alt = altText;
 document.getElementById('albumartbackimg').alt = altText;
 document.getElementById('albumartfrontimg').src = frontSrc;
 document.getElementById('albumartbackimg').src = backSrc;
};

UiController.prototype.setDownloadLink = function(link) {
  document.getElementById('downloadLink').href = link;
};

UiController.prototype.setSpotifyLink = function(link) {
  document.getElementById('spotifyLink').href = link;
};

/******************************************************************************
** Main function
******************************************************************************/
var mixes = new Mixes();
var player = new Player();
var ui = new UiController();

window.onload = function() {

  // Create links to mixes from previous year.
  // This is done early because it doesn't rely on any mix-specific data.
  var yearLinks = document.getElementById('yearLinks');
  var pos = 0;
  for (var i = MAX_YEAR; i >= MIN_YEAR; i--) {
    if (pos > 0) {
      if (pos % 5 == 0) {
        yearLinks.append(document.createElement('br'));
      } else {
        yearLinks.append(document.createTextNode(' | '));
      }
    }
    pos++;
  
    var a = document.createElement('a');
    a.href = createMixLink(i);
    a.innerHTML = i;
    yearLinks.append(a);
  }

  var year = parseYearFromQuery();

  Analytics.year = year;

  mixes.get(year, function() {

    var mix = mixes.getCurrentMix();

    frontCover = mix.getFrontCoverLink();
    backCover = mix.getBackCoverLink();
    ui.setPageTitle(mix.getTitle());
    ui.setBackgroundColor(mix.getBackgroundColor());
    ui.setAlbumArt(mix.getFrontCoverLink(), mix.getBackCoverLink(), mix.getTitle());
    ui.setDownloadLink(mix.getDownloadLink());
    ui.setSpotifyLink(mix.getSpotifyLink());
    ui.setNextTrack(mix.getNextTrack());
    ui.setCurrentTrack(mix.getCurrentTrack());
    player.setCurrentTrack(mix.getCurrentTrack());

    resize();
    window.addEventListener('resize', resize);

    player.onError(function() {
      ui.showPlay();
    });

    player.onEnded(function() {
      var track = null;
      var isPlaying = false;
      if (mix.isFinished()) {
        // If mixed is finished, reset to the beginning and stop playing.
        ui.showPlay();
        mix.startOver();
        track = mix.getCurrentTrack();
      } else {
        // Otherwise, load next track and continue playing.
        track = mix.playNextTrack();
        isPlaying = true;
      }
      if (track) {
        player.setCurrentTrack(track, isPlaying);
        ui.setCurrentTrack(track);
        ui.setNextTrack(mix.getNextTrack());
      }
    });

    document.getElementById('downloadLink').addEventListener('click',
      function() {
        Analytics.log('download', 1);
      });

    document.getElementById('albumart').addEventListener('click',
      function() {
        if (mode != 'small') {
          return;
        }
        var newImg = frontCover;
        if (document.getElementById('albumartfrontimg').src.toLowerCase().indexOf(frontCover) >= 0) {
          newImg = backCover;
        }
        document.getElementById('albumartfrontimg').src = newImg;
      });

    document.getElementById('playaction').addEventListener('click',
      function() {
        var isPlaying = player.togglePlay();
        ui.togglePlay(isPlaying);
      });

    document.getElementById('prevaction').addEventListener('click',
      function() {
        var track = mix.playPreviousTrack();
        if (track) {
          player.setCurrentTrack(track);
          ui.setCurrentTrack(track);
          ui.setNextTrack(mix.getNextTrack());
        }
      });

    document.getElementById('nextaction').addEventListener('click',
      function() {
        var track = mix.playNextTrack(); 
        if (track) {
          player.setCurrentTrack(track);
          ui.setCurrentTrack(track);
          ui.setNextTrack(mix.getNextTrack());
        }
      });
  });
};

