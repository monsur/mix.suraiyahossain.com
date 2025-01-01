const fs = require('fs');

const year = process.argv[2];

fs.readFile(`public/years/${year}/data.json`, function (err, data) {
  if (err) throw err;
  const mixData = JSON.parse(data);
  processMix(mixData);
  console.log(JSON.stringify(mixData, null, ` `));
});

const processMix = function (mixData) {
  for (let i = 0; i < mixData.tracks.length; i++) {
    const artist = mixData.tracks[i].artist;
    const title = mixData.tracks[i].title;

    const artist_ = scrubString(artist);
    const title_ = scrubString(title);
    const trackNo_ = getTrackNo(i);

    let src = `${trackNo_}-${artist_}-${title_}.mp3`;
    mixData.tracks[i].src = src;
  }
}

const scrubString = function (input) {
  var newString = "";
  for (let i = 0; i < input.length; i++) {
    if (isValidChar(input.charCodeAt(i))) {
      newString += input[i];
    }
  }
  return newString;
}

const isValidChar = function (code) {
  return (code > 47 && code < 58) || // numeric (0-9)
    (code > 64 && code < 91) || // upper alpha (A-Z)
    (code > 96 && code < 123); // lower alpha (a-z)
}

const getTrackNo = function(i) {
  return (i + 1).toString().padStart(2, '0');
}