<template>
  <div class="flex min-h-screen flex-col">
    <LobbyComponent
      v-if="isWaiting"
      :room-id="props.roomId"
      :myself="myself"
      :players="players"
      :game-config="gameConfig"
      :is-creating-rounds="isCreatingRounds"
      @start-game="startGame"
      @leave-room="handleLeaveRoom"
    />
    <div v-else-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mb-4 font-[JetBrains_Mono] text-2xl">
          Creating the game.. It might take a while..
        </div>
        <div class="font-[JetBrains_Mono] text-lg">Waiting for all players to load</div>
      </div>
    </div>
    <template v-else>
      <HeaderComponent v-if="showSummaryView" />
      <header v-else class="flex items-center justify-between border-b px-4 py-4 sm:px-8">
        <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
          <span>Room #{{ props.roomId }} - Round {{ displayedRound }} / {{ ROUNDS }}</span>
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
            [Score: {{ displayedTotalScore }}]
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
          :result-score="displayedScore"
          :result-distance="displayedDistance"
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
              :disabled="!hasMarker || isLoadingImage || hasUserGuessed"
              @click="makeGuess"
              class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isLoadingImage ? 'Loading...' : hasUserGuessed ? 'Guessed' : 'Make Guess' }}
            </Button>
            <Button
              v-else-if="isPlaying"
              @click="nextRound"
              class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
            >
              Next Round
            </Button>
            <Button
              v-else-if="isFinished"
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
        :players="players"
        :game-records="multiplayerGameRecords"
        @play-again="playAgain"
        @return-to-menu="returnToMenu"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import MapComponent from '@/components/MapComponent.vue'
import StreetViewComponent from '@/components/StreetViewComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { calculateCenter, calculateDistance, calculateScore, calculateZoomLevel } from '@/utils'
import { useTimer } from '@/composables/useTimer'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import GameSummaryMultiplayerComponent from '@/components/GameSummaryMultiplayerComponent.vue'
import LobbyComponent from '@/components/LobbyComponent.vue'
import type { GuessNode, LatLng, MultiplayerRoundRecord, RoundRecord } from '@/types'
import { ROUNDS, AVATAR_CLASS_MAP } from '@/consts'
import { useMultiplayerRoom } from '@/composables/useMultiplayerRoom'
import useUserQuery from '@/composables/useUserQuery'
import useMultiplayerRoundsApi from '@/composables/useMultiplayerRoundsApi'
import { ref as dbRef, update } from 'firebase/database'
import { db } from '@/lib/firebase'

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const {
  currentRoom,
  isWaiting,
  isLoading,
  isLoaded,
  isPlaying,
  isFinished,
  roomCurrentRound,
  currentRoundImageId,
  hasEveryoneLoaded,
  hasEveryoneGuessed,
  gameConfig,
  players,
  getRoomById,
  leaveRoom,
  updateCurrentRoundImageId,
} = useMultiplayerRoom()
const {
  isExpired: isTimerExpired,
  formattedTime,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer,
} = useTimer(() => gameConfig.value.timeLimit)
const { user, mutateUserUpdate } = useUserQuery()
const { multiplayerRoundsApi } = useMultiplayerRoundsApi()

onMounted(() => {
  if (props.roomId) {
    getRoomById(props.roomId, user.value?.id)
  }
})

const handleLeaveRoom = async () => {
  if (!user.value) return

  try {
    await leaveRoom(user.value.id)
    router.push({ name: 'game' })
  } catch (err) {
    console.error('Failed to leave room:', err)
  }
}

const hasMarker = ref(false)
const showResult = ref(false)
const isLoadingImage = ref(false)
const showSummaryView = ref(false)
const showPlayersList = ref(true)
const isCreatingRounds = ref(false)
const currentRound = computed(() => roomCurrentRound.value)
const displayedDistance = ref(0)
const displayedScore = ref(0)
const displayedTotalScore = ref(0)
const displayedRound = ref(1)
const currentImageId = ref<string | null>(null)
const imagePosition = ref<LatLng | null>(null)
const markerPosition = ref<LatLng | null>(null)
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null)
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(null)

const gameRecords = ref<RoundRecord[]>([])

