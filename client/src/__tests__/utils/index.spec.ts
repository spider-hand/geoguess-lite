import { describe, it, expect } from 'vitest'
import {
  getAvatarClass,
  convertDistance,
  formatDistance,
  calculateDistance,
  calculateScore,
  calculateCenter,
  calculateZoomLevel,
} from '@/utils'

describe('utils', () => {
  it('should return avatar class for valid color', () => {
    expect(getAvatarClass('red')).toBe('bg-red-100 border-red-200')
    expect(getAvatarClass('blue')).toBe('bg-blue-100 border-blue-200')
  })

  it('should return empty string for invalid or undefined avatar color', () => {
    expect(getAvatarClass('invalid')).toBe('')
    expect(getAvatarClass(undefined)).toBe('')
  })

  it('should convert km to miles when unit is mile', () => {
    const result = convertDistance(100, 'mile')
    expect(result.unit).toBe('mi')
    expect(result.value).toBeCloseTo(62.14, 1)
  })

  it('should keep km when unit is km', () => {
    const result = convertDistance(100, 'km')
    expect(result.unit).toBe('km')
    expect(result.value).toBe(100)
  })

  it('should format distance with correct unit suffix', () => {
    expect(formatDistance(100, 'km')).toBe('100km')
    expect(formatDistance(100, 'mile')).toMatch(/mi$/)
  })

  it('should calculate distance between two points using Haversine formula', () => {
    // Tokyo to Osaka is approximately 400km
    const tokyo = { lat: 35.6762, lng: 139.6503 }
    const osaka = { lat: 34.6937, lng: 135.5023 }
    const distance = calculateDistance(tokyo, osaka)
    expect(distance).toBeGreaterThan(380)
    expect(distance).toBeLessThan(420)
  })

  it('should return 0 distance for same location', () => {
    const pos = { lat: 35.6762, lng: 139.6503 }
    expect(calculateDistance(pos, pos)).toBe(0)
  })

  it('should return max score for perfect guess within threshold', () => {
    expect(calculateScore(0)).toBe(5000)
    expect(calculateScore(0.02)).toBe(5000) // Within 25m threshold
  })

  it('should return lower score for larger distances', () => {
    const scoreWithGoodGuess = calculateScore(100)
    const scoreWithBadGuess = calculateScore(1000)
    expect(scoreWithGoodGuess).toBeGreaterThan(scoreWithBadGuess)
    expect(scoreWithBadGuess).toBeGreaterThan(0)
  })

  it('should calculate center point between two coordinates', () => {
    const [centerLng, centerLat] = calculateCenter([0, 0], [10, 10])
    expect(centerLng).toBe(5)
    expect(centerLat).toBe(5)
  })

  it('should return higher zoom level for shorter distances', () => {
    expect(calculateZoomLevel(0.5)).toBe(15) // < 1km
    expect(calculateZoomLevel(5)).toBe(12) // < 10km
    expect(calculateZoomLevel(30)).toBe(9) // < 50km
    expect(calculateZoomLevel(100)).toBe(7) // < 200km
    expect(calculateZoomLevel(500)).toBe(5) // < 1000km
    expect(calculateZoomLevel(3000)).toBe(2) // < 5000km
    expect(calculateZoomLevel(10000)).toBe(1) // >= 5000km
  })
})
