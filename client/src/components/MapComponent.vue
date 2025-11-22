<template>
  <div ref="mapRef" class="absolute! top-0 right-0 w-[50%] h-full"></div>
</template>

<script setup lang="ts">
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref } from 'vue';

const mapRef = ref<HTMLElement | null>(null);
const map = ref<maplibregl.Map | null>(null);

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
}

onMounted(() => {
  initializeMap()
})
</script>