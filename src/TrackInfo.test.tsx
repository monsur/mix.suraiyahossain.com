import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TrackInfo from './TrackInfo'
import { mockTrackData, mockTrackData2 } from './test/mocks/trackData'

describe('TrackInfo', () => {
  it('should render current track title', () => {
    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    expect(screen.getByText(mockTrackData.title)).toBeInTheDocument()
  })

  it('should render current track artist', () => {
    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    expect(screen.getByText(mockTrackData.artist)).toBeInTheDocument()
  })

  it('should render next track details when nextTrack is provided', () => {
    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={mockTrackData2}
      />
    )

    const expectedText = `Next: ${mockTrackData2.title} - ${mockTrackData2.artist}`
    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })

  it('should not render next track details when nextTrack is null', () => {
    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument()
  })

  it('should apply text color to title', () => {
    const testColor = '#FF0000'
    const { container } = render(
      <TrackInfo
        textColor={testColor}
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    const titleElement = container.querySelector('.TrackInfoTitle')
    expect(titleElement).toHaveStyle({ color: testColor })
  })

  it('should apply text color to artist', () => {
    const testColor = '#00FF00'
    const { container } = render(
      <TrackInfo
        textColor={testColor}
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    const artistElement = container.querySelector('.TrackInfoArtist')
    expect(artistElement).toHaveStyle({ color: testColor })
  })

  it('should apply text color to next track details', () => {
    const testColor = '#0000FF'
    const { container } = render(
      <TrackInfo
        textColor={testColor}
        currentTrack={mockTrackData}
        nextTrack={mockTrackData2}
      />
    )

    const detailsElement = container.querySelector('.TrackInfoDetails')
    expect(detailsElement).toHaveStyle({ color: testColor })
  })

  it('should render with correct CSS classes', () => {
    const { container } = render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={mockTrackData2}
      />
    )

    expect(container.querySelector('.TrackInfo')).toBeInTheDocument()
    expect(container.querySelector('.TrackInfoTitle')).toBeInTheDocument()
    expect(container.querySelector('.TrackInfoArtist')).toBeInTheDocument()
    expect(container.querySelector('.TrackInfoDetails')).toBeInTheDocument()
  })

  it('should update when current track changes', () => {
    const { rerender } = render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    expect(screen.getByText(mockTrackData.title)).toBeInTheDocument()

    rerender(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData2}
        nextTrack={null}
      />
    )

    expect(screen.getByText(mockTrackData2.title)).toBeInTheDocument()
    expect(screen.queryByText(mockTrackData.title)).not.toBeInTheDocument()
  })

  it('should update when next track changes', () => {
    const { rerender } = render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={mockTrackData2}
      />
    )

    expect(
      screen.getByText(`Next: ${mockTrackData2.title} - ${mockTrackData2.artist}`)
    ).toBeInTheDocument()

    rerender(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument()
  })

  it('should handle tracks with special characters in title', () => {
    const specialTrack = {
      ...mockTrackData,
      title: "Rock & Roll (It's Gonna Be Alright)",
      artist: 'The Band & Friends',
    }

    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={specialTrack}
        nextTrack={null}
      />
    )

    expect(
      screen.getByText("Rock & Roll (It's Gonna Be Alright)")
    ).toBeInTheDocument()
    expect(screen.getByText('The Band & Friends')).toBeInTheDocument()
  })

  it('should handle long track and artist names', () => {
    const longTrack = {
      ...mockTrackData,
      title: 'This is a Very Long Track Title That Should Still Display Correctly',
      artist: 'An Artist With a Very Long Name Including Multiple Words',
    }

    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={longTrack}
        nextTrack={null}
      />
    )

    expect(
      screen.getByText(
        'This is a Very Long Track Title That Should Still Display Correctly'
      )
    ).toBeInTheDocument()
  })

  it('should format next track text correctly', () => {
    const nextTrack = {
      ...mockTrackData,
      title: 'Next Song',
      artist: 'Next Artist',
    }

    render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={nextTrack}
      />
    )

    // Verify exact formatting with "Next: title - artist"
    expect(screen.getByText('Next: Next Song - Next Artist')).toBeInTheDocument()
  })

  it('should render empty details when nextTrack is null', () => {
    const { container } = render(
      <TrackInfo
        textColor="#FFFFFF"
        currentTrack={mockTrackData}
        nextTrack={null}
      />
    )

    const detailsElement = container.querySelector('.TrackInfoDetails')
    expect(detailsElement?.textContent).toBe('')
  })
})
