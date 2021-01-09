var Mix = function() {
  this.tracks = [];
  this.currentTrackId = 0;
  this.backup = null;
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
  if (this.currentTrackId == this.tracks.length - 1) {
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

Mix.prototype.shuffle = function() {
  this.backup = this.tracks;
  for (var i = 0; i < this.tracks.length; i++) {
    var randPos = Math.floor(Math.random() * Math.floor(this.tracks.length));
    var temp = this.tracks[i];
    this.tracks[i] = this.tracks[randPos];
    this.tracks[randPos] = temp;
  }
};

Mix.prototype.unshuffle = function() {
  this.tracks = this.backup;
};