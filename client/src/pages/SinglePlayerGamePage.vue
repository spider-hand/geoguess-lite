<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-8 py-4">
      <div class="font-[JetBrains_Mono] text-xl font-semibold">Round {{ currentRound }} / {{ gameConfig.rounds }}</div>
      <nav class="flex gap-4">
        <div class="text-muted-foreground font-[JetBrains_Mono] text-lg px-4 py-2 h-9">
          [Time: {{ formattedTime }}]
        </div>
        <div class="text-muted-foreground font-[JetBrains_Mono] text-lg px-4 py-2 h-9">
          [Score: {{ totalScore }}]
        </div>
      </nav>
    </header>
    <main class="grow flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
      <StreetViewComponent ref="streetViewComponent" :allow-moving="gameConfig.allowMoving"
        :allow-zooming="gameConfig.allowZooming" :show-result="showResult" :result-score="score"
        :result-distance="distance" @image-loaded="onImageLoaded" @image-loading-start="onImageLoadingStart" />
      <div class="flex flex-col lg:w-1/3 lg:max-w-md gap-6">
        <MapComponent ref="mapComponent" @marker-placed="onMarkerPlaced" />
        <Button v-if="!showResult" :disabled="!hasMarker || isLoadingImage" @click="makeGuess"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoadingImage ? 'Loading...' : 'Make Guess' }}
        </Button>
        <Button v-else-if="currentRound < gameConfig.rounds" @click="nextRound"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
          Next Round
        </Button>
        <Button v-else @click="showSummary"
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
          Summary
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MapComponent from '@/components/MapComponent.vue';
import StreetViewComponent from '@/components/StreetViewComponent.vue';
import Button from '@/components/ui/button/Button.vue';
import useGameConfigStore from '@/stores/gameConfig';
import { calculateDistance, calculateScore } from '@/utils';
import { useTimer } from '@/composables/useTimer';

const gameConfig = useGameConfigStore();
const { isExpired: isTimerExpired, formattedTime, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer(gameConfig.timeLimit);

const hasMarker = ref(false);
const showResult = ref(false);
const isLoadingImage = ref(false);
const distance = ref(0);
const score = ref(0);
const totalScore = ref(0);
const currentRound = ref(1);
const imagePosition = ref<{ lat: number, lng: number } | null>(null);
const markerPosition = ref<{ lat: number, lng: number } | null>(null);
const mapComponent = ref();
const streetViewComponent = ref();

watch(() => isTimerExpired.value, (newVal) => {
  if (newVal) {
    handleTimeExpired();
  }
});

const handleTimeExpired = () => {
  if (showResult.value) return;

  stopTimer();

  if (markerPosition.value && imagePosition.value) {
    distance.value = calculateDistance(imagePosition.value, markerPosition.value);
    score.value = calculateScore(distance.value);
    totalScore.value += score.value;
    showResult.value = true;

    if (mapComponent.value && imagePosition.value) {
      mapComponent.value.disableClicks();
      mapComponent.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat]);
      mapComponent.value.centerMapOnMarkers(
        [markerPosition.value.lng, markerPosition.value.lat],
        [imagePosition.value.lng, imagePosition.value.lat],
        distance.value
      );
    }
  } else {
    // No marker placed when time expired
    score.value = 0;
    distance.value = -1; // Use -1 to indicate no guess was made
    showResult.value = true;

    if (mapComponent.value && imagePosition.value) {
      mapComponent.value.disableClicks();
      mapComponent.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat]);
    }
  }
};

const onImageLoaded = (position: { lat: number, lng: number }) => {
  imagePosition.value = position;
  isLoadingImage.value = false;
  startTimer();
};

const onImageLoadingStart = () => {
  isLoadingImage.value = true;
};

const onMarkerPlaced = (position: { lat: number, lng: number }) => {
  markerPosition.value = position;
  hasMarker.value = true;
};

const makeGuess = () => {
  if (!imagePosition.value || !markerPosition.value) return;

  stopTimer();

  distance.value = calculateDistance(imagePosition.value, markerPosition.value);
  score.value = calculateScore(distance.value);
  totalScore.value += score.value;
  showResult.value = true;

  if (mapComponent.value && imagePosition.value) {
    mapComponent.value.disableClicks();
    mapComponent.value.showCorrectLocation([imagePosition.value.lng, imagePosition.value.lat]);
    mapComponent.value.centerMapOnMarkers(
      [markerPosition.value.lng, markerPosition.value.lat],
      [imagePosition.value.lng, imagePosition.value.lat],
      distance.value
    );
  }
};

const resetRound = () => {
  showResult.value = false;
  hasMarker.value = false;
  imagePosition.value = null;
  markerPosition.value = null;
  distance.value = 0;
  score.value = 0;
  resetTimer();

  if (mapComponent.value) {
    mapComponent.value.removeMarkers();
    mapComponent.value.enableClicks();
  }
};

const nextRound = async () => {
  currentRound.value += 1;
  resetRound();

  if (streetViewComponent.value) {
    await streetViewComponent.value.loadRandomView();
  }
};

const showSummary = () => {
  console.log('Game completed! Total score:', totalScore.value);
};
</script>
