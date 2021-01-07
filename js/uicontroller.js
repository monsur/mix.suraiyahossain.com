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
  } else if (viewportWidth <= 900) {
    this.mode = "medium";
    contentWidth = viewportWidth;
    imgWidth = contentWidth/2;
    marginTop = 60;
  } else {
    this.mode = "large";
    contentWidth = 900;
    imgWidth = contentWidth/2;
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

UiController.prototype.setBackgroundColor = function(color) {
  document.body.style.backgroundColor = color;
};

UiController.prototype.setAlbumArt = function(frontSrc, backSrc, altText) {
 document.getElementById("albumartfrontimg").alt = altText;
 document.getElementById("albumartbackimg").alt = altText;
 document.getElementById("albumartfrontimg").src = frontSrc;
 document.getElementById("albumartbackimg").src = backSrc;
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
    return;
  }
  var newImg = this.frontCover;
  if (document.getElementById("albumartfrontimg").src.toLowerCase().indexOf(newImg) >= 0) {
    newImg = this.backCover;
  }
  document.getElementById("albumartfrontimg").src = newImg;
  return newImg;
};