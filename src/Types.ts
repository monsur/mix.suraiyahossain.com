export interface YearData {
  title: string,
  year: number,
  spotify: string,
  tracks: TrackData[]
};

export interface TrackData {
  src: string,
  title: string,
  artist: string
}