const multiplayerGameRecords = computed<MultiplayerRoundRecord[]>(() => {
  if (!currentRoom.value?.rounds || !currentRoom.value?.players) return []

  const rounds = currentRoom.value.rounds
  const players = currentRoom.value.players
  const records = []

  for (let roundNum = 1; roundNum <= roomCurrentRound.value; roundNum++) {
    const round = rounds[roundNum]
    if (!round) continue

    const guesses = round.guesses || {}
    const playerResults = Object.values(players).map((player) => {
      const guess = guesses[player.id]
      return {
        id: player.id,
        name: player.name,
        emoji: player.avatarEmoji,
        avatarClass: AVATAR_CLASS_MAP[player.avatarBg] || 'bg-gray-100 border-gray-200',
        score: guess?.score ?? 0,
        distance: guess?.distance ?? -1,
      }
    })

    const gameRecord = gameRecords.value.find((r) => r.round === roundNum)

    records.push({
      round: roundNum,
      playerLocations: Object.entries(guesses).map(([playerId, guess]) => {
        const player = players[playerId]
        return {
          lat: guess.lat,
          lng: guess.lng,
          avatarEmoji: player?.avatarEmoji ?? '👤',
          avatarBg: player?.avatarBg ?? 'bg-gray-100',
          id: playerId,
        }
      }),
      correctLocation: gameRecord?.correctLocation ?? { lat: 0, lng: 0 },
      mapCenter: gameRecord?.mapCenter ?? ([0, 0] as [number, number]),
      mapZoom: gameRecord?.mapZoom ?? 10,
      imageId: round.imageId,
      playerResults,
    })
  }

  return records
})

const hasUserGuessed = computed(() => {
  if (!user.value || !currentRoom.value?.rounds) return false
  const rounds = currentRoom.value.rounds
  return rounds[currentRound.value]?.guesses?.[user.value.id] !== undefined
})

const myself = computed(() => {
  if (!user.value) return null

  return players.value.find((player) => player.id === user.value!.id) ?? null
})

const currentRoundMyResult = computed<GuessNode | null>(() => {
  if (!user.value || !currentRoom.value?.rounds) return null
  const rounds = currentRoom.value.rounds
  return rounds[currentRound.value]?.guesses?.[user.value.id] ?? null
})

watch(
  () => isTimerExpired.value,
  (newVal) => {
    if (newVal) {
      handleTimeExpired()
    }
  },
)

watch(
  () => isLoaded.value,
  (loaded) => {
    // Start round 1
    if (loaded) {
      updateCurrentRoundImageId()
    }
  },
)

watch(
  () => currentRoundImageId.value,
  async (imageId) => {
    if (imageId && user.value) {
      const playerRef = dbRef(db, `rooms/${props.roomId}/players/${user.value.id}`)
      await update(playerRef, { loadedRound: roomCurrentRound.value })
    }
  },
)

watch(hasEveryoneLoaded, async (loaded) => {
  // Make sure DOM updates are complete
  await nextTick()
  if (loaded && streetViewRef.value && currentRoundImageId.value) {
    isLoadingImage.value = true
    displayedRound.value = currentRound.value
    await streetViewRef.value.loadViewFromImageId(currentRoundImageId.value)
  }
})

watch(hasEveryoneGuessed, (guessed) => {
  if (guessed && !showResult.value) {
    displayedScore.value = currentRoundMyResult.value?.score ?? 0
    displayedDistance.value = currentRoundMyResult.value?.distance ?? 0
    displayedTotalScore.value += displayedScore.value
    showResult.value = true

    // Show all player markers and correct location
    if (mapRef.value && imagePosition.value && currentRoom.value?.rounds) {
      const currentRoundData = currentRoom.value.rounds[currentRound.value]
      const guesses = currentRoundData?.guesses ?? {}
      const playersData = currentRoom.value.players ?? {}

      // Collect all player locations with avatar info
      const allPlayerLocations = Object.entries(guesses).map(([playerId, guess]) => {
        const player = playersData[playerId]
        return {
          lat: guess.lat,
          lng: guess.lng,
          avatarEmoji: player?.avatarEmoji ?? '👤',
          avatarBg: player?.avatarBg ?? 'bg-gray-100',
          id: playerId,
        }
      })

      // Add all player markers
      mapRef.value.addPlayerMarkers(allPlayerLocations)

      // Show correct location
      mapRef.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat])

      // Center map if current user made a guess
      if (markerPosition.value) {
        mapRef.value.centerMapOnMarkers(
          [markerPosition.value.lng, markerPosition.value.lat],
          [imagePosition.value.lng, imagePosition.value.lat],
          currentRoundMyResult.value?.distance ?? 0,
        )
      }
    }
  }
})

const handleTimeExpired = async () => {
  if (showResult.value || !user.value) return

  stopTimer()

  if (markerPosition.value && imagePosition.value) {
    const distance = calculateDistance(imagePosition.value, markerPosition.value)
    const score = calculateScore(distance)

    const guessRef = dbRef(
      db,
      `rooms/${props.roomId}/rounds/${roomCurrentRound.value}/guesses/${user.value.id}`,
    )

    try {
      await update(guessRef, {
        lat: markerPosition.value.lat,
        lng: markerPosition.value.lng,
        score: score,
        distance: distance,
      })
    } catch (err) {
      console.error('Failed to save time expired guess:', err)
    }

    if (mapRef.value && imagePosition.value) {
      mapRef.value.disableClicks()
    }
  } else {
    const guessRef = dbRef(
      db,
      `rooms/${props.roomId}/rounds/${roomCurrentRound.value}/guesses/${user.value.id}`,
    )

    try {
      await update(guessRef, {
        lat: -1,
        lng: -1,
        score: 0,
        distance: -1,
      })
    } catch (err) {
      console.error('Failed to save no guess:', err)
    }

    if (mapRef.value && imagePosition.value) {
      mapRef.value.disableClicks()
      mapRef.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat])
    }
  }

  saveRoundRecord()
}

