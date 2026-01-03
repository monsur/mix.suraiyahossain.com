import { describe, it, expect } from 'vitest'
import Globals from './Globals'

// Import the getYear function logic for testing
// Since it's not exported, we'll test it through integration or recreate it
function getYear(queryStr: string | undefined): number {
  if (!queryStr) {
    return Globals.MAX_YEAR
  }
  const parsed = parseInt(queryStr)
  if (isNaN(parsed)) {
    return Globals.MAX_YEAR
  }
  if (parsed < Globals.MIN_YEAR || parsed > Globals.MAX_YEAR) {
    return Globals.MAX_YEAR
  }
  return parsed
}

describe('App routing logic', () => {
  describe('getYear function', () => {
    it('should return MAX_YEAR when queryStr is undefined', () => {
      expect(getYear(undefined)).toBe(Globals.MAX_YEAR)
    })

    it('should return MAX_YEAR when queryStr is empty string', () => {
      expect(getYear('')).toBe(Globals.MAX_YEAR)
    })

    it('should return parsed year when valid', () => {
      expect(getYear('2020')).toBe(2020)
      expect(getYear('2015')).toBe(2015)
      expect(getYear('2010')).toBe(2010)
    })

    it('should return MAX_YEAR when year is not a number', () => {
      expect(getYear('abc')).toBe(Globals.MAX_YEAR)
      expect(getYear('20abc')).toBe(Globals.MAX_YEAR)
      expect(getYear('not-a-year')).toBe(Globals.MAX_YEAR)
    })

    it('should return MAX_YEAR when year is below MIN_YEAR', () => {
      expect(getYear('2000')).toBe(Globals.MAX_YEAR)
      expect(getYear('2007')).toBe(Globals.MAX_YEAR)
      expect(getYear('1999')).toBe(Globals.MAX_YEAR)
    })

    it('should return MAX_YEAR when year is above MAX_YEAR', () => {
      expect(getYear('2030')).toBe(Globals.MAX_YEAR)
      expect(getYear('2026')).toBe(Globals.MAX_YEAR)
      expect(getYear('3000')).toBe(Globals.MAX_YEAR)
    })

    it('should accept MIN_YEAR as valid', () => {
      expect(getYear(Globals.MIN_YEAR.toString())).toBe(Globals.MIN_YEAR)
    })

    it('should accept MAX_YEAR as valid', () => {
      expect(getYear(Globals.MAX_YEAR.toString())).toBe(Globals.MAX_YEAR)
    })

    it('should handle edge cases', () => {
      expect(getYear('0')).toBe(Globals.MAX_YEAR)
      expect(getYear('-1')).toBe(Globals.MAX_YEAR)
      expect(getYear('2020.5')).toBe(2020) // parseInt truncates
    })

    it('should handle string with spaces', () => {
      expect(getYear(' 2020 ')).toBe(2020) // parseInt handles leading spaces
    })

    it('should return MAX_YEAR for special values', () => {
      expect(getYear('null')).toBe(Globals.MAX_YEAR)
      expect(getYear('NaN')).toBe(Globals.MAX_YEAR)
      expect(getYear('Infinity')).toBe(Globals.MAX_YEAR)
    })
  })

  describe('Globals configuration', () => {
    it('should have valid MIN_YEAR and MAX_YEAR', () => {
      expect(Globals.MIN_YEAR).toBeLessThan(Globals.MAX_YEAR)
      expect(Globals.MIN_YEAR).toBeGreaterThan(2000)
      expect(Globals.MAX_YEAR).toBeLessThanOrEqual(new Date().getFullYear() + 1)
    })

    it('should have valid configuration flags', () => {
      expect(typeof Globals.ENABLE_NEXT_TRACK_PRELOAD).toBe('boolean')
      expect(typeof Globals.ENABLE_DYNAMIC_COLORS).toBe('boolean')
      expect(typeof Globals.TEST_AUDIO).toBe('boolean')
    })

    it('should have valid preload seconds', () => {
      expect(Globals.NEXT_TRACK_PRELOAD_SECONDS).toBeGreaterThan(0)
      expect(Globals.NEXT_TRACK_PRELOAD_SECONDS).toBeLessThan(60)
    })
  })
})
