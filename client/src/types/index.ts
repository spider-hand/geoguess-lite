export type GameModeType = 'single-player' | 'multiplayer' | 'daily-challenge'

export interface RoundRecord {
  round: number
  score: number
  distance: number
  correctLocation: { lat: number; lng: number }
  playerLocation: { lat: number; lng: number } | null
  mapCenter: [number, number]
  mapZoom: number
  imageId: string
}

export interface GameConfigNode {
  mapType: string
  timeLimit: number
  allowMoving: boolean
  allowZooming: boolean
}

export interface PlayerNode {
  id: string
  name: string
  avatarEmoji: string
  avatarBg: string
  isHost: boolean
}

export type RoomStatus = 'waiting' | 'playing' | 'finished'

export interface RoomNode {
  id: string
  config: GameConfigNode
  players: Record<string, PlayerNode>
  rounds?: Record<string, unknown>
  createdAt: number
  status: RoomStatus
}
