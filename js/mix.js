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

Mix.prototype.hasNextTrack = function() {
  if (this.currentTrackId == this.tracks.length - 2) {
    return false;
  }
  return true;
};

Mix.prototype.hasPreviousTrack = function() {
  if (this.currentTrackId == 0) {
    return false;
  }
  return true;
};

Mix.prototype.getCurrentTrack = function() {
  return this.getTrack(this.currentTrackId);
};

Mix.prototype.getNextTrack = function() {
  if (this.hasNextTrack()) {
    return this.getTrack(this.currentTrackId + 1);
  }
  return null;
};

Mix.prototype.playNextTrack = function() {
  if (!this.hasNextTrack()) {
    return null;
  }
  this.currentTrackId++;
  return this.getCurrentTrack();
};

Mix.prototype.playPreviousTrack = function() {
  if (this.hasPreviousTrack()) {
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