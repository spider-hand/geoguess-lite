<template>
  <div class="flex min-h-screen flex-col">
    <LobbyComponent
      v-if="isWaiting"
      :room-id="props.roomId"
      :myself="myself"
      :players="players"
      :game-config="gameConfig"
      @start-game="startGameFromLobby"
      @leave-room="handleLeaveRoom"
    />
    <template v-else>
      <HeaderComponent v-if="showSummaryView" />
      <header v-else class="flex items-center justify-between border-b px-4 py-4 sm:px-8">
        <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
          <span>Room #{{ props.roomId }} - Round {{ currentRound }} / {{ ROUNDS }}</span>
        </div>
        <nav class="flex gap-2 sm:gap-4">
          <div
            class="text-muted-foreground h-9 px-2 py-2 font-[JetBrains_Mono] text-sm sm:px-4 sm:text-lg"
          >
            [Time: {{ formattedTime }}]
          </div>
          <div
            class="text-muted-foreground h-9 px-2 py-2 font-[JetBrains_Mono] text-sm sm:px-4 sm:text-lg"
          >
            [Score: {{ totalScore }}]
          </div>
        </nav>
      </header>
      <main
        v-if="!showSummaryView"
        class="flex grow flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:flex-row"
      >
        <StreetViewComponent
          ref="streetViewRef"
          :allow-moving="gameConfig.allowMoving"
          :allow-zooming="gameConfig.allowZooming"
          :show-result="showResult"
          :result-score="score"
          :result-distance="distance"
          @image-loaded="onImageLoaded"
          @image-loading-start="onImageLoadingStart"
        />
        <div class="flex flex-col gap-4 sm:gap-6 lg:w-1/3 lg:max-w-md">
          <div
            :class="
              showPlayersList
                ? 'h-[200px] sm:h-[250px] lg:h-[300px]'
                : 'h-[300px] sm:h-[400px] lg:h-full'
            "
          >
            <MapComponent ref="mapRef" @marker-placed="onMarkerPlaced" />
          </div>
          <div class="flex gap-2">
            <Button
              v-if="!showResult"
              :disabled="!hasMarker || isLoadingImage"
              @click="makeGuess"
              class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isLoadingImage ? 'Loading...' : 'Make Guess' }}
            </Button>
            <Button
              v-else-if="currentRound < ROUNDS"
              @click="nextRound"
              class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
            >
              Next Round
            </Button>
            <Button
              v-else
              @click="showSummary"
              class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
            >
              Summary
            </Button>
            <Button
              variant="ghost"
              @click="togglePlayersList"
              class="flex-1 font-[JetBrains_Mono] text-sm"
            >
              {{ showPlayersList ? '[Hide Players]' : '[Show Players]' }}
            </Button>
          </div>
          <div v-if="showPlayersList" class="flex flex-col gap-2">
            <h3 class="font-[JetBrains_Mono] text-sm font-medium">Players</h3>
            <div class="flex flex-col gap-2">
              <div
                v-for="player in players"
                :key="player.id"
                class="flex items-center justify-between rounded border p-2"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
                    :class="player.avatarClass"
                  >
                    {{ player.emoji }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-[JetBrains_Mono] text-sm">{{ player.name }}</span>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-xs">{{
                      player.score
                    }}</span>
                  </div>
                </div>
                <span
                  class="rounded px-2 py-1 font-[JetBrains_Mono] text-xs"
                  :class="
                    player.status === 'Guessed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ player.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <GameSummaryMultiplayerComponent
        v-else
        :players="playersWithTotals"
        :game-records="multiplayerGameRecords"
        @play-again="playAgain"
        @return-to-menu="returnToMenu"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import MapComponent from '@/components/MapComponent.vue'
import StreetViewComponent from '@/components/StreetViewComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { calculateCenter, calculateDistance, calculateScore, calculateZoomLevel } from '@/utils'
import { useTimer } from '@/composables/useTimer'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import GameSummaryMultiplayerComponent from '@/components/GameSummaryMultiplayerComponent.vue'
import LobbyComponent from '@/components/LobbyComponent.vue'
import type { RoundRecord } from '@/types'
import { ROUNDS, AVATAR_CLASS_MAP } from '@/consts'
import { useMultiplayerRoom } from '@/composables/useMultiplayerRoom'
import useUserQuery from '@/composables/useUserQuery'

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
})

