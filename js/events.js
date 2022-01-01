var Events = function () {};

Events.onHashChange = function (page) {
  page.loadMix();
};

Events.clickDownloadLink = function () {
  Analytics.log(
    page.mixes.getCurrentMix().getCurrentTrack().getYear(),
    "download"
  );
};

Events.clickAlbumArt = function (page) {
  var newImg = page.ui.toggleAlbumArt();
  if (newImg) {
    Analytics.log(
      page.mixes.getCurrentMix().getCurrentTrack().getYear(),
      "albumart",
      newImg
    );
  }
};

Events.onPlayerError = function (page) {
  page.ui.showPlay();
};

Events.onPlayerEnded = function (page) {
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
  page.updateTrack(
    track,
    mix.getNextTrack(),
    isPlaying ? "play" : "end",
    isPlaying
  );
};

Events.clickPlay = function (page) {
  var mix = page.mixes.getCurrentMix();
  var isPlaying = page.player.togglePlay();
  page.ui.togglePlay(isPlaying);
  Analytics.log(
    page.mixes.getCurrentMix().getCurrentTrack().getYear(),
    isPlaying ? "play" : "pause",
    mix.getCurrentTrack().toString()
  );
};

Events.clickPreviousTrack = function (page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playPreviousTrack();
  page.updateTrack(track, mix.getNextTrack(), "prev");
};

Events.clickNextTrack = function (page) {
  var mix = page.mixes.getCurrentMix();
  var track = mix.playNextTrack();
  page.updateTrack(track, mix.getNextTrack(), "next");
};

Events.onResize = function (page) {
  page.ui.resize();
};

Events.nextButtonPress = function (page) {
  page.ui.nextButtonPress();
};

Events.nextButtonRelease = function (page) {
  page.ui.nextButtonRelease();
};

Events.previousButtonPress = function (page) {
  page.ui.previousButtonPress();
};

Events.previousButtonRelease = function (page) {
  page.ui.previousButtonRelease();
};
