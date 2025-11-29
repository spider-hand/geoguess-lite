<template>
  <div ref="mapRef" class="h-full w-full rounded-4xl"></div>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, onUnmounted, ref } from 'vue';
import useUserQuery from '@/composables/useUserQuery';
import { AVATAR_CLASS_MAP } from '@/consts';

const mapRef = ref<HTMLElement | null>(null);
const map = ref(null as maplibregl.Map | null);
const currentMarker = ref<maplibregl.Marker | null>(null);

const { user } = useUserQuery();

const getAvatarClass = (avatarBg?: string) => {
  return avatarBg ? AVATAR_CLASS_MAP[avatarBg] ?? "" : ""
}

const createAvatarMarker = () => {
  if (!user.value) return null;

  const markerElement = document.createElement('div');
  markerElement.className = `flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 border-white shadow-lg cursor-pointer ${getAvatarClass(user.value.avatarBg)}`;
  markerElement.innerHTML = user.value.avatarEmoji;
  
  return markerElement;
}

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

  map.value.on('click', (e) => {
    addMarkerToMap([e.lngLat.lng, e.lngLat.lat]);
  });
}

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (currentMarker.value) {
    currentMarker.value.remove();
  }
})
</script>