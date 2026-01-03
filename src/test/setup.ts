import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Audio API
global.Audio = function() {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    load: vi.fn(),
    currentTime: 0,
    duration: 0,
    src: '',
    onended: null,
  }
} as unknown as typeof Audio

// Mock fetch for data loading tests
global.fetch = vi.fn()
