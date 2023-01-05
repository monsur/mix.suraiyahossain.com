import { TrackData } from "./Types";

export default class Loader {
  years: {
    [key: number]: TrackData[];
  };

  constructor() {
    this.years = {};
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
            // TODO: Do this by iterating over the obj (minus 'tracks') so new fields are automatically added.
            // Also need to change sourceData.title to mixTitle in all the json files.
            track.mixTitle = sourceData.title;
            track.year = sourceData.year;
            track.spotify = sourceData.spotify;
            track.backgroundColor = sourceData.backgroundColor;
            track.textColor = sourceData.textColor;
            trackData.push(track);
          });
          this.years[year] = trackData;
          return trackData;
        });
    }
  }
}
