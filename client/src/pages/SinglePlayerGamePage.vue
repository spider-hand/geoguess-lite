<template>
  <div class="flex min-h-screen flex-col">
    <HeaderComponent v-if="showSummaryView" />
    <header v-else class="flex items-center justify-between border-b px-4 py-4 sm:px-8">
      <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
        <span>Round {{ currentRound }} / {{ ROUNDS }}</span>
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
        :distance-unit="user?.distanceUnit ?? 'km'"
        :is-loading="isLoadingImage"
        @image-loaded="onImageLoaded"
        @image-loading-start="onImageLoadingStart"
      />
      <div class="flex flex-col gap-4 sm:gap-6 lg:w-1/3 lg:max-w-md">
        <div class="h-[300px] sm:h-[400px] lg:h-full">
          <MapComponent ref="mapRef" @marker-placed="onMarkerPlaced" />
        </div>
        <Button
          v-if="!showResult"
          :disabled="!hasMarker || isLoadingImage"
          @click="makeGuess"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isLoadingImage ? 'Loading...' : 'Make Guess' }}
        </Button>
        <Button
          v-else-if="currentRound < ROUNDS"
          @click="nextRound"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
        >
          Next Round
        </Button>
        <Button
          v-else
          @click="showSummary"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
        >
          Summary
        </Button>
      </div>
    </main>
    <GameSummarySinglePlayerComponent
      v-else
      :total-score="totalScore"
      :average-score="averageScore"
      :game-records="gameRecords"
      :distance-unit="user?.distanceUnit ?? 'km'"
      @play-again="playAgain"
      @return-to-menu="returnToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import MapComponent from '@/components/MapComponent.vue'
import StreetViewComponent from '@/components/StreetViewComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import useGameConfigStore from '@/stores/gameConfig'
import { calculateCenter, calculateDistance, calculateScore, calculateZoomLevel } from '@/utils'
import { useTimer } from '@/composables/useTimer'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import GameSummarySinglePlayerComponent from '@/components/GameSummarySinglePlayerComponent.vue'
import type { LatLng, RoundRecord } from '@/types'
import { ROUNDS } from '@/consts'
import useUserQuery from '@/composables/useUserQuery'
import useImagesQuery from '@/composables/useImagesQuery'

const gameConfig = useGameConfigStore()
const {
  isExpired: isTimerExpired,
  formattedTime,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer,
} = useTimer(gameConfig.timeLimit)
const router = useRouter()
const { user, mutateUserUpdate } = useUserQuery()
const { images, isFetchingOnFetchImages, isSuccessOnFetchImages, refetchImages } = useImagesQuery(
  gameConfig.onlyPanorama,
)

const hasMarker = ref(false)
const showResult = ref(false)
const isLoadingImage = ref(false)
const showSummaryView = ref(false)
const distance = ref(0)
const score = ref(0)
const totalScore = ref(0)
const currentRound = ref(1)
const currentImageId = ref<string | null>(null)
const imagePosition = ref<LatLng | null>(null)
const markerPosition = ref<LatLng | null>(null)
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null)
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(null)

const gameRecords = ref<RoundRecord[]>([])

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
    playerLocations: markerPosition.value
      ? [
          {
            lat: markerPosition.value.lat,
            lng: markerPosition.value.lng,
            avatarEmoji: user.value?.avatarEmoji ?? '🌍',
            avatarBg: user.value?.avatarBg ?? 'blue',
            id: user.value?.id ?? 'guest',
          },
        ]
      : [],
    mapCenter: [centerLng, centerLat],
    mapZoom: zoom,
    imageId: currentImageId.value,
  })
}

const averageScore = computed(() => {
  if (gameRecords.value.length === 0) return 0
  const sum = gameRecords.value.reduce((acc, record) => acc + record.score, 0)
  return Math.round(sum / gameRecords.value.length)
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
    // No marker placed when time expired
    score.value = 0
    distance.value = -1 // Use -1 to indicate no guess was made
    showResult.value = true

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

const loadCurrentRoundImage = async () => {
  if (!streetViewRef.value || !images.value) return

  const imageId = images.value[currentRound.value - 1]?.id
  if (imageId) {
    await streetViewRef.value.loadRandomView(imageId)
  }
}

const nextRound = async () => {
  currentRound.value += 1
  resetRound()
  await loadCurrentRoundImage()
}

const showSummary = () => {
  showSummaryView.value = true

  if (user.value) {
    const newBestScore = Math.max(user.value.bestScore ?? 0, totalScore.value)
    const newGamesPlayed = (user.value.gamesPlayed ?? 0) + 1
    const totalRoundsSum =
      (user.value.averageScore ?? 0) * (user.value.gamesPlayed ?? 0) * ROUNDS + totalScore.value
    const totalRoundsPlayed = newGamesPlayed * ROUNDS
    const newAverageScore = Math.round(totalRoundsSum / totalRoundsPlayed)

    mutateUserUpdate({
      bestScore: newBestScore,
      averageScore: newAverageScore,
      gamesPlayed: newGamesPlayed,
    })
  }
}

const playAgain = async () => {
  showSummaryView.value = false
  currentRound.value = 1
  totalScore.value = 0
  gameRecords.value = []
  resetRound()

  // Fetch new set of images for the new game
  await refetchImages()

  // Apply showSummaryView change
  await nextTick()

  await loadCurrentRoundImage()
}

const returnToMenu = () => {
  router.push('/game')
}

// Watch for images to be fetched, then load the first round image
// NOTE: isFetching can be updated in subsequent visits
// Other states (e.g., isSuccess) are not updated in subsequent visits, even though data is refetched
watch(
  () => isFetchingOnFetchImages.value,
  (isFetching) => {
    if (!isFetching && isSuccessOnFetchImages.value) {
      loadCurrentRoundImage()
    }
  },
  { immediate: true },
)
</script>
