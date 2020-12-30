/******************************************************************************
**
** GLOBAL VARIABLES
**
** WARNING: Use sparingly!
**
******************************************************************************/

var S3_PREFIX = 'https://s3.amazonaws.com/mix.suraiyahossain.com/';

/******************************************************************************
** END GLOBAL VARIABLES
******************************************************************************/

/******************************************************************************
** Helper functions
******************************************************************************/

// TODO delete after refactoring
var getTrackUrl = function(src) {
  return 'https://s3.amazonaws.com/mix.suraiyahossain.com/' + YEAR + '/tracks/' + src;
};

// TODO delete after refactoring
var getDownloadUrl = function(title) {
  return 'https://s3.amazonaws.com/mix.suraiyahossain.com/' + YEAR + '/' + title + '.zip';
};

// TODO delete after refactoring
var track = function(label, count) {
  count = count || 0;
  if (window.ga) {
    ga('send', 'event', label, 'click', 'player', count);
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

Mix.prototype.playNextTrack = function(callback) {
  var track = this.getNextTrack();
  if (track) {
    this.currentTrackId++;
    callback.call(null, track);
  } else {
    callback.call(null, null);
  }
};

Mix.prototype.playPreviousTrack = function(callback) {
  var track = this.getPreviousTrack();
  if (track) {
    this.currentTrackId--;
    callback.call(null, track);
  } else {
    callback.call(null, null);
  }
};

Mix.prototype.isFinished = function() {
  return this.currentTrackId == this.tracks.length - 1;
};

Mix.prototype.startOver = function(callback) {
  this.currentTrackId = 0;
  callback.call(null, this.getCurrentTrack());
};

/******************************************************************************
** OBJECT: Mixes
******************************************************************************/

var Mixes = function(s3prefix) {
  this.mixes = {};
  this.s3prefix = s3prefix || S3_PREFIX;
};

Mixes.getDataLink = function(year) {
  return 'years/' + year + '/data.js';
};

Mixes.prototype.load = function(year, callback) {
  var that = this;
  var req = new XMLHttpRequest();
  req.addEventListener('load', function() {
    var mix = new Mix(JSON.parse(req.responseText), that.s3prefix);
    that.mixes[year] = mix;
    callback.call(null, mix);
  });
  req.open('GET', Mixes.getDataLink(year));
  req.send();
};

Mixes.prototype.get = function(year, callback) {
  var mix = this.mixes[year];
  if (mix) {
    callback.call(null, mix);
    return;
  }
  this.load(year, callback);
};

/******************************************************************************
** OBJECT: Player
******************************************************************************/

var Player = function(mix, playerId) {
  this.mix = mix;
  this.htmlPlayer = document.getElementById(playerId || 'audioplayer');
  var that = this;

  this.htmlPlayer.addEventListener('error', function() {
    document.getElementById('playaction').src = playIcon;
    if (!that.htmlPlayer.paused) {
      that.htmlPlayer.pause();
    }
  });

  this.htmlPlayer.addEventListener('ended', function() {
    if (that.mix.isFinished()) {
      document.getElementById('playaction').src = playIcon;
      that.mix.startOver(function(track) {
        that.setCurrentSrc(false);
      });
      return;
    }
    //that.nextTrack(true);
  });

  this.setCurrentSrc();
};

Player.prototype.setCurrentSrc = function(keepPlaying) {
  var isPlaying = keepPlaying || !this.htmlPlayer.paused;
  var track = this.mix.getCurrentTrack();
  var nextTrack = this.mix.getNextTrack();

  // TODO: There's an exception if you play a new track before the old track is finshed loading.
  // Figure out if this is a problem.
  // Error message: "The play() request was interrupted by a new load request."
  this.htmlPlayer.src = track.getLink();
  this.htmlPlayer.load();
  if (isPlaying) {
    this.htmlPlayer.play();
  }
  document.getElementById('title').innerHTML = track.getTitle();
  document.getElementById('artist').innerHTML = track.getArtist();
  var nextTrackText = '&nbsp;';
  var nextTrack = this.mix.getNextTrack();
  if (nextTrack) {
    nextTrackText = 'Next: ' + nextTrack.getTitle() + ' - ' + nextTrack.getArtist();
  }
  document.getElementById('nexttrack').innerHTML = nextTrackText;
};

Player.prototype.togglePlay = function(callback) {
  if (this.htmlPlayer.paused) {
    this.htmlPlayer.play();
    track('play', this.currentTrackId);
  } else {
    this.htmlPlayer.pause();
    track('pause', this.currentTrackId);
  }
  if (callback) {
    callback.call(null, !this.htmlPlayer.paused);
  }
};

Player.prototype.nextTrack = function(keepPlaying) {
  var that = this;
  this.mix.playNextTrack(function(track) {
    if (track == null) {
      return;
    }
    that.setCurrentSrc(keepPlaying);
    //track('next', that.currentTrackId);
  });
};

Player.prototype.previousTrack = function(keepPlaying, callback) {
  var that = this;
  this.mix.playPreviousTrack(function(track) {
    if (track == null) {
      return;
    }
    that.setCurrentSrc(keepPlaying);
    //track('prev', that.currentTrackId);
  });
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

UiController.prototype.togglePlay = function() {
  if (this.isPlay()) {
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
 document.getElementById('albumartfrontimg').src = frontSrc;
 document.getElementById('albumartfrontimg').alt = altText;
 document.getElementById('albumartbackimg').src = backSrc;
 document.getElementById('albumartbackimg').alt = altText;
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

var frontCover = 'years/2019/front.jpg';
var backCover = 'years/2019/back.jpg';

var mode = 'large';
var resize = function() {
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

var continueLoading = function(mix) {

  var player = new Player(mix);
  var ui = new UiController();

  ui.setPageTitle(mix.getTitle());
  ui.setBackgroundColor(mix.getBackgroundColor());
  ui.setAlbumArt(mix.getFrontCoverLink(), mix.getBackCoverLink(), mix.getTitle());
  ui.setDownloadLink(mix.getDownloadLink());
  ui.setSpotifyLink(mix.getSpotifyLink());
  ui.setCurrentTrack(mix.getCurrentTrack());
  ui.setNextTrack(mix.getNextTrack());
  document.getElementById('audioplayer').src = mix.getCurrentTrack().getLink();

  resize();

  window.addEventListener('resize', resize);

  document.getElementById('downloadLink').addEventListener('click',
    function(evt) {
      track('download', 1);
    });

  document.getElementById('albumart').addEventListener('click',
    function(evt) {
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
    function(evt) {
      player.togglePlay(function(isPlaying) {
        evt.target.src = isPlaying ? UiController.PAUSE_ICON : UiController.PLAY_ICON;
      });
    });

  document.getElementById('prevaction').addEventListener('click',
    function() { player.previousTrack(); }
    );

  document.getElementById('nextaction').addEventListener('click',
    function() { player.nextTrack(); }
    );
};


window.onload = function() {
  var mixes = new Mixes();
  mixes.get(2019, continueLoading);
};

