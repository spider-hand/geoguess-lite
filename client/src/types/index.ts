export type GameModeType = 'single-player' | 'multiplayer' | 'daily-challenge'

export interface LatLng {
  lat: number
  lng: number
}

export interface PlayerMarker {
  lat: number
  lng: number
  avatarEmoji: string
  avatarBg: string
  id: string
}

export interface RoundRecord {
  round: number
  score: number
  distance: number
  correctLocation: LatLng
  playerLocations: PlayerMarker[]
  mapCenter: [number, number]
  mapZoom: number
  imageId: string
}

export interface GameConfigNode {
  mapType: string
  timeLimit: number
  allowMoving: boolean
  allowZooming: boolean
  onlyPanorama: boolean
}

export interface PlayerNode {
  id: string
  name: string
  avatarEmoji: string
  avatarBg: string
  isHost: boolean
  isConnected: boolean
  loadedRound: number
}

export interface RoundNode {
  imageId: string
  guesses: Record<string, GuessNode>
}

export interface GuessNode {
  lat: number
  lng: number
  score: number
  distance: number
}

export interface RoundStateNode {
  hasEveryoneLoaded: boolean // flag to notify when all players have loaded the round to proceed to starting the round
  hasEveryoneGuessed: boolean // flag to notify when all players have made their guesses to proceed to showing results
}

export type RoomStatus = 'waiting' | 'loading' | 'loaded' | 'playing' | 'finished' | 'error'

export interface RoomNode {
  id: string
  config: GameConfigNode
  players: Record<string, PlayerNode>
  rounds?: Record<string, RoundNode>
  createdAt: number
  currentRound: number
  roundState?: Record<string, RoundStateNode>
  status: RoomStatus
}

export interface MultiplayerRoundRecord {
  round: number
  playerLocations: PlayerMarker[]
  correctLocation: LatLng
  mapCenter: [number, number]
  mapZoom: number
  imageId: string
  playerResults: {
    id: string
    name: string
    emoji: string
    avatarClass: string
    score: number
    distance: number
  }[]
}

export type PlayerResultStatus = 'Guessing' | 'Guessed'

export interface PlayerResult {
  id: string
  name: string
  emoji: string
  avatarClass: string
  score: number
  distance: number
  status: PlayerResultStatus
  isHost: boolean
}
