import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Player from './Player'
import { mockTrackList } from './test/mocks/trackData'

// Mock the Logger
vi.mock('./Logger', () => ({
  default: {
    log: vi.fn(),
  },
}))

// Mock SVG imports
vi.mock('./assets/nexttrack.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="next-icon" onClick={onClick} style={style}>
      Next
    </div>
  ),
}))

vi.mock('./assets/prevtrack.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="prev-icon" onClick={onClick} style={style}>
      Prev
    </div>
  ),
}))

vi.mock('./assets/play.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="play-icon" onClick={onClick} style={style}>
      Play
    </div>
  ),
}))

vi.mock('./assets/pause.svg?react', () => ({
  default: ({ onClick, style }: any) => (
    <div data-testid="pause-icon" onClick={onClick} style={style}>
      Pause
    </div>
  ),
}))

describe('Player', () => {
  let mockSetCurrentTrackPos: (pos: number) => void
  let mockAudio: any

  beforeEach(() => {
    mockSetCurrentTrackPos = vi.fn() as (pos: number) => void

    // Create a mock audio element
    mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      src: '',
      onended: null,
    }

    // Mock the Audio constructor with proper function syntax
    global.Audio = function() {
      return mockAudio
    } as any
  })

  it('should render player controls', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    expect(screen.getByTestId('prev-icon')).toBeInTheDocument()
    expect(screen.getByTestId('play-icon')).toBeInTheDocument()
    expect(screen.getByTestId('next-icon')).toBeInTheDocument()
  })

  it('should show play icon when not playing', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    expect(screen.getByTestId('play-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('pause-icon')).not.toBeInTheDocument()
  })

  it('should show pause icon when playing', async () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const playButton = screen.getByTestId('play-icon')
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(screen.getByTestId('pause-icon')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument()
  })

  it('should call play when play button is clicked', async () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const playButton = screen.getByTestId('play-icon')
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(mockAudio.play).toHaveBeenCalled()
    })
  })

  it('should call pause when pause button is clicked', async () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    // Start playing
    const playButton = screen.getByTestId('play-icon')
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(screen.getByTestId('pause-icon')).toBeInTheDocument()
    })

    // Now pause
    const pauseButton = screen.getByTestId('pause-icon')
    fireEvent.click(pauseButton)

    await waitFor(() => {
      expect(mockAudio.pause).toHaveBeenCalled()
    })
  })

  it('should advance to next track when next button is clicked', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const nextButton = screen.getByTestId('next-icon')
    fireEvent.click(nextButton)

    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(1)
  })

  it('should not advance past last track', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={1} // Last track
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const nextButton = screen.getByTestId('next-icon')
    fireEvent.click(nextButton)

    // Should still be called but with same position
    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(1)
  })

  it('should go to previous track when prev button is clicked', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={1}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const prevButton = screen.getByTestId('prev-icon')
    fireEvent.click(prevButton)

    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(0)
  })

  it('should reset time when prev is clicked on first track', () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    mockAudio.currentTime = 30

    const prevButton = screen.getByTestId('prev-icon')
    fireEvent.click(prevButton)

    expect(mockAudio.currentTime).toBe(0)
    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(0)
  })

  it('should update audio source when track changes', () => {
    const { rerender } = render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    expect(mockAudio.src).toBe(mockTrackList[0].url)

    rerender(
      <Player
        tracks={mockTrackList}
        currentTrackPos={1}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    expect(mockAudio.src).toBe(mockTrackList[1].url)
  })

  it('should handle play error (AbortError)', async () => {
    mockAudio.play = vi.fn().mockRejectedValue({
      name: 'AbortError',
      message: 'Aborted',
    })

    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    const playButton = screen.getByTestId('play-icon')
    fireEvent.click(playButton)

    // Should not throw error
    await waitFor(() => {
      expect(mockAudio.play).toHaveBeenCalled()
    })
  })

  it('should apply correct text color to icons', () => {
    const testColor = '#FF0000'
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor={testColor}
      />
    )

    const prevIcon = screen.getByTestId('prev-icon')
    expect(prevIcon).toHaveStyle({ fill: testColor })
  })

  it('should pause on unmount', () => {
    const { unmount } = render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    unmount()

    expect(mockAudio.pause).toHaveBeenCalled()
  })

  it('should auto-advance when track ends', async () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={0}
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    // Simulate track ending
    if (mockAudio.onended) {
      mockAudio.onended()
    }

    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(1)
  })

  it('should reset to first track and stop when last track ends', async () => {
    render(
      <Player
        tracks={mockTrackList}
        currentTrackPos={1} // Last track
        setCurrentTrackPos={mockSetCurrentTrackPos}
        textColor="#FFFFFF"
      />
    )

    // Simulate track ending
    if (mockAudio.onended) {
      mockAudio.onended()
    }

    expect(mockSetCurrentTrackPos).toHaveBeenCalledWith(0)
  })
})
