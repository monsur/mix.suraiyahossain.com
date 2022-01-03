var Mixes = function (s3prefix) {
  this.s3prefix = s3prefix || S3_PREFIX;
  this.mixes = {};
  this.allMixes = new Mix();
  this.currentMix = null;
};

Mixes.getDataLink = function (label) {
  return "years/" + label + "/data.json";
};

Mixes.prototype.loadTracks = function (data) {
  var tracks = [];
  for (var i = 0; i < data.tracks.length; i++) {
    var trackData = data.tracks[i];
    var track = new Track();
    track
      .setYear(data.year)
      .setTitle(trackData.title)
      .setArtist(trackData.artist)
      .setLink(trackData.src)
      .setSpotifyLink(data.spotify)
      .setMixTitle(data.title)
      .setBackgroundColor(data.backgroundColor);
    tracks.push(track);
  }
  return tracks;
};

Mixes.prototype.load = function (label, callback) {
  var that = this;
  var mix = this.mixes[label];

  var callbackWrapper = function (mix) {
    that.currentMix = mix;
    if (callback) {
      callback.call(null, mix);
    }
  };

  if (mix) {
    callbackWrapper.call(null, mix);
    return;
  }

  fetch(Mixes.getDataLink(label))
    .then((data) => data.json())
    .then((data) => {
      var tracks = that.loadTracks(data);

      var mix = new Mix();
      mix.addTracks(tracks);
      that.mixes[label] = mix;

      that.allMixes.addTracks(tracks);
      if (callbackWrapper) {
        callbackWrapper.call(null, mix);
      }
    })
    .catch((e) => Analytics.error(e));
};

Mixes.prototype.loadAll = function (callback, year) {
  var that = this;
  year = year || MIN_YEAR;
  this.load(year, function () {
    var nextYear = year + 1;
    if (nextYear <= MAX_YEAR) {
      that.loadAll(callback, nextYear);
    } else if (callback) {
      that.allMixes.shuffle();
      that.currentMix = that.allMixes;
      callback.call(null, that.allMixes);
    }
  });
};

Mixes.prototype.getCurrentMix = function () {
  // get() must have been called successfully once before calling
  // getCurrentMix()
  return this.currentMix;
};
