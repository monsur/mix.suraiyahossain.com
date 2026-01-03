import { describe, it, expect, beforeEach, vi } from 'vitest'
import Loader from './Loader'
import Globals from './Globals'
import { mockMixData } from './test/mocks/trackData'

describe('Loader', () => {
  let loader: Loader

  beforeEach(() => {
    loader = new Loader()
    vi.clearAllMocks()
  })

  describe('shuffleArray', () => {
    it('should preserve all elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const shuffled = Loader.shuffleArray([...arr])

      expect(shuffled.length).toBe(arr.length)
      expect(shuffled.sort()).toEqual(arr.sort())
    })

    it('should work with empty array', () => {
      const arr: number[] = []
      const shuffled = Loader.shuffleArray([...arr])

      expect(shuffled).toEqual([])
    })

    it('should work with single element', () => {
      const arr = [1]
      const shuffled = Loader.shuffleArray([...arr])

      expect(shuffled).toEqual([1])
    })

    it('should maintain array type', () => {
      const arr = ['a', 'b', 'c']
      const shuffled = Loader.shuffleArray([...arr])

      expect(shuffled.length).toBe(3)
      expect(shuffled).toContain('a')
      expect(shuffled).toContain('b')
      expect(shuffled).toContain('c')
    })
  })

  describe('loadYear', () => {
    it('should fetch and transform track data', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      const result = await loader.loadYear(2025)

      expect(mockFetch).toHaveBeenCalledWith('/years/2025/data.json')
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        title: 'Mock Track Title',
        artist: 'Mock Artist',
        src: '01-Artist-Title.mp3',
        year: 2025,
        mixTitle: 'MockMix',
        backgroundColor: '#252222',
        textColor: '#DADDDD',
      })
      expect(result[0].url).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/tracks/01-Artist-Title.mp3'
      )
      expect(result[0].albumArtFront).toBe('/years/2025/front.jpg')
      expect(result[0].albumArtBack).toBe('/years/2025/back.jpg')
      expect(result[0].downloadUrl).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/MockMix.zip'
      )
    })

    it('should cache data after first load', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      // First load
      const result1 = await loader.loadYear(2025)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Second load should use cache
      const result2 = loader.loadYear(2025)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result2).toBe(result1)
    })

    it('should add track URL to each track', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      const result = await loader.loadYear(2025)

      result.forEach((track) => {
        expect(track.url).toContain('/tracks/')
        expect(track.url).toContain('.mp3')
      })
    })

    it('should handle different years', async () => {
      const mockData2010 = {
        ...mockMixData,
        year: 2010,
        mixTitle: 'TwentyTen',
      }

      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockData2010),
      })
      global.fetch = mockFetch

      const result = await loader.loadYear(2010)

      expect(mockFetch).toHaveBeenCalledWith('/years/2010/data.json')
      expect(result[0].year).toBe(2010)
      expect(result[0].mixTitle).toBe('TwentyTen')
    })
  })

  describe('loadAll', () => {
    it('should load all years from MIN_YEAR to MAX_YEAR', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      // Mock to prevent too many fetch calls in test
      const originalMinYear = Globals.MIN_YEAR
      const originalMaxYear = Globals.MAX_YEAR
      Globals.MIN_YEAR = 2023
      Globals.MAX_YEAR = 2025

      await loader.loadAll(false)

      expect(mockFetch).toHaveBeenCalledTimes(3) // 2023, 2024, 2025

      // Restore original values
      Globals.MIN_YEAR = originalMinYear
      Globals.MAX_YEAR = originalMaxYear
    })

    it('should return all tracks without shuffle when shuffle is false', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      const originalMinYear = Globals.MIN_YEAR
      const originalMaxYear = Globals.MAX_YEAR
      Globals.MIN_YEAR = 2024
      Globals.MAX_YEAR = 2025

      const result = await loader.loadAll(false) as any[]

      // Should have tracks from 2 years, 2 tracks each = 4 total
      expect(result.length).toBe(4)

      Globals.MIN_YEAR = originalMinYear
      Globals.MAX_YEAR = originalMaxYear
    })

    it('should shuffle tracks when shuffle is true', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      const originalMinYear = Globals.MIN_YEAR
      const originalMaxYear = Globals.MAX_YEAR
      Globals.MIN_YEAR = 2024
      Globals.MAX_YEAR = 2025

      // Mock Math.random to ensure shuffle happens
      const originalRandom = Math.random
      let callCount = 0
      Math.random = () => {
        callCount++
        return callCount % 2 === 0 ? 0.3 : 0.7
      }

      const result = await loader.loadAll(true) as any[]

      // Should still have all tracks
      expect(result.length).toBe(4)

      Math.random = originalRandom
      Globals.MIN_YEAR = originalMinYear
      Globals.MAX_YEAR = originalMaxYear
    })

    it('should flatten arrays from multiple years', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockMixData),
      })
      global.fetch = mockFetch

      const originalMinYear = Globals.MIN_YEAR
      const originalMaxYear = Globals.MAX_YEAR
      Globals.MIN_YEAR = 2024
      Globals.MAX_YEAR = 2024

      const result = await loader.loadAll(false) as any[]

      // Check that result is a flat array, not nested
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('artist')

      Globals.MIN_YEAR = originalMinYear
      Globals.MAX_YEAR = originalMaxYear
    })
  })

  describe('caching behavior', () => {
    it('should maintain separate caches for different years', async () => {
      const mockData2024 = {
        ...mockMixData,
        year: 2024,
        mixTitle: 'TwentyTwentyFour',
      }
      const mockData2025 = {
        ...mockMixData,
        year: 2025,
        mixTitle: 'TwentyTwentyFive',
      }

      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockData2024),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockData2025),
        })
      global.fetch = mockFetch

      const result2024 = await loader.loadYear(2024)
      const result2025 = await loader.loadYear(2025)

      expect(result2024[0].year).toBe(2024)
      expect(result2025[0].year).toBe(2025)
      expect(mockFetch).toHaveBeenCalledTimes(2)

      // Load again - should use cache
      loader.loadYear(2024)
      loader.loadYear(2025)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })
})
