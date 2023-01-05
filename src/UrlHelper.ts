import Globals from "./Globals";

interface MixData {
  year: number;
  mixTitle: string;
}

export default class UrlHelper {
  static S3_PREFIX = "https://s3.amazonaws.com/mix.suraiyahossain.com/";
  static FRONT_IMG = "front.jpg";
  static BACK_IMG = "back.jpg";

  mixTitle: string;
  year: number;

  constructor(year: number) {
    this.year = year;
    this.mixTitle = "";
  }

  setData(data: MixData): void {
    this.year = data.year;
    this.mixTitle = data.mixTitle;
  }

  getPathPrefix(): string {
    return "/years/" + this.year;
  }

  getS3Prefix(): string {
    return UrlHelper.S3_PREFIX + this.year;
  }

  getDataFileUrl(): string {
    return this.getPathPrefix() + "/data.json";
  }

  getFrontAlbumArtUrl(): string {
    return this.getPathPrefix() + "/" + UrlHelper.FRONT_IMG;
  }

  getBackAlbumArtUrl(): string {
    return this.getPathPrefix() + "/" + UrlHelper.BACK_IMG;
  }

  getDownloadUrl(): string {
    return this.getS3Prefix() + "/" + this.mixTitle + ".zip";
  }

  getTrackUrl(src: string): string {
    if (Globals.TEST_AUDIO) {
      return "testtrack.mp3";
    }
    return this.getS3Prefix() + "/tracks/" + src;
  }
}
