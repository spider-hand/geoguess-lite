export type GameModeType = 'single-player' | 'multiplayer' | 'daily-challenge'

export interface RoundRecord {
  round: number
  score: number
  distance: number
  correctLocation: { lat: number; lng: number }
  playerLocation: { lat: number; lng: number } | null
  mapCenter: [number, number]
  mapZoom: number
}
