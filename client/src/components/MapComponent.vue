<template>
  <div ref="mapRef" class="h-full w-full rounded-4xl"></div>
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, onUnmounted, ref, shallowRef, type PropType } from 'vue'
import useUserQuery from '@/composables/useUserQuery'
import { calculateCenter, calculateZoomLevel, getAvatarClass } from '@/utils'
import type { LatLng, PlayerMarker } from '@/types'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const props = defineProps({
  playerLocations: {
    type: Array as PropType<PlayerMarker[]>,
    default: () => [],
  },
  correctLocation: {
    type: Object as PropType<LatLng | null>,
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
  markerPlaced: [position: LatLng]
  markerRemoved: []
}>()

const mapRef = ref<HTMLElement | null>(null)
const map = shallowRef<mapboxgl.Map | null>(null)
const currentMarker = shallowRef<mapboxgl.Marker | null>(null)
const correctLocationMarker = shallowRef<mapboxgl.Marker | null>(null)
const playerMarkers = shallowRef<mapboxgl.Marker[]>([])

const { user } = useUserQuery()

const createAvatarMarker = (avatarEmoji: string, avatarBg: string) => {
  const markerElement = document.createElement('div')
  markerElement.className = `flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 border-white shadow-lg cursor-pointer ${getAvatarClass(avatarBg)}`
  markerElement.innerHTML = avatarEmoji

  return markerElement
}

const createUserMarker = () => {
  const avatarEmoji = user.value?.avatarEmoji ?? '🌍'
  const avatarBg = user.value?.avatarBg ?? 'blue'
  return createAvatarMarker(avatarEmoji, avatarBg)
}

const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
  addMarkerToMap([e.lngLat.lng, e.lngLat.lat])
}

// For user clicks during gameplay
const addMarkerToMap = (lngLat: [number, number]) => {
  if (!map.value) return

  if (currentMarker.value) {
    currentMarker.value.remove()
  }

  const markerElement = createUserMarker()
  if (!markerElement) return

  currentMarker.value = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'center',
  }).setLngLat(lngLat)

  currentMarker.value.addTo(map.value)

  emit('markerPlaced', { lat: lngLat[1], lng: lngLat[0] })
}

// For adding player markers with specific avatar info
const addPlayerMarker = (lngLat: [number, number], avatarEmoji: string, avatarBg: string) => {
  if (!map.value) return

  const markerElement = createAvatarMarker(avatarEmoji, avatarBg)
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'center',
  }).setLngLat(lngLat)

  marker.addTo(map.value)
  playerMarkers.value.push(marker)
}

const showCorrectLocation = (lngLat: [number, number]) => {
  if (!map.value) return

  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove()
  }

  correctLocationMarker.value = new mapboxgl.Marker({
    color: '#ef4444',
  }).setLngLat(lngLat)

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
  // Remove all player markers
  playerMarkers.value.forEach((marker) => marker.remove())
  playerMarkers.value = []
}

const disableClicks = () => {
  if (!map.value) return
  map.value.off('click', handleMapClick)
}

const enableClicks = () => {
  if (!map.value) return
  map.value.on('click', handleMapClick)
}

const addCorrectLocationMarker = (location: LatLng) => {
  if (!map.value) return

  correctLocationMarker.value = new mapboxgl.Marker({
    color: '#ef4444',
  }).setLngLat([location.lng, location.lat])

  correctLocationMarker.value.addTo(map.value)
}

const initializeMap = () => {
  if (!mapRef.value || map.value) return

  map.value = new mapboxgl.Map({
    container: mapRef.value as HTMLElement,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: (props.center as [number, number]) || [6.82, 50.06],
    zoom: props.zoom || 3,
    projection: 'mercator',
  })

  // Disable click event and show the markers when initializing the map for summary view
  if (!props.correctLocation) {
    map.value.on('click', handleMapClick)
  }

  map.value.on('load', () => {
    if (props.correctLocation) {
      addCorrectLocationMarker(props.correctLocation)

      props.playerLocations.forEach((loc) => {
        addPlayerMarker([loc.lng, loc.lat], loc.avatarEmoji, loc.avatarBg)
      })
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
  playerMarkers.value.forEach((marker) => marker.remove())
})

const addPlayerMarkers = (
  locations: Array<{
    lat: number
    lng: number
    avatarEmoji: string
    avatarBg: string
    id: string
  }>,
) => {
  // Clear existing player markers first
  playerMarkers.value.forEach((marker) => marker.remove())
  playerMarkers.value = []

  // Add new player markers
  locations.forEach((loc) => {
    addPlayerMarker([loc.lng, loc.lat], loc.avatarEmoji, loc.avatarBg)
  })
}

defineExpose({
  showCorrectLocation,
  centerMapOnMarkers,
  removeMarkers,
  disableClicks,
  enableClicks,
  addPlayerMarkers,
})
</script>