const {
  isExpired: isTimerExpired,
  formattedTime,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer,
} = useTimer(60)
const router = useRouter()
const { currentRoom, getRoomById, leaveRoom } = useMultiplayerRoom()
const { user } = useUserQuery()

onMounted(() => {
  if (props.roomId) {
    getRoomById(props.roomId)
  }
})

const handleLeaveRoom = async () => {
  if (!user.value) return

  try {
    await leaveRoom(user.value.id)
    router.push({ name: 'game' })
  } catch {}
}

const hasMarker = ref(false)
const showResult = ref(false)
const isLoadingImage = ref(false)
const showSummaryView = ref(true)
const showPlayersList = ref(true)
const isWaiting = ref(true)
const distance = ref(0)
const score = ref(0)
const totalScore = ref(2450)
const currentRound = ref(2)
const currentImageId = ref<string | null>(null)
const imagePosition = ref<{ lat: number; lng: number } | null>(null)
const markerPosition = ref<{ lat: number; lng: number } | null>(null)
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null)
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(null)

const gameRecords = ref<RoundRecord[]>([])

const multiplayerGameRecords = ref([
  {
    round: 1,
    playerLocation: { lat: 35.6762, lng: 139.6503 },
    correctLocation: { lat: 35.6895, lng: 139.6917 },
    mapCenter: [139.671, 35.6829] as [number, number],
    mapZoom: 10,
    imageId: 'sample-image-1',
    playerResults: [
      {
        id: '1',
        name: 'You',
        emoji: '🏆',
        avatarClass: 'bg-yellow-100 border-yellow-200',
        score: 4850,
        distance: 2.1,
      },
      {
        id: '2',
        name: 'Alice',
        emoji: '🌍',
        avatarClass: 'bg-green-100 border-green-200',
        score: 4320,
        distance: 4.8,
      },
      {
        id: '3',
        name: 'Bob',
        emoji: '🧭',
        avatarClass: 'bg-blue-100 border-blue-200',
        score: 3950,
        distance: 7.2,
      },
      {
        id: '4',
        name: 'Carol',
        emoji: '🚀',
        avatarClass: 'bg-purple-100 border-purple-200',
        score: 4650,
        distance: 3.1,
      },
    ],
  },
  {
    round: 2,
    playerLocation: { lat: 48.8566, lng: 2.3522 },
    correctLocation: { lat: 48.8584, lng: 2.2945 },
    mapCenter: [2.3234, 48.8575] as [number, number],
    mapZoom: 12,
    imageId: 'sample-image-2',
    playerResults: [
      {
        id: '1',
        name: 'You',
        emoji: '🏆',
        avatarClass: 'bg-yellow-100 border-yellow-200',
        score: 4200,
        distance: 5.1,
      },
      {
        id: '2',
        name: 'Alice',
        emoji: '🌍',
        avatarClass: 'bg-green-100 border-green-200',
        score: 4680,
        distance: 2.8,
      },
      {
        id: '3',
        name: 'Bob',
        emoji: '🧭',
        avatarClass: 'bg-blue-100 border-blue-200',
        score: 3850,
        distance: 8.5,
      },
      {
        id: '4',
        name: 'Carol',
        emoji: '🚀',
        avatarClass: 'bg-purple-100 border-purple-200',
        score: 4450,
        distance: 3.9,
      },
    ],
  },
])

const players = computed(() => {
  if (!currentRoom.value?.players) return []

  return Object.values(currentRoom.value.players).map((player) => ({
    id: player.id,
    name: player.name,
    emoji: player.avatarEmoji,
    avatarClass: AVATAR_CLASS_MAP[player.avatarBg] || 'bg-gray-100 border-gray-200',
    score: 0,
    status: 'Guessing',
    isHost: player.isHost,
  }))
})

