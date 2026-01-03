import { vi } from 'vitest'

export const createMockAudio = () => {
  const audio = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    currentTime: 0,
    duration: 0,
    src: '',
    onended: null as (() => void) | null,
  }
  return audio
}

export const mockAudioConstructor = vi.fn(() => createMockAudio())
