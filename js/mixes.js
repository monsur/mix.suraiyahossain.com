var Mixes = function(s3prefix) {
  this.s3prefix = s3prefix || S3_PREFIX;
  this.mixes = {};
  this.allMixes = new Mix();
};

Mixes.getDataLink = function(label) {
  return "years/" + label + "/data.json";
};

Mixes.prototype.loadTracks = function(data) {
  var tracks = [];
  for (i = 0; i < data.tracks.length; i++) {
    var track = new Track();
    var trackData = data.tracks[i];
    track.setYear(data.year).setTitle(trackData.title).setArtist(trackData.artist);
    track.setLink(trackData.src).setSpotifyLink(data.spotify).setMixTitle(data.title);
    tracks.push(track);
  }
  return tracks;
};

Mixes.prototype.fetch = function(label, callback) {
  var that = this;
  var req = new XMLHttpRequest();
  req.addEventListener("load", function() {
    var data = JSON.parse(req.responseText);
    var tracks = that.loadTracks(data);

    var mix = new Mix();
    mix.addTracks(tracks);
    that.mixes[label] = mix;

    that.allMixes.addTracks(tracks);

    if (callback) {
      callback.call(null, mix);
    }
  });
  req.open("GET", Mixes.getDataLink(label));
  req.send();
};

Mixes.prototype.load = function(label, callback) {
  var mix = this.mixes[label];
  if (mix) {
    callback.call(null, mix);
    return;
  }
  this.fetch(label, callback);
};

Mixes.prototype.loadAll = function(callback, year) {
  var that = this;
  year = year || MIN_YEAR;
  this.load(label, function() {
    var nextYear = year + 1;
    if (nextYear <= MAX_YEAR) {
      that.loadAll(callback, nextYear);
    } else if (callback) {
      callback.call(null, that.allMixes);
    }
  });
};

Mixes.prototype.getCurrentMix = function() {
  // get() must have been called successfully once before calling
  // getCurrentMix()
  return this.mixes[this.year];
};
