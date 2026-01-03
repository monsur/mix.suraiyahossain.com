import { describe, it, expect, beforeEach } from 'vitest'
import UrlHelper from './UrlHelper'
import Globals from './Globals'

describe('UrlHelper', () => {
  let urlHelper: UrlHelper

  beforeEach(() => {
    urlHelper = new UrlHelper(2025)
    Globals.TEST_AUDIO = false
  })

  describe('constructor', () => {
    it('should initialize with year', () => {
      expect(urlHelper.year).toBe(2025)
      expect(urlHelper.mixTitle).toBe('')
    })
  })

  describe('setData', () => {
    it('should update year and mixTitle', () => {
      urlHelper.setData({ year: 2024, mixTitle: 'TestMix' })
      expect(urlHelper.year).toBe(2024)
      expect(urlHelper.mixTitle).toBe('TestMix')
    })
  })

  describe('getPathPrefix', () => {
    it('should return correct path prefix', () => {
      expect(urlHelper.getPathPrefix()).toBe('/years/2025')
    })

    it('should work with different years', () => {
      urlHelper = new UrlHelper(2010)
      expect(urlHelper.getPathPrefix()).toBe('/years/2010')
    })
  })

  describe('getS3Prefix', () => {
    it('should return correct S3 prefix', () => {
      expect(urlHelper.getS3Prefix()).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025'
      )
    })

    it('should work with different years', () => {
      urlHelper = new UrlHelper(2015)
      expect(urlHelper.getS3Prefix()).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2015'
      )
    })
  })

  describe('getDataFileUrl', () => {
    it('should return correct data file URL', () => {
      expect(urlHelper.getDataFileUrl()).toBe('/years/2025/data.json')
    })
  })

  describe('getFrontAlbumArtUrl', () => {
    it('should return correct front album art URL', () => {
      expect(urlHelper.getFrontAlbumArtUrl()).toBe('/years/2025/front.jpg')
    })
  })

  describe('getBackAlbumArtUrl', () => {
    it('should return correct back album art URL', () => {
      expect(urlHelper.getBackAlbumArtUrl()).toBe('/years/2025/back.jpg')
    })
  })

  describe('getDownloadUrl', () => {
    it('should return correct download URL', () => {
      urlHelper.setData({ year: 2025, mixTitle: 'TwentyTwentyFive' })
      expect(urlHelper.getDownloadUrl()).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/TwentyTwentyFive.zip'
      )
    })

    it('should work with different mix titles', () => {
      urlHelper.setData({ year: 2024, mixTitle: 'SpecialMix' })
      expect(urlHelper.getDownloadUrl()).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2024/SpecialMix.zip'
      )
    })
  })

  describe('getTrackUrl', () => {
    it('should return correct track URL', () => {
      const src = '01-Artist-Title.mp3'
      expect(urlHelper.getTrackUrl(src)).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/tracks/01-Artist-Title.mp3'
      )
    })

    it('should return test track when TEST_AUDIO is enabled', () => {
      Globals.TEST_AUDIO = true
      const src = '01-Artist-Title.mp3'
      expect(urlHelper.getTrackUrl(src)).toBe('testtrack.mp3')
    })

    it('should work with different track sources', () => {
      expect(urlHelper.getTrackUrl('05-SpecialTrack.mp3')).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/2025/tracks/05-SpecialTrack.mp3'
      )
    })
  })

  describe('static constants', () => {
    it('should have correct S3 prefix constant', () => {
      expect(UrlHelper.S3_PREFIX).toBe(
        'https://s3.amazonaws.com/mix.suraiyahossain.com/'
      )
    })

    it('should have correct image file constants', () => {
      expect(UrlHelper.FRONT_IMG).toBe('front.jpg')
      expect(UrlHelper.BACK_IMG).toBe('back.jpg')
    })
  })
})
