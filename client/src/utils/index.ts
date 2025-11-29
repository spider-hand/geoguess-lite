import {
  AVATAR_CLASS_MAP,
  DEFAULT_WORLD_SCALE,
  EARTH_RADIUS_KM,
  MAX_SCORE,
  PERFECT_SCORE_THRESHOLD_KM,
} from '@/consts'

export const getAvatarClass = (avatarBg?: string) => {
  return avatarBg ? (AVATAR_CLASS_MAP[avatarBg] ?? '') : ''
}

export const calculateDistance = (
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number },
): number => {
  const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180
  const dLon = ((pos2.lng - pos1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.lat * Math.PI) / 180) *
      Math.cos((pos2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = EARTH_RADIUS_KM * c
  return Math.round(d * 100) / 100
}

// The "Map Scale" is essentially the distance (in km) at which the score would drop significantly.
// For the global "World" map, this is approximately 14,917 km (half the earth's circumferenceish/diagonal).
// For smaller country maps (e.g., UK, USA), this number is smaller, punishing distance more harshly.
export const calculateScore = (distanceKm: number, scale: number = DEFAULT_WORLD_SCALE): number => {
  if (distanceKm <= PERFECT_SCORE_THRESHOLD_KM) {
    return MAX_SCORE
  }
  // The simplified formula derived from community reverse engineering:
  // Score = 5000 * e^(-10 * distance / scale)
  const score = MAX_SCORE * Math.exp(-(10 * distanceKm) / scale)

  return Math.round(score)
}
