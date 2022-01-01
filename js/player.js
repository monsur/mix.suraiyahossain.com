var Player = function () {
  this.htmlPlayer = document.getElementById("audioplayer");
};

Player.prototype.onError = function (callback) {
  var that = this;
  this.htmlPlayer.addEventListener("error", function () {
    if (that.isPlaying()) {
      that.htmlPlayer.pause();
    }
    if (callback) {
      callback.call(null);
    }
  });
};

Player.prototype.onEnded = function (callback) {
  this.htmlPlayer.addEventListener("ended", callback);
};

Player.prototype.setCurrentTrack = function (track, isPlaying) {
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

Player.prototype.togglePlay = function () {
  var isPlaying = this.isPlaying();
  if (isPlaying) {
    this.htmlPlayer.pause();
  } else {
    this.htmlPlayer.play();
  }
  return !isPlaying;
};

Player.prototype.isPlaying = function () {
  return !this.htmlPlayer.paused;
};
