export interface YearData {
  title: string,
  year: number,
  tracks: TrackData[]
};

export interface TrackData {
  src: string,
  title: string,
  artist: string
}