const onImageLoaded = (position: LatLng, imageId: string) => {
  currentImageId.value = imageId
  imagePosition.value = position
  isLoadingImage.value = false
  startTimer()
}

const onImageLoadingStart = () => {
  isLoadingImage.value = true
}

const onMarkerPlaced = (position: LatLng) => {
  markerPosition.value = position
  hasMarker.value = true
}

const togglePlayersList = () => {
  showPlayersList.value = !showPlayersList.value
}

const makeGuess = async () => {
  if (!imagePosition.value || !markerPosition.value || !user.value) return

  stopTimer()

  const distance = calculateDistance(imagePosition.value, markerPosition.value)
  const score = calculateScore(distance)

  const guessRef = dbRef(
    db,
    `rooms/${props.roomId}/rounds/${roomCurrentRound.value}/guesses/${user.value.id}`,
  )

  try {
    await update(guessRef, {
      lat: markerPosition.value.lat,
      lng: markerPosition.value.lng,
      score: score,
      distance: distance,
    })
  } catch (err) {
    console.error('Failed to save guess:', err)
  }

  if (mapRef.value) {
    mapRef.value.disableClicks()
  }

  saveRoundRecord()
}

const saveRoundRecord = () => {
  if (!imagePosition.value || !currentImageId.value) return

  const [centerLng, centerLat] = calculateCenter(
    [markerPosition.value!.lng, markerPosition.value!.lat],
    [imagePosition.value!.lng, imagePosition.value!.lat],
  )
  const zoom = calculateZoomLevel(currentRoundMyResult.value?.distance ?? 0)

  gameRecords.value.push({
    round: currentRound.value,
    score: currentRoundMyResult.value?.score ?? 0,
    distance: currentRoundMyResult.value?.distance ?? 0,
    correctLocation: imagePosition.value,
    playerLocations:
      markerPosition.value && user.value
        ? [
            {
              lat: markerPosition.value.lat,
              lng: markerPosition.value.lng,
              avatarEmoji: user.value.avatarEmoji,
              avatarBg: user.value.avatarBg,
              id: user.value.id,
            },
          ]
        : [],
    mapCenter: [centerLng, centerLat],
    mapZoom: zoom,
    imageId: currentImageId.value,
  })
}

const resetRound = () => {
  showResult.value = false
  hasMarker.value = false
  imagePosition.value = null
  markerPosition.value = null
  displayedDistance.value = 0
  displayedScore.value = 0
  currentImageId.value = null
  resetTimer()

  if (mapRef.value) {
    mapRef.value.removeMarkers()
    mapRef.value.enableClicks()
  }
}

const nextRound = async () => {
  if (!user.value) return

  resetRound()

  isLoadingImage.value = true
  updateCurrentRoundImageId()
  const playerRef = dbRef(db, `rooms/${props.roomId}/players/${user.value.id}`)

  try {
    await update(playerRef, { loadedRound: roomCurrentRound.value })
  } catch (err) {
    console.error('Failed to update player loaded round:', err)
  }
}

const showSummary = () => {
  showSummaryView.value = true

  if (user.value) {
    const newBestScore = Math.max(user.value.bestScore ?? 0, displayedTotalScore.value)
    const newGamesPlayed = (user.value.gamesPlayed ?? 0) + 1
    const totalRoundsSum =
      (user.value.averageScore ?? 0) * (user.value.gamesPlayed ?? 0) * ROUNDS +
      displayedTotalScore.value
    const totalRoundsPlayed = newGamesPlayed * ROUNDS
    const newAverageScore = Math.round(totalRoundsSum / totalRoundsPlayed)

    mutateUserUpdate({
      bestScore: newBestScore,
      averageScore: newAverageScore,
      gamesPlayed: newGamesPlayed,
    })
  }
}

const playAgain = () => {
  showSummaryView.value = false
  displayedTotalScore.value = 0
  gameRecords.value = []
  resetRound()
}

const returnToMenu = () => {
  router.push('/game')
}

const startGame = async () => {
  try {
    isCreatingRounds.value = true
    await multiplayerRoundsApi.createMultiplayerRounds({
      createMultiplayerRoundsRequest: {
        roomId: props.roomId,
      },
    })
  } catch (err) {
    console.error('Failed to start game:', err)
  } finally {
    isCreatingRounds.value = false
  }
}
</script>
