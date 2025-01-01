const fs = require('fs');

const year = process.argv[2];

fs.readFile(`public/years/${year}/data.json`, function(err, data) { 
    if (err) throw err; 
    const mixData = JSON.parse(data);
    processMix(mixData);
    console.log(JSON.stringify(mixData, null, ` `));
}); 

const processMix = function(mixData) {
  for (var i = 0; i < mixData.tracks.length; i++) {
    const artist = mixData.tracks[i].artist;
    const title = mixData.tracks[i].title;

    const artist_ = scrubString(artist);
    const title_ = scrubString(title);

    var src = (i+1).toString().padStart(2, '0') + "-" + artist_ + "-" + title_ + ".mp3";
    mixData.tracks[i].src = src;
  }
}

const scrubString = function(input) {
  var newString = "";
  for (var i = 0; i < input.length; i++) {
    code = input.charCodeAt(i);
    if ((code > 47 && code < 58) || // numeric (0-9)
        (code > 64 && code < 91) || // upper alpha (A-Z)
        (code > 96 && code < 123)) { // lower alpha (a-z)
          newString += input[i];
        }
  }
  return newString;
}