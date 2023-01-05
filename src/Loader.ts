import Globals from "./Globals";
import { TrackData } from "./Types";
import UrlHelper from "./UrlHelper";

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
      // Return data if tracks were previously cached.
      return this.years[year];
    }

    const urlHelper = new UrlHelper(year);
    return fetch(urlHelper.getDataFileUrl())
      .then((resp) => resp.json())
      .then((data) => {
        // Move the top-level fields that are common across a single year down to the track level.
        // Doing this so that each track contains all the data to render itself.
        // This will make it easier to shuffle across all mixes.

        // Create a source data object that has all the "global" fields.
        urlHelper.setData(data);
        const sourceData: any = this.getSourceData(data, urlHelper);

        // Add the "global" fields to each track.
        let trackData: TrackData[] = [];
        data.tracks.forEach((item: any, i: number) => {
          let track = { ...item, ...sourceData };
          track.url = urlHelper.getTrackUrl(track.src);
          trackData.push(track);
        });

        // Cache the tracks.
        this.years[year] = trackData;

        return trackData;
      });
  }

  private getSourceData(data: any, urlHelper: UrlHelper) {
    const sourceData: any = {};
    for (var key in data) {
      if (!data.hasOwnProperty(key)) {
        continue;
      }
      if (key === "tracks") {
        continue;
      }
      sourceData[key] = data[key];
    }
    sourceData.albumArtFront = urlHelper.getFrontAlbumArtUrl();
    sourceData.albumArtBack = urlHelper.getBackAlbumArtUrl();
    sourceData.downloadUrl = urlHelper.getDownloadUrl();
    return sourceData;
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
