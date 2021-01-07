var Events = function() { };

Events.clickYearNav = function(page, year) {
  page.loadMix(year);
};

Events.clickDownloadLink = function() {
  Analytics.log("download");
};

Events.clickAlbumArt = function(page) {
  var newImg = page.ui.toggleAlbumArt();
  Analytics.log('albumart', newImg);
};

Events.onPlayerError = function(page) {
  page.ui.showPlay();
};

Events.onPlayerEnded = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = null;
  var isPlaying = false;
  if (mix.isFinished()) {
    // If mixed is finished, reset to the beginning and stop playing.
    page.ui.showPlay();
    mix.startOver();
    track = mix.getCurrentTrack();
  } else {
    // Otherwise, load next track and continue playing.
    track = mix.playNextTrack();
    isPlaying = true;
  }
  page.updateTrack(track, mix.getNextTrack(), isPlaying ? "play" : "end", isPlaying);
};

Events.clickPlay = function(page) {
  var mix = page.mixes.getCurrentMix();
  var isPlaying = page.player.togglePlay();
  page.ui.togglePlay(isPlaying);
  Analytics.log(isPlaying ? "play" : "pause", mix.getCurrentTrack().toString());
};

Events.clickPreviousTrack = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playPreviousTrack();
  page.updateTrack(track, mix.getNextTrack(), "prev");
};

Events.clickNextTrack = function(page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playNextTrack();
  page.updateTrack(track, mix.getNextTrack(), "next");
};

Events.onResize = function(page) {
  page.ui.resize();
};