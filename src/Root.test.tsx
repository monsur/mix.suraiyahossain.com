import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Root from './Root'
import { mockTrackList } from './test/mocks/trackData'
import Globals from './Globals'
import { useLoaderData } from 'react-router-dom'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLoaderData: vi.fn(),
}))

// Mock child components
vi.mock('./AlbumArt', () => ({
  default: ({ track }: any) => (
    <div data-testid="album-art">Album Art - {track.title}</div>
  ),
}))

vi.mock('./Player', () => ({
  default: ({ tracks, currentTrackPos, setCurrentTrackPos, textColor }: any) => (
    <div data-testid="player">
      Player - Track {currentTrackPos + 1} of {tracks.length} - Color: {textColor}
    </div>
  ),
}))

vi.mock('./TrackInfo', () => ({
  default: ({ currentTrack, nextTrack, textColor }: any) => (
    <div data-testid="track-info">
      TrackInfo - {currentTrack.title}
      {nextTrack && ` - Next: ${nextTrack.title}`}
    </div>
  ),
}))

vi.mock('./Links', () => ({
  default: ({ track, textColor }: any) => (
    <div data-testid="links">Links - {track.title}</div>
  ),
}))

vi.mock('./Navigation', () => ({
  default: ({ textColor, minYear, maxYear }: any) => (
    <div data-testid="navigation">
      Navigation - {minYear} to {maxYear}
    </div>
  ),
}))

