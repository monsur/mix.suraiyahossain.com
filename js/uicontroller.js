var UiController = function() {
  document.getElementById("albumart").style.display = "block";
  this.showPlay();
  this.mode = null;
  this.frontCover = null;
  this.backCover = null;
};

UiController.PLAY_ICON = "images/play.png";
UiController.PAUSE_ICON = "images/pause.png";

UiController.prototype.resize = function() {
  // This function needs to be called once onload (after the mix is loaded),
  // and then once every time the window is resized.
  var imgWidth;
  var contentWidth;
  var marginTop;
  var viewportWidth = window.innerWidth;
  if (viewportWidth <= 505) {
    this.mode = "small";
    contentWidth = viewportWidth;
    imgWidth = contentWidth;
    marginTop = 0;
  } else {
    this.mode = "large";
    contentWidth = Math.min(viewportWidth, 900);
    imgWidth = Math.min(contentWidth/2, 900);
    marginTop = 60;
  }
  if (this.mode == "small") {
    document.getElementById("albumartback").style.display = "none";
  } else {
    document.getElementById("albumartback").style.display = "block";
    document.getElementById("albumartfrontimg").src = this.frontCover;
  }
  document.getElementById("albumart").style.marginTop = marginTop + "px";
  document.getElementById("content").style.width = contentWidth + "px";

  var width = imgWidth + "px";
  document.getElementById("albumartbackimg").style.width = width;
  document.getElementById("albumartbackimg").style.height = width;
  document.getElementById("albumartfrontimg").style.width = width;
  document.getElementById("albumartfrontimg").style.height = width;
};

UiController.prototype.togglePlay = function(isPlaying) {
  if (isPlaying) {
    this.showPause();
  } else {
    this.showPlay();
  }
};

UiController.prototype.isPlay = function() {
  return document.getElementById("playaction").src == UiController.PLAY_ICON;
};

UiController.prototype.showPlay = function() {
  document.getElementById("playaction").src = UiController.PLAY_ICON;
};

UiController.prototype.showPause = function() {
  document.getElementById("playaction").src = UiController.PAUSE_ICON;
};

UiController.prototype.setCurrentTrack = function(track) {
  document.getElementById("title").innerHTML = track.getTitle();
  document.getElementById("artist").innerHTML = track.getArtist();
};

UiController.prototype.setNextTrack = function(track) {
  var text = "&nbsp";
  if (track) {
    text = "Next: " + track.getTitle() + " - " + track.getArtist();
  }
  document.getElementById("nexttrack").innerHTML = text;
};

UiController.prototype.setPageTitle = function(title) {
  document.title = title;
};

UiController.prototype.isFrontCoverVisible = function() {
  var img = document.getElementById("albumartfrontimg").src;
  return img.length == 0 || img.indexOf("front.jpg") >= 0;
};

UiController.prototype.setAlbumArt = function(frontSrc, backSrc, altText) {
 document.getElementById("albumartfrontimg").alt = altText;
 document.getElementById("albumartbackimg").alt = altText;
 document.getElementById("albumartbackimg").src = backSrc;
 document.getElementById("albumartfrontimg").src = this.isFrontCoverVisible() ? frontSrc : backSrc;
 this.frontCover = frontSrc;
 this.backCover = backSrc;
};

UiController.prototype.setDownloadLink = function(link) {
  document.getElementById("downloadLink").href = link;
};

UiController.prototype.setSpotifyLink = function(link) {
  document.getElementById("spotifyLink").href = link;
};

UiController.prototype.toggleAlbumArt = function() {
  if (this.mode != "small") {
    return null;
  }
  return document.getElementById("albumartfrontimg").src = this.isFrontCoverVisible() ? this.backCover : this.frontCover;
};

UiController.prototype.nextButtonPress = function() {
  document.getElementById("nextaction").src = 'images/nexttrackpressed.png';
};

UiController.prototype.nextButtonRelease = function() {
  document.getElementById("nextaction").src = 'images/nexttrack.png';
};

UiController.prototype.previousButtonPress = function() {
  document.getElementById("prevaction").src = 'images/prevtrackpressed.png';
};

UiController.prototype.previousButtonRelease = function() {
  document.getElementById("prevaction").src = 'images/prevtrack.png';
};
