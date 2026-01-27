import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameModeType } from '@/types'

const useGameConfigStore = defineStore('gameConfig', () => {
  const selectedGameMode = ref<GameModeType>('single-player')
  const isHost = ref<boolean>(false)
  const roomNumber = ref<string>('')

  const mapType = ref<string>('world')
  const timeLimit = ref<number>(0)
  const onlyPanorama = ref<boolean>(true)
  const allowMoving = ref<boolean>(true)
  const allowZooming = ref<boolean>(true)

  return {
    selectedGameMode,
    isHost,
    roomNumber,
    mapType,
    timeLimit,
    onlyPanorama,
    allowMoving,
    allowZooming,
  }
})

export default useGameConfigStore
