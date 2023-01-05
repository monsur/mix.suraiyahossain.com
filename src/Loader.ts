import Globals from "./Globals";
import { TrackData } from "./Types";

export default class Loader {
  years: {
    [key: number]: TrackData[];
  };

  constructor() {
    this.years = {};
  }

  static shuffleArray(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      let j = Math.floor(Math.random() * arr.length);
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  loadYear(year: number) {
    if (year in this.years) {
      return this.years[year];
    } else {
      return fetch(`/years/${year}/data.json`)
        .then((resp) => resp.json())
        .then((sourceData) => {
          // Move the top-level fields that are common across a single year down to the track level.
          // Doing this so that each track contains all the data to render itself.
          // This will make it easier to shuffle across all mixes.
          let trackData: TrackData[] = [];
          sourceData.tracks.forEach((item: any, i: number) => {
            let track = item;
            for (var key in sourceData) {
              if (!sourceData.hasOwnProperty(key)) {
                continue;
              }
              if (key === "tracks") {
                continue;
              }
              track[key] = sourceData[key];
            }

            track.albumArtFront = "/years/" + track.year + "/" + Globals.FRONT_IMG;
            track.albumArtBack = "/years/" + track.year + "/" + Globals.BACK_IMG;
            track.downloadUrl = Globals.S3_PREFIX + track.year + "/" + track.mixTitle + ".zip";
            track.url = Globals.S3_PREFIX + track.year + "/tracks/" + track.src;
            //track.url = "testtrack.mp3";

            trackData.push(track);
          });
          this.years[year] = trackData;
          return trackData;
        });
    }
  }

  loadAll(shuffle: boolean) {
    // TODO: Add support for reject().
    return new Promise((resolve, reject) => {
      let years: number[] = [];
      for (let year = Globals.MIN_YEAR; year <= Globals.MAX_YEAR; year++) {
        years.push(year);
      }

      let tracks: TrackData[] = [];
      Promise.all(years.map((year) => this.loadYear(year))).then((data) => {
        tracks = data.flat();
        if (shuffle) {
          tracks = Loader.shuffleArray(tracks);
        }
        resolve(tracks);
      });
    });
  }
}