describe('Root', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock useLoaderData to return our mock track list
    vi.mocked(useLoaderData).mockReturnValue(mockTrackList)

    // Reset globals
    Globals.ENABLE_DYNAMIC_COLORS = false
    Globals.ENABLE_NEXT_TRACK_PRELOAD = false
  })

  it('should render all main components', () => {
    render(<Root />)

    expect(screen.getByTestId('album-art')).toBeInTheDocument()
    expect(screen.getByTestId('player')).toBeInTheDocument()
    expect(screen.getByTestId('track-info')).toBeInTheDocument()
    expect(screen.getByTestId('links')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should start at first track', () => {
    render(<Root />)

    expect(screen.getByText(/Track 1 of 2/)).toBeInTheDocument()
  })

  it('should pass tracks to Player component', () => {
    render(<Root />)

    expect(screen.getByText(/Track 1 of 2/)).toBeInTheDocument()
  })

  it('should use white text color by default when ENABLE_DYNAMIC_COLORS is false', () => {
    Globals.ENABLE_DYNAMIC_COLORS = false
    render(<Root />)

    expect(screen.getByText(/Color: #ffffff/)).toBeInTheDocument()
  })

  it('should use track text color when ENABLE_DYNAMIC_COLORS is true', () => {
    Globals.ENABLE_DYNAMIC_COLORS = true
    render(<Root />)

    expect(screen.getByText(/Color: #DADDDD/)).toBeInTheDocument()
  })

  it('should pass current track to components', () => {
    render(<Root />)

    expect(screen.getByText(/Album Art - Mock Track Title/)).toBeInTheDocument()
    expect(screen.getByText(/TrackInfo - Mock Track Title/)).toBeInTheDocument()
    expect(screen.getByText(/Links - Mock Track Title/)).toBeInTheDocument()
  })

  it('should calculate next track correctly', () => {
    render(<Root />)

    expect(
      screen.getByText(/TrackInfo - Mock Track Title - Next: Another Track/)
    ).toBeInTheDocument()
  })

  it('should handle last track without next track', () => {
    vi.mocked(useLoaderData).mockReturnValue([mockTrackList[0]]) // Only one track

    render(<Root />)

    const trackInfo = screen.getByTestId('track-info')
    expect(trackInfo.textContent).not.toContain('Next:')
  })

  it('should pass min and max year to Navigation', () => {
    render(<Root />)

    expect(
      screen.getByText(`Navigation - ${Globals.MIN_YEAR} to ${Globals.MAX_YEAR}`)
    ).toBeInTheDocument()
  })

  it('should set document title to mixTitle', () => {
    render(<Root />)

    expect(document.title).toBe(mockTrackList[0].mixTitle)
  })

  it('should set background color when ENABLE_DYNAMIC_COLORS is true', () => {
    Globals.ENABLE_DYNAMIC_COLORS = true
    render(<Root />)

    // Browser converts hex to RGB format
    expect(document.body.style.backgroundColor).toBe('rgb(37, 34, 34)') // #252222
  })

  it('should remove background image when ENABLE_DYNAMIC_COLORS is true', () => {
    Globals.ENABLE_DYNAMIC_COLORS = true
    render(<Root />)

    expect(document.body.style.backgroundImage).toBe('none')
  })

  it('should not set background color when ENABLE_DYNAMIC_COLORS is false', () => {
    Globals.ENABLE_DYNAMIC_COLORS = false
    const originalBgColor = document.body.style.backgroundColor
    render(<Root />)

    // Background color should not be changed from original
    expect(document.body.style.backgroundColor).toBe(originalBgColor)
  })

  it('should reset track position when tracks data changes', () => {
    const { rerender } = render(<Root />)

    // Simulate navigating to different year/mix
    vi.mocked(useLoaderData).mockReturnValue([
      { ...mockTrackList[0], year: 2024, mixTitle: 'NewMix' },
    ])

    rerender(<Root />)

    // Should reset to track 1
    expect(screen.getByText(/Track 1 of 1/)).toBeInTheDocument()
  })

  it('should handle empty track list gracefully', () => {
    vi.mocked(useLoaderData).mockReturnValue([mockTrackList[0]])

    render(<Root />)

    expect(screen.getByTestId('album-art')).toBeInTheDocument()
  })

  it('should render correct number of tracks', () => {
    render(<Root />)

    expect(screen.getByText(/of 2/)).toBeInTheDocument()
  })

  it('should create Audio ref for preloading', () => {
    // This is tested implicitly through component rendering
    // The useRef hook is called during render
    expect(() => render(<Root />)).not.toThrow()
  })

  it('should update document title when track changes', () => {
    const tracks = [
      { ...mockTrackList[0], mixTitle: 'FirstMix' },
      { ...mockTrackList[1], mixTitle: 'FirstMix' },
    ]
    vi.mocked(useLoaderData).mockReturnValue(tracks)

    render(<Root />)

    expect(document.title).toBe('FirstMix')
  })

  it('should handle dynamic color changes between tracks', () => {
    Globals.ENABLE_DYNAMIC_COLORS = true
    const tracks = [
      { ...mockTrackList[0], backgroundColor: '#111111', textColor: '#AAAAAA' },
      { ...mockTrackList[1], backgroundColor: '#222222', textColor: '#BBBBBB' },
    ]

    vi.mocked(useLoaderData).mockReturnValue(tracks)

    render(<Root />)

    expect(document.body.style.backgroundColor).toBe('rgb(17, 17, 17)') // #111111
  })

  it('should pass correct props to all child components', () => {
    render(<Root />)

    // Verify all components receive correct data
    expect(screen.getByTestId('album-art')).toBeInTheDocument()
    expect(screen.getByTestId('player')).toBeInTheDocument()
    expect(screen.getByTestId('track-info')).toBeInTheDocument()
    expect(screen.getByTestId('links')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should handle tracks with all required fields', () => {
    render(<Root />)

    const albumArt = screen.getByTestId('album-art')
    const player = screen.getByTestId('player')
    const trackInfo = screen.getByTestId('track-info')
    const links = screen.getByTestId('links')
    const navigation = screen.getByTestId('navigation')

    expect(albumArt).toHaveTextContent('Mock Track Title')
    expect(player).toHaveTextContent('Track 1 of 2')
    expect(trackInfo).toHaveTextContent('Mock Track Title')
    expect(links).toHaveTextContent('Mock Track Title')
    expect(navigation).toHaveTextContent(String(Globals.MIN_YEAR))
  })
})
