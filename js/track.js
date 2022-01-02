var Track = function (s3prefix) {
  this.s3prefix = s3prefix || S3_PREFIX;
};

Track.prototype.setYear = function (year) {
  this.year = year;
  this.frontCoverLink = "years/" + year + "/front.jpg";
  this.backCoverLink = "years/" + year + "/back.jpg";
  return this;
};

Track.prototype.setTitle = function (title) {
  this.title = title;
  return this;
};

Track.prototype.setArtist = function (artist) {
  this.artist = artist;
  return this;
};

// setYear needs to be called before calling this.
// I did this because I like the way it looks.
// TODO: Maybe fix this later.
Track.prototype.setLink = function (file) {
  this.link = this.s3prefix + this.year + "/tracks/" + file;
  return this;
};

Track.prototype.setSpotifyLink = function (spotifyLink) {
  this.spotifyLink = spotifyLink;
  return this;
};

Track.prototype.setMixTitle = function (mixTitle) {
  this.mixTitle = mixTitle;
  this.downloadLink = this.s3prefix + this.year + "/" + mixTitle + ".zip";
  return this;
};

Track.prototype.setBackgroundColor = function (backgroundColor) {
  this.backgroundColor = backgroundColor;
  return this;
};

Track.prototype.getYear = function () {
  return this.year;
};

Track.prototype.getTitle = function () {
  return this.title;
};

Track.prototype.getArtist = function () {
  return this.artist;
};

Track.prototype.getLink = function () {
  return this.link;
};

Track.prototype.getSpotifyLink = function () {
  return this.spotifyLink;
};

Track.prototype.getDownloadLink = function () {
  return this.downloadLink;
};

Track.prototype.getFrontCoverLink = function () {
  return this.frontCoverLink;
};

Track.prototype.getBackCoverLink = function () {
  return this.backCoverLink;
};

Track.prototype.getMixTitle = function () {
  return this.mixTitle;
};

Track.prototype.getBackgroundColor = function () {
  return this.backgroundColor;
};

Track.prototype.toString = function () {
  return this.getArtist() + " - " + this.getTitle();
};
