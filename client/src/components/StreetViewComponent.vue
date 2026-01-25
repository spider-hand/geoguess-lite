<template>
  <div
    class="relative h-[300px] w-full rounded-4xl sm:h-[400px] lg:h-[calc(100vh-120px)] lg:w-2/3 lg:flex-1"
  >
    <div ref="viewerRef" class="h-full w-full rounded-4xl"></div>
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
      <Spinner class="text-muted-foreground size-12" />
    </div>
    <div v-if="showResult" class="absolute inset-0 flex items-center justify-center">
      <div class="rounded-lg bg-black px-8 py-6 text-center opacity-80 shadow-lg">
        <div class="font-bolds font-[JetBrains_Mono] text-2xl text-white">
          {{ resultScore }} points
        </div>
        <div class="mt-2 font-[JetBrains_Mono] text-lg text-gray-300">
          {{
            resultDistance === -1
              ? "Time's up! No guess made."
              : `You were ${formatDistance(resultDistance, props.distanceUnit)} away!`
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Viewer } from 'mapillary-js'
import type { LatLng } from '@/types'
import { formatDistance } from '@/utils'
import type { UserDistanceUnitEnum } from '@/services/models'
import Spinner from './ui/spinner/Spinner.vue'

const emit = defineEmits<{
  imageLoaded: [position: LatLng, imageId: string]
  imageLoadingStart: []
}>()

const props = defineProps({
  allowMoving: {
    type: Boolean,
    default: true,
  },
  allowZooming: {
    type: Boolean,
    default: true,
  },
  showResult: {
    type: Boolean,
    default: false,
  },
  resultScore: {
    type: Number,
    default: 0,
  },
  resultDistance: {
    type: Number,
    default: 0,
  },
  distanceUnit: {
    type: String as () => UserDistanceUnitEnum,
    default: 'km' as UserDistanceUnitEnum,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  imageId: {
    type: String,
    default: undefined,
  },
})

const viewer = ref<Viewer | null>(null)
const viewerRef = ref<HTMLElement | null>(null)

const loadRandomView = async (imageId: string) => {
  try {
    if (!viewer.value) return

    emit('imageLoadingStart')
    await viewer.value.moveTo(imageId)

    const pos = await viewer.value.getPosition()

    emit('imageLoaded', { lat: pos.lat, lng: pos.lng }, imageId)
  } catch (err) {
    console.error('Error in loadRandomView:', err)

    const isOnFirefox = /Firefox/i.test(navigator.userAgent)

    if (isOnFirefox) {
      // NOTE: Facebook container on Firefox blocks requests to Mapillary API
      // @see: https://github.com/mozilla/contain-facebook/blob/main/src/background.js
      alert(
        'It looks like you’re using Firefox. If Facebook Container is enabled, please disable it for this site to load images properly.',
      )
    }

    throw err
  }
}

const initViewer = () => {
  if (!viewerRef.value || viewer.value) return

  viewer.value = new Viewer({
    container: viewerRef.value,
    accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
    component: {
      pointer: props.allowZooming,
      sequence: props.allowMoving,
      direction: props.allowMoving,
      zoom: props.allowZooming,
    },
  })
}

onMounted(() => {
  initViewer()
})

// Auto-load image if imageId prop is provided (used in summary views)
watch(
  () => props.imageId,
  (newImageId) => {
    if (newImageId && viewer.value) {
      loadRandomView(newImageId)
    }
  },
)

// Also load when viewer becomes ready if imageId is already set
watch(
  () => viewer.value,
  (newViewer) => {
    if (newViewer && props.imageId) {
      loadRandomView(props.imageId)
    }
  },
)

onUnmounted(() => {
  if (viewer.value) {
    viewer.value.remove()
    viewer.value = null
  }
})

defineExpose({
  loadRandomView,
})
</script>