const myself = computed(() => {
  if (!user.value) return null

  return players.value.find((player) => player.id === user.value!.id) || null
})

const gameConfig = computed(() => {
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

const saveRoundRecord = () => {
  if (!imagePosition.value || !currentImageId.value) return

  const [centerLng, centerLat] = calculateCenter(
    [markerPosition.value!.lng, markerPosition.value!.lat],
    [imagePosition.value!.lng, imagePosition.value!.lat],
  )
  const zoom = calculateZoomLevel(distance.value)

  gameRecords.value.push({
    round: currentRound.value,
    score: score.value,
    distance: distance.value,
    correctLocation: imagePosition.value,
    playerLocation: markerPosition.value,
    mapCenter: [centerLng, centerLat],
    mapZoom: zoom,
    imageId: currentImageId.value,
  })
}

const playersWithTotals = computed(() => {
  return players.value.map((player) => ({
    id: player.id,
    name: player.name,
    emoji: player.emoji,
    avatarClass: player.avatarClass,
    totalScore: player.score,
    totalDistance: Math.round(Math.random() * 20 + 5),
  }))
})

watch(
  () => isTimerExpired.value,
  (newVal) => {
    if (newVal) {
      handleTimeExpired()
    }
  },
)

const handleTimeExpired = () => {
  if (showResult.value) return

  stopTimer()

  if (markerPosition.value && imagePosition.value) {
    distance.value = calculateDistance(imagePosition.value, markerPosition.value)
    score.value = calculateScore(distance.value)
    totalScore.value += score.value
    showResult.value = true

    if (mapRef.value && imagePosition.value) {
      mapRef.value.disableClicks()
      mapRef.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat])
      mapRef.value.centerMapOnMarkers(
        [markerPosition.value.lng, markerPosition.value.lat],
        [imagePosition.value.lng, imagePosition.value.lat],
        distance.value,
      )
    }
  } else {
    score.value = 0
    distance.value = -1
    showResult.value = true

    if (mapRef.value && imagePosition.value) {
      mapRef.value.disableClicks()
      mapRef.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat])
    }
  }

  saveRoundRecord()
}

const onImageLoaded = (position: { lat: number; lng: number }, imageId: string) => {
  currentImageId.value = imageId
  imagePosition.value = position
  isLoadingImage.value = false
  startTimer()
}

const onImageLoadingStart = () => {
  isLoadingImage.value = true
}

const onMarkerPlaced = (position: { lat: number; lng: number }) => {
  markerPosition.value = position
  hasMarker.value = true
}

const makeGuess = () => {
  if (!imagePosition.value || !markerPosition.value) return

  stopTimer()

  distance.value = calculateDistance(imagePosition.value, markerPosition.value)
  score.value = calculateScore(distance.value)
  totalScore.value += score.value
  showResult.value = true

  if (mapRef.value && imagePosition.value) {
    mapRef.value.disableClicks()
    mapRef.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat])
    mapRef.value.centerMapOnMarkers(
      [markerPosition.value.lng, markerPosition.value.lat],
      [imagePosition.value.lng, imagePosition.value.lat],
      distance.value,
    )
  }

  saveRoundRecord()
}

const resetRound = () => {
  showResult.value = false
  hasMarker.value = false
  imagePosition.value = null
  markerPosition.value = null
  distance.value = 0
  score.value = 0
  currentImageId.value = null
  resetTimer()

  if (mapRef.value) {
    mapRef.value.removeMarkers()
    mapRef.value.enableClicks()
  }
}

const nextRound = async () => {
  currentRound.value += 1
  resetRound()

  if (streetViewRef.value) {
    await streetViewRef.value.loadRandomView()
  }
}

const showSummary = () => {
  showSummaryView.value = true
}

const playAgain = () => {
  showSummaryView.value = false
  currentRound.value = 1
  totalScore.value = 0
  gameRecords.value = []
  resetRound()
}

const returnToMenu = () => {
  router.push('/game')
}

const togglePlayersList = () => {
  showPlayersList.value = !showPlayersList.value
}

const startGameFromLobby = () => {
  isWaiting.value = false
}
</script>
