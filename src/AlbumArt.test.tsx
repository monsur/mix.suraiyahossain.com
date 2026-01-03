import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AlbumArt from './AlbumArt'
import { mockTrackData } from './test/mocks/trackData'

// Mock child components
vi.mock('./AlbumArtSmall', () => ({
  default: ({ track, width }: any) => (
    <div data-testid="album-art-small">
      Small Album Art - Width: {width}
      <img src={track.albumArtFront} alt="small" />
    </div>
  ),
}))

vi.mock('./AlbumArtLarge', () => ({
  default: ({ track, width }: any) => (
    <div data-testid="album-art-large">
      Large Album Art - Width: {width}
      <img src={track.albumArtFront} alt="large" />
      <img src={track.albumArtBack} alt="large-back" />
    </div>
  ),
}))

describe('AlbumArt', () => {
  beforeEach(() => {
    // Reset window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('should render AlbumArtLarge when width >= 505px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    })

    render(<AlbumArt track={mockTrackData} />)

    expect(screen.getByTestId('album-art-large')).toBeInTheDocument()
    expect(screen.queryByTestId('album-art-small')).not.toBeInTheDocument()
  })

  it('should render AlbumArtSmall when width < 505px', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    })

    render(<AlbumArt track={mockTrackData} />)

    expect(screen.getByTestId('album-art-small')).toBeInTheDocument()
    expect(screen.queryByTestId('album-art-large')).not.toBeInTheDocument()
  })

  it('should render AlbumArtLarge at exactly 505px (breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 505,
    })

    render(<AlbumArt track={mockTrackData} />)

    expect(screen.getByTestId('album-art-large')).toBeInTheDocument()
    expect(screen.queryByTestId('album-art-small')).not.toBeInTheDocument()
  })

  it('should render AlbumArtSmall just below breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 504,
    })

    render(<AlbumArt track={mockTrackData} />)

    expect(screen.getByTestId('album-art-small')).toBeInTheDocument()
    expect(screen.queryByTestId('album-art-large')).not.toBeInTheDocument()
  })

  it('should pass track prop to child component', () => {
    render(<AlbumArt track={mockTrackData} />)

    const img = screen.getByAltText('large')
    expect(img).toHaveAttribute('src', mockTrackData.albumArtFront)
  })

  it('should pass width to child component', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    })

    render(<AlbumArt track={mockTrackData} />)

    expect(screen.getByText(/Width: 800/)).toBeInTheDocument()
  })

  it('should set up resize event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    render(<AlbumArt track={mockTrackData} />)

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )

    addEventListenerSpy.mockRestore()
  })
})
