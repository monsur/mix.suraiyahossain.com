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

var playIcon = 'images/play.png';
var pauseIcon = 'images/pause.png';

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

Mix.prototype.startOver = function() {
  return this.currentTrackId = 0;
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
      that.setCurrentSrc(that.mix.startOver(), false);
      return;
    }
    that.nextTrack(true);
  });

  this.setCurrentSrc();
};

Player.prototype.setCurrentSrc = function(keepPlaying) {
  var isPlaying = keepPlaying || !this.htmlPlayer.paused;
  var track = this.mix.getCurrentTrack();
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
    nextTrackText = 'Next: ' + nextTrack.title + ' - ' + nextTrack.artist;
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
** Main function
******************************************************************************/

(function() {
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

   // Globals on purpose to preserve existing functionality, todo refactor later.
    _DATA = mix.data;
    YEAR = mix.getYear();
    player = new Player(mix);

    document.title = _DATA.title;
    document.body.style.backgroundColor = _DATA.backgroundColor;
    document.getElementById('albumartfrontimg').src = frontCover;
    document.getElementById('albumartfrontimg').alt = _DATA.title;
    document.getElementById('albumartbackimg').src = backCover;
    document.getElementById('albumartbackimg').alt = _DATA.title;
    document.getElementById('downloadLink').href = getDownloadUrl(_DATA.title);
    document.getElementById('spotifyLink').href = _DATA.spotify;
    document.getElementById('audioplayer').src = getTrackUrl(_DATA.tracks[0].src);
    document.getElementById('title').innerHTML = _DATA.tracks[0].title;
    document.getElementById('artist').innerHTML = _DATA.tracks[0].artist;
    document.getElementById('nexttrack').innerHTML = 'Next: ' + 
        _DATA.tracks[1].artist + ' - ' + _DATA.tracks[1].title;

    resize();

    window.addEventListener('resize', resize);

    document.getElementById('downloadLink').addEventListener('click',
      function(evt) {
        track('download', 1);
      });

    document.getElementById('albumart').style.display = 'block';
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
          evt.target.src = isPlaying ? pauseIcon : playIcon;
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

})();

