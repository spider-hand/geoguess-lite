<template>
  <div ref="viewerRef" class="absolute! top-0 left-0 w-[50%] h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Viewer } from "mapillary-js";

const viewer = ref<Viewer | null>(null);
const viewerRef = ref<HTMLElement | null>(null);

const getRandomLatLng = () => {
  const lat = Math.random() * 170 - 85
  const lng = Math.random() * 360 - 180
  return { lat, lng };
}

const buildBBox = (lat: number, lng: number) => {
  const offset = 0.01;
  const minLat = lat - offset;
  const maxLat = lat + offset;
  const minLng = lng - offset;
  const maxLng = lng + offset;
  return `${minLng},${minLat},${maxLng},${maxLat}`;
}

const getRandomImageId = async () => {
  try {
    const { lat, lng } = getRandomLatLng();
    const bbox = buildBBox(lat, lng);
    const response = await fetch(`https://graph.mapillary.com/images?access_token=${import.meta.env.VITE_MAPILLARY_TOKEN}&fields=id&bbox=${bbox}&limit=50`);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.length);
      return data.data[randomIndex].id;
    }
    return await getRandomImageId();
  } catch (err) {
    console.error('Error in getRandomImageId:', err);
    throw err;
  }
}

const loadRandomView = async () => {
  try {
    if (!viewer.value) return;

    const imageId = await getRandomImageId();
    await viewer.value.moveTo(imageId);

    const pos = await viewer.value.getPosition();
    console.log(`Loaded image at lat: ${pos.lat}, lng: ${pos.lng}`);
  } catch (err) {
    console.error('Error in loadRandomView:', err);
    throw err;
  }
}

onMounted(async () => {
  try {
    if (!viewerRef.value) return;

    viewer.value = new Viewer({
      container: viewerRef.value,
      accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
    });

    await loadRandomView();
  } catch (err) {
    console.error('Error loading Mapillary view:', err);
  }
});
</script>
