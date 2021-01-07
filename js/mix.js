var Mix = function() {
  this.tracks = [];
  this.currentTrackId = 0;
};

Mix.prototype.addTracks = function(tracks) {
  for (var i = 0; i < tracks.length; i++) {
    this.tracks.push(tracks[i]);
  }
  return this;
};

Mix.prototype.getTrack = function(i) {
  return this.tracks[i];
};

Mix.prototype.getCurrentTrack = function() {
  return this.getTrack(this.currentTrackId);
};

Mix.prototype.playNextTrack = function() {
  if (this.currentTrackId == this.tracks.length - 2) {
    return null;
  }
  this.currentTrackId++;
  return this.getCurrentTrack();
};

Mix.prototype.playPreviousTrack = function() {
  if (this.currentTrackId == 0) {
    return null;
  }
  this.currentTrackId--;
  return this.getCurrentTrack();
};

Mix.prototype.isFinished = function() {
  return this.currentTrackId == this.tracks.length - 1;
};

Mix.prototype.startOver = function() {
  this.currentTrackId = 0;
};