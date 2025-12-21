<template>
  <div class="flex min-h-screen flex-col">
    <HeaderComponent v-if="showSummaryView" />
    <header v-else class="flex items-center justify-between border-b px-4 py-4 sm:px-8">
      <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
        <span>Daily Challenge - Round {{ currentRound }} / {{ ROUNDS }}</span>
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
      v-if="!showSummaryView && !isPendingOnFetchTodayChallenge && !isErrorOnFetchTodayChallenge"
      class="flex grow flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:flex-row"
    >
      <StreetViewComponent
        ref="streetViewRef"
        :allow-moving="true"
        :allow-zooming="true"
        :show-result="showResult"
        :result-score="score"
        :result-distance="distance"
        :distance-unit="user?.distanceUnit ?? 'km'"
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
    <div v-else-if="isPendingOnFetchTodayChallenge" class="flex grow items-center justify-center">
      <div class="font-[JetBrains_Mono] text-lg">Loading Daily Challenge...</div>
    </div>
    <div v-else-if="isErrorOnFetchTodayChallenge" class="flex grow items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="font-[JetBrains_Mono] text-lg text-red-500">Failed to load Daily Challenge</div>
        <Button
          @click="returnToMenu"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
        >
          Return to Menu
        </Button>
      </div>
    </div>
    <GameSummarySinglePlayerComponent
      v-else
      :total-score="totalScore"
      :average-score="averageScore"
      :game-records="gameRecords"
      :is-play-again-enabled="false"
      :distance-unit="user?.distanceUnit ?? 'km'"
      @play-again="returnToMenu"
      @return-to-menu="returnToMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import MapComponent from '@/components/MapComponent.vue'
import StreetViewComponent from '@/components/StreetViewComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import { calculateCenter, calculateDistance, calculateScore, calculateZoomLevel } from '@/utils'
import { useTimer } from '@/composables/useTimer'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import GameSummarySinglePlayerComponent from '@/components/GameSummarySinglePlayerComponent.vue'
import type { LatLng, RoundRecord } from '@/types'
import type { GetTodayChallenge200ResponseRoundsInner } from '@/services'
import { ROUNDS } from '@/consts'
import useDailyChallengeQuery from '@/composables/useDailyChallengeQuery'
import useDailyScoreQuery from '@/composables/useDailyScoreQuery'
import useUserQuery from '@/composables/useUserQuery'

const TIME_LIMIT = 60

const {
  isExpired: isTimerExpired,
  formattedTime,
  start: startTimer,
  stop: stopTimer,
  reset: resetTimer,
} = useTimer(TIME_LIMIT)
const router = useRouter()

const {
  todayChallenge: dailyChallenge,
  isPendingOnFetchTodayChallenge,
  isErrorOnFetchTodayChallenge,
} = useDailyChallengeQuery()
const { mutateDailyScoreCreate, mutateDailyScoreUpdate } = useDailyScoreQuery()
const { user } = useUserQuery()

const hasMarker = ref(false)
const showResult = ref(false)
const isLoadingImage = ref(false)
const showSummaryView = ref(false)
const distance = ref(0)
const score = ref(0)
const totalScore = ref(0)
const currentRound = ref(1)
const imagePosition = ref<LatLng | null>(null)
const markerPosition = ref<LatLng | null>(null)
const mapRef = ref<InstanceType<typeof MapComponent> | null>(null)
const streetViewRef = ref<InstanceType<typeof StreetViewComponent> | null>(null)
const gameStarted = ref(false)

const gameRecords = ref<RoundRecord[]>([])

const currentImageId = computed(() => {
  if (!dailyChallenge.value?.rounds) return null
  const round = dailyChallenge.value.rounds.find(
    (r: GetTodayChallenge200ResponseRoundsInner) => r.round === currentRound.value,
  )
  return round?.imageId || null
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

const averageScore = computed(() => {
  if (gameRecords.value.length === 0) return 0
  const sum = gameRecords.value.reduce((acc, record) => acc + record.score, 0)
  return Math.round(sum / gameRecords.value.length)
})

watch(
  () => currentImageId.value,
  async (newImageId) => {
    // Make sure DOM updates are complete
    await nextTick()
    if (streetViewRef.value && newImageId) {
      await streetViewRef.value.loadViewFromImageId(newImageId)
    }
  },
)

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

const onImageLoaded = (position: LatLng) => {
  imagePosition.value = position
  isLoadingImage.value = false

  if (!gameStarted.value) {
    gameStarted.value = true
    mutateDailyScoreCreate({
      score: -1,
      distance: -1,
      timeTaken: -1,
    })
  }

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
  resetTimer()

  if (mapRef.value) {
    mapRef.value.removeMarkers()
    mapRef.value.enableClicks()
  }
}

const nextRound = async () => {
  currentRound.value += 1
  resetRound()
}

const showSummary = () => {
  showSummaryView.value = true

  mutateDailyScoreUpdate({
    score: totalScore.value,
  })
}

const returnToMenu = () => {
  router.push('/game')
}
</script>
