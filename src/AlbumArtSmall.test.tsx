import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AlbumArtSmall from './AlbumArtSmall'
import { mockTrackData } from './test/mocks/trackData'
import Logger from './Logger'

// Mock Logger
vi.mock('./Logger', () => ({
  default: {
    log: vi.fn(),
  },
}))

describe('AlbumArtSmall', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with front album art', () => {
    render(<AlbumArtSmall track={mockTrackData} width={400} />)

    const img = screen.getByAltText('album art')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockTrackData.albumArtFront)
  })

  it('should apply correct width', () => {
    render(<AlbumArtSmall track={mockTrackData} width={350} />)

    const img = screen.getByAltText('album art')
    expect(img).toHaveAttribute('width', '350')
  })

  it('should toggle to back image when clicked', () => {
    render(<AlbumArtSmall track={mockTrackData} width={400} />)

    const img = screen.getByAltText('album art') as HTMLImageElement

    // Initial state - front image
    expect(img.src).toContain('front.jpg')

    // Click to flip to back
    fireEvent.click(img)

    expect(img.src).toContain('back.jpg')
  })

  it('should toggle back to front image when clicked again', () => {
    render(<AlbumArtSmall track={mockTrackData} width={400} />)

    const img = screen.getByAltText('album art') as HTMLImageElement

    // First click - flip to back
    fireEvent.click(img)
    expect(img.src).toContain('back.jpg')

    // Second click - flip back to front
    fireEvent.click(img)
    expect(img.src).toContain('front.jpg')
  })

  it('should log click event when image is clicked', () => {
    render(<AlbumArtSmall track={mockTrackData} width={400} />)

    const img = screen.getByAltText('album art')
    fireEvent.click(img)

    expect(Logger.log).toHaveBeenCalledWith(
      'AlbumArtSmall',
      'click',
      expect.stringContaining('back.jpg'),
      mockTrackData.year
    )
  })

  it('should work with different track data', () => {
    const customTrack = {
      ...mockTrackData,
      year: 2020,
      albumArtFront: '/years/2020/front.jpg',
      albumArtBack: '/years/2020/back.jpg',
    }

    render(<AlbumArtSmall track={customTrack} width={400} />)

    const img = screen.getByAltText('album art') as HTMLImageElement
    expect(img.src).toContain('/years/2020/front.jpg')

    fireEvent.click(img)
    expect(img.src).toContain('/years/2020/back.jpg')
  })

  it('should handle multiple width values', () => {
    const { rerender } = render(
      <AlbumArtSmall track={mockTrackData} width={300} />
    )

    let img = screen.getByAltText('album art')
    expect(img).toHaveAttribute('width', '300')

    rerender(<AlbumArtSmall track={mockTrackData} width={450} />)

    img = screen.getByAltText('album art')
    expect(img).toHaveAttribute('width', '450')
  })
})
