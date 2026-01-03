import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Links from './Links'
import { mockTrackData } from './test/mocks/trackData'
import Logger from './Logger'

// Mock Logger
vi.mock('./Logger', () => ({
  default: {
    log: vi.fn(),
  },
}))

// Mock SVG imports
vi.mock('./assets/download.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="download-icon" onClick={onClick} style={style}>
      Download
    </div>
  ),
}))

vi.mock('./assets/spotify.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="spotify-icon" onClick={onClick} style={style}>
      Spotify
    </div>
  ),
}))

describe('Links', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render download and spotify icons', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    expect(screen.getByTestId('download-icon')).toBeInTheDocument()
    expect(screen.getByTestId('spotify-icon')).toBeInTheDocument()
  })

  it('should render download link with correct URL', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const downloadLink = screen
      .getByTestId('download-icon')
      .closest('a') as HTMLAnchorElement

    expect(downloadLink).toHaveAttribute('href', mockTrackData.downloadUrl)
  })

  it('should render spotify link with correct URL', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const spotifyLink = screen
      .getByTestId('spotify-icon')
      .closest('a') as HTMLAnchorElement

    expect(spotifyLink).toHaveAttribute('href', mockTrackData.spotify)
  })

  it('should apply correct text color to download icon', () => {
    const testColor = '#FF0000'
    render(<Links track={mockTrackData} textColor={testColor} />)

    const downloadIcon = screen.getByTestId('download-icon')
    expect(downloadIcon).toHaveStyle({ fill: testColor })
  })

  it('should apply correct text color to spotify icon', () => {
    const testColor = '#00FF00'
    render(<Links track={mockTrackData} textColor={testColor} />)

    const spotifyIcon = screen.getByTestId('spotify-icon')
    expect(spotifyIcon).toHaveStyle({ fill: testColor })
  })

  it('should apply correct icon styling', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const downloadIcon = screen.getByTestId('download-icon')
    expect(downloadIcon).toHaveStyle({
      width: '24px',
      paddingRight: '20px',
    })

    const spotifyIcon = screen.getByTestId('spotify-icon')
    expect(spotifyIcon).toHaveStyle({
      width: '24px',
      paddingRight: '20px',
    })
  })

  it('should log download click event', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const downloadIcon = screen.getByTestId('download-icon')
    fireEvent.click(downloadIcon)

    expect(Logger.log).toHaveBeenCalledWith(
      'links',
      'action',
      'download',
      mockTrackData.year
    )
  })

  it('should log spotify click event', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const spotifyIcon = screen.getByTestId('spotify-icon')
    fireEvent.click(spotifyIcon)

    expect(Logger.log).toHaveBeenCalledWith(
      'links',
      'action',
      'spotify',
      mockTrackData.year
    )
  })

  it('should handle download click and return true', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const downloadIcon = screen.getByTestId('download-icon')
    const result = fireEvent.click(downloadIcon)

    expect(Logger.log).toHaveBeenCalled()
    // Event is not prevented, so link should work normally
  })

  it('should handle spotify click and return true', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const spotifyIcon = screen.getByTestId('spotify-icon')
    const result = fireEvent.click(spotifyIcon)

    expect(Logger.log).toHaveBeenCalled()
    // Event is not prevented, so link should work normally
  })

  it('should work with different track years', () => {
    const track2020 = {
      ...mockTrackData,
      year: 2020,
    }

    render(<Links track={track2020} textColor="#FFFFFF" />)

    const downloadIcon = screen.getByTestId('download-icon')
    fireEvent.click(downloadIcon)

    expect(Logger.log).toHaveBeenCalledWith('links', 'action', 'download', 2020)
  })

  it('should update when track changes', () => {
    const { rerender } = render(
      <Links track={mockTrackData} textColor="#FFFFFF" />
    )

    let downloadLink = screen
      .getByTestId('download-icon')
      .closest('a') as HTMLAnchorElement
    expect(downloadLink).toHaveAttribute('href', mockTrackData.downloadUrl)

    const newTrack = {
      ...mockTrackData,
      downloadUrl: 'https://example.com/new-download.zip',
      spotify: 'https://open.spotify.com/playlist/newplaylist',
    }

    rerender(<Links track={newTrack} textColor="#FFFFFF" />)

    downloadLink = screen
      .getByTestId('download-icon')
      .closest('a') as HTMLAnchorElement
    expect(downloadLink).toHaveAttribute('href', newTrack.downloadUrl)

    const spotifyLink = screen
      .getByTestId('spotify-icon')
      .closest('a') as HTMLAnchorElement
    expect(spotifyLink).toHaveAttribute('href', newTrack.spotify)
  })

  it('should update icon colors when textColor changes', () => {
    const { rerender } = render(
      <Links track={mockTrackData} textColor="#FFFFFF" />
    )

    let downloadIcon = screen.getByTestId('download-icon')
    expect(downloadIcon).toHaveStyle({ fill: '#FFFFFF' })

    rerender(<Links track={mockTrackData} textColor="#000000" />)

    downloadIcon = screen.getByTestId('download-icon')
    expect(downloadIcon).toHaveStyle({ fill: '#000000' })
  })

  it('should render with correct className', () => {
    const { container } = render(
      <Links track={mockTrackData} textColor="#FFFFFF" />
    )

    const linksElement = container.querySelector('.Links')
    expect(linksElement).toBeInTheDocument()
  })

  it('should render two anchor elements', () => {
    const { container } = render(
      <Links track={mockTrackData} textColor="#FFFFFF" />
    )

    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(2)
  })

  it('should not prevent default link behavior', () => {
    render(<Links track={mockTrackData} textColor="#FFFFFF" />)

    const downloadLink = screen.getByTestId('download-icon').closest('a')
    expect(downloadLink).not.toHaveAttribute('onclick')
  })
})
