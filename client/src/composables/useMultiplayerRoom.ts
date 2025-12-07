import { ref, onUnmounted, computed } from 'vue'
import {
  ref as dbRef,
  set,
  get,
  onValue,
  off,
  onDisconnect,
  type DataSnapshot,
} from 'firebase/database'
import { db } from '@/lib/firebase'
import type {
  GameConfigNode,
  PlayerNode,
  PlayerResult,
  PlayerResultStatus,
  RoomNode,
} from '@/types'
import { AVATAR_CLASS_MAP, ROUNDS } from '@/consts'

export const useMultiplayerRoom = () => {
  const currentRoom = ref<RoomNode | null>(null)
  const isLoadingRoom = ref(false)
  const error = ref<string | null>(null)

  const isWaiting = computed(() => currentRoom.value?.status === 'waiting')

  const isLoading = computed(() => currentRoom.value?.status === 'loading')

  const isLoaded = computed(() => currentRoom.value?.status === 'loaded')

  const isPlaying = computed(() => currentRoom.value?.status === 'playing')

  const isFinished = computed(() => currentRoom.value?.status === 'finished')

  const currentRound = computed(() => currentRoom.value?.currentRound ?? 1)

  const currentRoundImageId = ref<string | null>(null)

  const updateCurrentRoundImageId = () => {
    const rounds = currentRoom.value?.rounds
    const currentRoundNum = currentRound.value
    if (rounds && rounds[currentRoundNum]) {
      currentRoundImageId.value = rounds[currentRoundNum].imageId
    } else {
      currentRoundImageId.value = null
    }
  }

  const hasEveryoneLoaded = computed(() => {
    const roundState = currentRoom.value?.roundState
    const currentRoundNum = currentRound.value
    if (roundState && roundState[currentRoundNum]) {
      return roundState[currentRoundNum].hasEveryoneLoaded
    }
    return false
  })

  const hasEveryoneGuessed = computed(() => {
    const roundState = currentRoom.value?.roundState
    const currentRoundNum = currentRound.value
    if (roundState && roundState[currentRoundNum]) {
      return roundState[currentRoundNum].hasEveryoneGuessed
    }
    return false
  })

  const gameConfig = computed<GameConfigNode>(() => {
    if (!currentRoom.value?.config) {
      return {
        mapType: 'World',
        timeLimit: 60,
        allowMoving: true,
        allowZooming: true,
      }
    }

    return {
      mapType: currentRoom.value.config.mapType,
      timeLimit: currentRoom.value.config.timeLimit,
      allowMoving: currentRoom.value.config.allowMoving,
      allowZooming: currentRoom.value.config.allowZooming,
    }
  })

  const players = computed<PlayerResult[]>(() => {
    if (!currentRoom.value?.players) return []

    const rounds = currentRoom.value.rounds || {}
    const currentRoundNum = currentRound.value
    const everyoneGuessed = hasEveryoneGuessed.value

    return Object.values(currentRoom.value.players).map((player) => {
      let totalScore = 0
      let totalDistance = 0

      // Always include completed rounds
      for (let roundNum = 1; roundNum < currentRoundNum; roundNum++) {
        const round = rounds[roundNum]
        if (round?.guesses?.[player.id]) {
          const guess = round.guesses[player.id]
          if (guess && guess.score > 0) {
            totalScore += guess.score
          }
          if (guess && guess.distance >= 0) {
            totalDistance += guess.distance
          }
        }
      }

      // Only include current round score if everyone has guessed to show the updated values when the round is complete
      if (everyoneGuessed && currentRoundNum > 0 && rounds[currentRoundNum]?.guesses?.[player.id]) {
        const currentGuess = rounds[currentRoundNum].guesses[player.id]
        if (currentGuess && currentGuess.score > 0) {
          totalScore += currentGuess.score
        }
        if (currentGuess && currentGuess.distance >= 0) {
          totalDistance += currentGuess.distance
        }
      }

      let status: PlayerResultStatus = 'Guessing'
      if (currentRoundNum > 0 && rounds[currentRoundNum]?.guesses?.[player.id]) {
        status = 'Guessed'
      }

      return {
        id: player.id,
        name: player.name,
        emoji: player.avatarEmoji,
        avatarClass: AVATAR_CLASS_MAP[player.avatarBg] || 'bg-gray-100 border-gray-200',
        score: totalScore,
        distance: totalDistance,
        status: status,
        isHost: player.isHost,
      }
    })
  })

  const roundsGenerated = computed(() => {
    if (!currentRoom.value?.rounds) return 0
    return Object.keys(currentRoom.value.rounds).length
  })

  const progressPercentage = computed(() => {
    return Math.min((roundsGenerated.value / ROUNDS) * 100, 100)
  })

  let roomListener: ((snapshot: DataSnapshot) => void) | null = null
  let roomRef: ReturnType<typeof dbRef> | null = null

  const generateRoomId = (): string => {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  }

  const createRoom = async (hostPlayer: PlayerNode, config: GameConfigNode): Promise<string> => {
    isLoadingRoom.value = true
    error.value = null

    try {
      const roomId = generateRoomId()
      const newRoomRef = dbRef(db, `rooms/${roomId}`)

      const roomData: RoomNode = {
        id: roomId,
        config,
        players: {
          [hostPlayer.id]: { ...hostPlayer, isHost: true },
        },
        createdAt: Date.now(),
        status: 'waiting',
        currentRound: 0,
      }

      await set(newRoomRef, roomData)
      currentRoom.value = roomData

      // Set up disconnect handler for host player
      const playersRef = dbRef(db, `rooms/${roomId}/players/${hostPlayer.id}`)
      const playerDisconnectRef = onDisconnect(playersRef)
      await playerDisconnectRef.update({ isConnected: false })

      // Listen for room updates
      roomRef = newRoomRef
      roomListener = onValue(newRoomRef, (snapshot) => {
        if (snapshot.exists()) {
          currentRoom.value = snapshot.val()
        }
      })

      return roomId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create room'
      throw err
    } finally {
      isLoadingRoom.value = false
    }
  }

  const joinRoom = async (roomId: string, player: PlayerNode): Promise<void> => {
    isLoadingRoom.value = true
    error.value = null

    try {
      const targetRoomRef = dbRef(db, `rooms/${roomId}`)
      const snapshot = await get(targetRoomRef)

      if (!snapshot.exists()) {
        throw new Error('Room not found')
      }

      const room = snapshot.val() as RoomNode

      if (room.status !== 'waiting') {
        throw new Error('Room is not available for joining')
      }

      // Add player to room
      const playersRef = dbRef(db, `rooms/${roomId}/players/${player.id}`)
      await set(playersRef, { ...player, isHost: false })

      // Set up disconnect handler
      const playerDisconnectRef = onDisconnect(playersRef)
      await playerDisconnectRef.update({ isConnected: false })

      currentRoom.value = room

      // Listen for room updates
      roomRef = targetRoomRef
      roomListener = onValue(targetRoomRef, (snapshot) => {
        if (snapshot.exists()) {
          currentRoom.value = snapshot.val()
        }
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to join room'
      throw err
    } finally {
      isLoadingRoom.value = false
    }
  }

  const leaveRoom = async (playerId: string): Promise<void> => {
    if (!currentRoom.value) return

    try {
      const roomId = currentRoom.value.id
      const targetRoomRef = dbRef(db, `rooms/${roomId}`)
      const snapshot = await get(targetRoomRef)

      if (!snapshot.exists()) return

      const room = snapshot.val() as RoomNode
      const players = room.players || {}
      const playerIds = Object.keys(players)

      if (playerIds.length <= 1) {
        await set(targetRoomRef, null)
      } else {
        const playerRef = dbRef(db, `rooms/${roomId}/players/${playerId}`)
        await set(playerRef, null)

        const leavingPlayer = players[playerId]
        if (leavingPlayer?.isHost) {
          const remainingPlayerIds = playerIds.filter((id) => id !== playerId)
          if (remainingPlayerIds.length > 0) {
            const newHostId = remainingPlayerIds[0]
            const newHostRef = dbRef(db, `rooms/${roomId}/players/${newHostId}/isHost`)
            await set(newHostRef, true)
          }
        }
      }

      cleanup()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to leave room'
      throw err
    }
  }

  const getRoomById = async (roomId: string, userId?: string): Promise<void> => {
    isLoadingRoom.value = true
    error.value = null

    try {
      const targetRoomRef = dbRef(db, `rooms/${roomId}`)
      const snapshot = await get(targetRoomRef)

      if (!snapshot.exists()) {
        throw new Error('Room not found')
      }

      currentRoom.value = snapshot.val() as RoomNode

      if (userId && currentRoom.value?.players?.[userId]) {
        const playersRef = dbRef(db, `rooms/${roomId}/players/${userId}`)
        const playerDisconnectRef = onDisconnect(playersRef)
        await playerDisconnectRef.update({ isConnected: false })
      }

      roomRef = targetRoomRef
      roomListener = onValue(targetRoomRef, (snapshot) => {
        if (snapshot.exists()) {
          currentRoom.value = snapshot.val()
        }
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get room'
      throw err
    } finally {
      isLoadingRoom.value = false
    }
  }

  const cleanup = () => {
    if (roomListener && roomRef) {
      off(roomRef, 'value', roomListener)
      roomListener = null
      roomRef = null
    }
    currentRoom.value = null
    error.value = null
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    currentRoom,
    isLoadingRoom,
    error,
    isWaiting,
    isLoading,
    isLoaded,
    isPlaying,
    isFinished,
    currentRound,
    currentRoundImageId,
    hasEveryoneLoaded,
    hasEveryoneGuessed,
    gameConfig,
    players,
    roundsGenerated,
    progressPercentage,
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomById,
    cleanup,
    updateCurrentRoundImageId,
  }
}
