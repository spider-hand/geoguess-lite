<template>
  <div ref="mapRef" class="h-full w-full rounded-4xl"></div>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { onMounted, onUnmounted, ref, type PropType } from 'vue'
import useUserQuery from '@/composables/useUserQuery'
import { calculateCenter, calculateZoomLevel, getAvatarClass } from '@/utils'

const props = defineProps({
  playerLocation: {
    type: Object as PropType<{ lat: number; lng: number } | null>,
    default: null,
  },
  correctLocation: {
    type: Object as PropType<{ lat: number; lng: number } | null>,
    default: null,
  },
  center: {
    type: Array as PropType<number[] | null>,
    default: null,
  },
  zoom: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits<{
  markerPlaced: [position: { lat: number; lng: number }]
  markerRemoved: []
}>()

const mapRef = ref<HTMLElement | null>(null)
const map = ref(null as maplibregl.Map | null)
const currentMarker = ref<maplibregl.Marker | null>(null)
const correctLocationMarker = ref<maplibregl.Marker | null>(null)

const { user } = useUserQuery()

const createAvatarMarker = () => {
  if (!user.value) return null

  const markerElement = document.createElement('div')
  markerElement.className = `flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 border-white shadow-lg cursor-pointer ${getAvatarClass(user.value.avatarBg)}`
  markerElement.innerHTML = user.value.avatarEmoji

  return markerElement
}

const handleMapClick = (e: maplibregl.MapMouseEvent) => {
  addMarkerToMap([e.lngLat.lng, e.lngLat.lat])
}

const addMarkerToMap = (lngLat: [number, number]) => {
  if (!map.value || !user.value) return

  if (currentMarker.value) {
    currentMarker.value.remove()
  }

  const markerElement = createAvatarMarker()
  if (!markerElement) return

  currentMarker.value = new maplibregl.Marker({
    element: markerElement,
    anchor: 'center',
  }).setLngLat(lngLat)

  // @ts-expect-error maplibre type issue
  currentMarker.value.addTo(map.value)

  emit('markerPlaced', { lat: lngLat[1], lng: lngLat[0] })
}

const showCorrectLocation = (lngLat: [number, number]) => {
  if (!map.value) return

  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove()
  }

  correctLocationMarker.value = new maplibregl.Marker({
    color: '#ef4444',
  }).setLngLat(lngLat)

  // @ts-expect-error maplibre type issue
  correctLocationMarker.value.addTo(map.value)
}

const centerMapOnMarkers = (
  userPos: [number, number],
  correctPos: [number, number],
  distance: number,
) => {
  if (!map.value) return

  const [centerLng, centerLat] = calculateCenter(userPos, correctPos)
  const zoom = calculateZoomLevel(distance)

  map.value.flyTo({
    center: [centerLng, centerLat],
    zoom: zoom,
    duration: 1500,
  })
}

const removeMarkers = () => {
  if (currentMarker.value) {
    currentMarker.value.remove()
    currentMarker.value = null
  }
  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove()
    correctLocationMarker.value = null
  }
}

const disableClicks = () => {
  if (!map.value) return
  map.value.off('click', handleMapClick)
}

const enableClicks = () => {
  if (!map.value) return
  map.value.on('click', handleMapClick)
}

const addCorrectLocationMarker = (location: { lat: number; lng: number }) => {
  if (!map.value) return

  correctLocationMarker.value = new maplibregl.Marker({
    color: '#ef4444',
  }).setLngLat([location.lng, location.lat])

  // @ts-expect-error maplibre type issue
  correctLocationMarker.value.addTo(map.value)
}

const initializeMap = () => {
  if (!mapRef.value || map.value) return

  map.value = new maplibregl.Map({
    container: mapRef.value as HTMLElement,
    style: {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution:
            '©<a href="https://www.openstreetmap.org/copyright/ja">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
      center: props.center || [6.82, 50.06],
      zoom: props.zoom || 3,
    },
  })

  // Disable click event and show the markers when initializing the map for summary view
  if (!props.correctLocation) {
    map.value.on('click', handleMapClick)
  }

  map.value.on('load', () => {
    if (props.correctLocation) {
      addCorrectLocationMarker(props.correctLocation)

      if (props.playerLocation) {
        addMarkerToMap([props.playerLocation.lng, props.playerLocation.lat])
      }
    }
  })
}

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (currentMarker.value) {
    currentMarker.value.remove()
  }
  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove()
  }
})

defineExpose({
  showCorrectLocation,
  centerMapOnMarkers,
  removeMarkers,
  disableClicks,
  enableClicks,
})
</script>
