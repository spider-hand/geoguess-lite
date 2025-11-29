import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameModeType } from '@/types'

const useGameConfigStore = defineStore('gameConfig', () => {
  const selectedGameMode = ref<GameModeType>('single-player')
  const isHost = ref<boolean>(false)
  const roomNumber = ref<string>('')

  const mapType = ref<string>('world')
  const rounds = ref<number>(5)
  const timeLimit = ref<number>(0)
  const allowMoving = ref<boolean>(true)
  const allowZooming = ref<boolean>(true)

  return {
    selectedGameMode,
    isHost,
    roomNumber,
    mapType,
    rounds,
    timeLimit,
    allowMoving,
    allowZooming,
  }
})

export default useGameConfigStore
