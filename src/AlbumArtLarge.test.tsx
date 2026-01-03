import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AlbumArtLarge from './AlbumArtLarge'
import { mockTrackData } from './test/mocks/trackData'

describe('AlbumArtLarge', () => {
  it('should render both front and back album art', () => {
    render(<AlbumArtLarge track={mockTrackData} width={800} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)

    const backImg = screen.getByAltText('album art back')
    const frontImg = screen.getByAltText('album art front')

    expect(backImg).toBeInTheDocument()
    expect(frontImg).toBeInTheDocument()
  })

  it('should display back image first, then front image', () => {
    render(<AlbumArtLarge track={mockTrackData} width={800} />)

    const backImg = screen.getByAltText('album art back')
    const frontImg = screen.getByAltText('album art front')

    expect(backImg).toHaveAttribute('src', mockTrackData.albumArtBack)
    expect(frontImg).toHaveAttribute('src', mockTrackData.albumArtFront)
  })

  it('should calculate image width correctly for standard width', () => {
    render(<AlbumArtLarge track={mockTrackData} width={800} />)

    const images = screen.getAllByRole('img')
    // (800 - 20) / 2 = 390
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '390')
    })
  })

  it('should cap image width at 900px total width', () => {
    render(<AlbumArtLarge track={mockTrackData} width={1200} />)

    const images = screen.getAllByRole('img')
    // (900 - 20) / 2 = 440 (capped at 900)
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '440')
    })
  })

  it('should handle minimum width correctly', () => {
    render(<AlbumArtLarge track={mockTrackData} width={505} />)

    const images = screen.getAllByRole('img')
    // (505 - 20) / 2 = 242.5
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '242.5')
    })
  })

  it('should apply margin to back image', () => {
    render(<AlbumArtLarge track={mockTrackData} width={800} />)

    const backImg = screen.getByAltText('album art back')
    expect(backImg).toHaveStyle({ marginRight: '20px' })
  })

  it('should not apply margin to front image', () => {
    render(<AlbumArtLarge track={mockTrackData} width={800} />)

    const frontImg = screen.getByAltText('album art front')
    expect(frontImg).not.toHaveStyle({ marginRight: '20px' })
  })

  it('should work with different track data', () => {
    const customTrack = {
      ...mockTrackData,
      albumArtFront: '/custom/front.jpg',
      albumArtBack: '/custom/back.jpg',
    }

    render(<AlbumArtLarge track={customTrack} width={800} />)

    const backImg = screen.getByAltText('album art back')
    const frontImg = screen.getByAltText('album art front')

    expect(backImg).toHaveAttribute('src', '/custom/back.jpg')
    expect(frontImg).toHaveAttribute('src', '/custom/front.jpg')
  })

  it('should update width when prop changes', () => {
    const { rerender } = render(
      <AlbumArtLarge track={mockTrackData} width={600} />
    )

    let images = screen.getAllByRole('img')
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '290') // (600 - 20) / 2
    })

    rerender(<AlbumArtLarge track={mockTrackData} width={800} />)

    images = screen.getAllByRole('img')
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '390') // (800 - 20) / 2
    })
  })

  it('should handle edge case at max width boundary', () => {
    render(<AlbumArtLarge track={mockTrackData} width={900} />)

    const images = screen.getAllByRole('img')
    // (900 - 20) / 2 = 440 (exactly at cap)
    images.forEach((img) => {
      expect(img).toHaveAttribute('width', '440')
    })
  })
})
