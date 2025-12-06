import { ref, onUnmounted } from 'vue'
import {
  getDatabase,
  ref as dbRef,
  set,
  get,
  onValue,
  off,
  type DataSnapshot,
} from 'firebase/database'
import { firebaseApp } from '@/lib/firebase'
import type { GameConfigNode, PlayerNode, RoomNode } from '@/types'

const db = getDatabase(firebaseApp)

export const useMultiplayerRoom = () => {
  const currentRoom = ref<RoomNode | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  let roomListener: ((snapshot: DataSnapshot) => void) | null = null
  let roomRef: ReturnType<typeof dbRef> | null = null

  const generateRoomId = (): string => {
    return Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
  }

  const createRoom = async (hostPlayer: PlayerNode, config: GameConfigNode): Promise<string> => {
    isLoading.value = true
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
      }

      await set(newRoomRef, roomData)
      currentRoom.value = roomData

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
      isLoading.value = false
    }
  }

  const joinRoom = async (roomId: string, player: PlayerNode): Promise<void> => {
    isLoading.value = true
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
      isLoading.value = false
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

  const getRoomById = async (roomId: string): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const targetRoomRef = dbRef(db, `rooms/${roomId}`)
      const snapshot = await get(targetRoomRef)

      if (!snapshot.exists()) {
        throw new Error('Room not found')
      }

      currentRoom.value = snapshot.val() as RoomNode

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
      isLoading.value = false
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
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    getRoomById,
    cleanup,
  }
}
