<template>
  <div ref="mapRef" class="h-full w-full rounded-4xl"></div>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, onUnmounted, ref } from 'vue';
import useUserQuery from '@/composables/useUserQuery';
import { getAvatarClass } from '@/utils';

const emit = defineEmits<{
  markerPlaced: [position: { lat: number, lng: number }]
  markerRemoved: []
}>();

const mapRef = ref<HTMLElement | null>(null);
const map = ref(null as maplibregl.Map | null);
const currentMarker = ref<maplibregl.Marker | null>(null);
const correctLocationMarker = ref<maplibregl.Marker | null>(null);

const { user } = useUserQuery();

const createAvatarMarker = () => {
  if (!user.value) return null;

  const markerElement = document.createElement('div');
  markerElement.className = `flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 border-white shadow-lg cursor-pointer ${getAvatarClass(user.value.avatarBg)}`;
  markerElement.innerHTML = user.value.avatarEmoji;

  return markerElement;
}

const handleMapClick = (e: maplibregl.MapMouseEvent) => {
  addMarkerToMap([e.lngLat.lng, e.lngLat.lat]);
};

const addMarkerToMap = (lngLat: [number, number]) => {
  if (!map.value || !user.value) return;

  if (currentMarker.value) {
    currentMarker.value.remove();
  }

  const markerElement = createAvatarMarker();
  if (!markerElement) return;

  currentMarker.value = new maplibregl.Marker({
    element: markerElement,
    anchor: 'center'
  }).setLngLat(lngLat);

  // @ts-expect-error maplibre type issue
  currentMarker.value.addTo(map.value);

  emit('markerPlaced', { lat: lngLat[1], lng: lngLat[0] });
}

const showCorrectLocation = (lngLat: [number, number]) => {
  if (!map.value) return;

  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove();
  }

  correctLocationMarker.value = new maplibregl.Marker({
    color: '#ef4444'
  }).setLngLat(lngLat);

  // @ts-expect-error maplibre type issue
  correctLocationMarker.value.addTo(map.value);
}

const centerMapOnMarkers = (userPos: [number, number], correctPos: [number, number], distance: number) => {
  if (!map.value) return;

  const centerLng = (userPos[0] + correctPos[0]) / 2;
  const centerLat = (userPos[1] + correctPos[1]) / 2;

  let zoom = 10;
  if (distance < 1) {
    zoom = 15;
  } else if (distance < 10) {
    zoom = 12;
  } else if (distance < 50) {
    zoom = 9;
  } else if (distance < 200) {
    zoom = 7;
  } else if (distance < 1000) {
    zoom = 5;
  } else if (distance < 5000) {
    zoom = 2;
  } else {
    zoom = 1;
  }

  map.value.flyTo({
    center: [centerLng, centerLat],
    zoom: zoom,
    duration: 1500
  });
}

const removeMarkers = () => {
  if (currentMarker.value) {
    currentMarker.value.remove();
    currentMarker.value = null;
  }
  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove();
    correctLocationMarker.value = null;
  }
}

const disableClicks = () => {
  if (!map.value) return;
  map.value.off('click', handleMapClick);
}

const enableClicks = () => {
  if (!map.value) return;
  map.value.on('click', handleMapClick);
}

const initializeMap = () => {
  if (!mapRef.value || map.value) return;

  map.value = new maplibregl.Map({
    container: mapRef.value as HTMLElement,
    style: {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '©<a href="https://www.openstreetmap.org/copyright/ja">OpenStreetMap</a> contributors',
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 19,
        }
      ],
      center: [6.82, 50.06],
      zoom: 3,
    },
  })

  map.value.on('click', handleMapClick);
}

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (currentMarker.value) {
    currentMarker.value.remove();
  }
  if (correctLocationMarker.value) {
    correctLocationMarker.value.remove();
  }
})

defineExpose({
  showCorrectLocation,
  centerMapOnMarkers,
  removeMarkers,
  disableClicks,
  enableClicks
});
</script>