import * as Sentry from "@sentry/react";
import Globals from "./Globals";
import { TrackData } from "./Types";
import UrlHelper from "./UrlHelper";
import Logger from "./Logger";

interface MixData {
  tracks: RawTrackData[];
  [key: string]: unknown;
}

interface RawTrackData {
  src: string;
  title: string;
  artist: string;
  [key: string]: unknown;
}

export default class Loader {
  years: {
    [key: number]: TrackData[];
  };

  constructor() {
    this.years = {};
  }

  static shuffleArray<T>(arr: T[]): T[] {
    for (let i = 0; i < arr.length; i++) {
      const j = Math.floor(Math.random() * arr.length);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  loadYear(year: number): TrackData[] | Promise<TrackData[]> {
    if (year in this.years) {
      // Return data if tracks were previously cached.
      return this.years[year];
    }

    const urlHelper = new UrlHelper(year);
    return fetch(urlHelper.getDataFileUrl())
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`Failed to load data for year ${year}: ${resp.status} ${resp.statusText}`);
        }
        return resp.json();
      })
      .then((data) => {
        // Move the top-level fields that are common across a single year down to the track level.
        // Doing this so that each track contains all the data to render itself.
        // This will make it easier to shuffle across all mixes.

        // Create a source data object that has all the "global" fields.
        urlHelper.setData(data);
        const sourceData: Partial<TrackData> = this.getSourceData(data, urlHelper);

        // Add the "global" fields to each track.
        const trackData: TrackData[] = [];
        data.tracks.forEach((item: RawTrackData) => {
          const track = { ...item, ...sourceData } as TrackData;
          track.url = urlHelper.getTrackUrl(track.src);
          trackData.push(track);
        });

        // Cache the tracks.
        this.years[year] = trackData;

        return trackData;
      })
      .catch((error) => {
        const errorMessage = `Failed to load tracks for year ${year}`;
        Logger.error("Loader", "load-year-error", errorMessage, year);
        Sentry.captureException(error, {
          tags: {
            component: "Loader",
            errorType: "data-loading",
          },
          extra: {
            year: year,
            dataUrl: urlHelper.getDataFileUrl(),
          },
        });
        throw new Error(errorMessage, { cause: error });
      });
  }

  private getSourceData(data: MixData, urlHelper: UrlHelper): Partial<TrackData> {
    const sourceData: Record<string, unknown> = {};
    for (const key in data) {
      if (!Object.hasOwn(data, key)) {
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
    return sourceData as Partial<TrackData>;
  }

  loadAll(shuffle: boolean): Promise<TrackData[]> {
    return new Promise((resolve, reject) => {
      const years: number[] = [];
      for (let year = Globals.MIN_YEAR; year <= Globals.MAX_YEAR; year++) {
        years.push(year);
      }

      let tracks: TrackData[] = [];
      Promise.all(years.map((year) => this.loadYear(year)))
        .then((data) => {
          tracks = data.flat();
          if (shuffle) {
            tracks = Loader.shuffleArray(tracks);
          }
          resolve(tracks);
        })
        .catch((error) => {
          Logger.error("Loader", "load-all-error", "Failed to load all tracks", 0);
          Sentry.captureException(error, {
            tags: {
              component: "Loader",
              errorType: "data-loading-all",
            },
            extra: {
              yearRange: `${Globals.MIN_YEAR}-${Globals.MAX_YEAR}`,
              shuffle,
            },
          });
          reject(error);
        });
    });
  }
}
