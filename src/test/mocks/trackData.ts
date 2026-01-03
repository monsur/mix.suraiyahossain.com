import { TrackData } from '../../Types'

export const mockTrackData: TrackData = {
  src: '01-Artist-Title.mp3',
  title: 'Mock Track Title',
  artist: 'Mock Artist',
  mixTitle: 'MockMix',
  year: 2025,
  spotify: 'https://open.spotify.com/playlist/mock',
  backgroundColor: '#252222',
  textColor: '#DADDDD',
  url: 'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/tracks/01-Artist-Title.mp3',
  albumArtFront: '/years/2025/front.jpg',
  albumArtBack: '/years/2025/back.jpg',
  downloadUrl: 'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/MockMix.zip',
}

export const mockTrackData2: TrackData = {
  src: '02-AnotherArtist-AnotherTitle.mp3',
  title: 'Another Track',
  artist: 'Another Artist',
  mixTitle: 'MockMix',
  year: 2025,
  spotify: 'https://open.spotify.com/playlist/mock',
  backgroundColor: '#252222',
  textColor: '#DADDDD',
  url: 'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/tracks/02-AnotherArtist-AnotherTitle.mp3',
  albumArtFront: '/years/2025/front.jpg',
  albumArtBack: '/years/2025/back.jpg',
  downloadUrl: 'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/MockMix.zip',
}

export const mockTrackList: TrackData[] = [mockTrackData, mockTrackData2]

export const mockMixData = {
  year: 2025,
  mixTitle: 'MockMix',
  backgroundColor: '#252222',
  textColor: '#DADDDD',
  spotify: 'https://open.spotify.com/playlist/mock',
  tracks: [
    {
      title: 'Mock Track Title',
      artist: 'Mock Artist',
      src: '01-Artist-Title.mp3',
    },
    {
      title: 'Another Track',
      artist: 'Another Artist',
      src: '02-AnotherArtist-AnotherTitle.mp3',
    },
  ],
}
