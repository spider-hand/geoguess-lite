<template>
  <div class="flex-1 lg:w-2/3 min-h-[40vh] lg:min-h-0 rounded-4xl relative">
    <div ref="viewerRef" class="h-full w-full rounded-4xl"></div>
    <div v-if="showResult" class="absolute inset-0 flex items-center justify-center">
      <div class="bg-black opacity-80 rounded-lg px-8 py-6 shadow-lg text-center">
        <div class="font-[JetBrains_Mono] text-2xl font-bolds text-white">{{ resultScore }} points</div>
        <div class="font-[JetBrains_Mono] text-lg mt-2 text-gray-300">
          {{ resultDistance === -1 ? 'Time\'s up! No guess made.' : `You were ${resultDistance}km away!` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Viewer } from "mapillary-js";

const emit = defineEmits<{
  imageLoaded: [position: { lat: number, lng: number }]
  imageLoadingStart: []
}>();

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
  }
});

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
    return "524779645570864"
    // return await getRandomImageId();
  } catch (err) {
    console.error('Error in getRandomImageId:', err);
    throw err;
  }
}

const loadRandomView = async () => {
  try {
    if (!viewer.value) return;

    emit('imageLoadingStart');
    const imageId = await getRandomImageId();
    await viewer.value.moveTo(imageId);

    const pos = await viewer.value.getPosition();
    console.log(`Loaded image at lat: ${pos.lat}, lng: ${pos.lng}`);

    emit('imageLoaded', { lat: pos.lat, lng: pos.lng });
  } catch (err) {
    console.error('Error in loadRandomView:', err);
    throw err;
  }
}

defineExpose({
  loadRandomView
});

const initViewer = async () => {
  try {
    if (!viewerRef.value || viewer.value) return;

    viewer.value = new Viewer({
      container: viewerRef.value,
      accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
      component: {
        pointer: props.allowZooming,
        sequence: props.allowMoving,
        direction: props.allowMoving,
        zoom: props.allowZooming,
      }
    });

    await loadRandomView();
  } catch (err) {
    console.error('Error loading Mapillary view:', err);
  }
};

onMounted(async () => {
  await initViewer();
});
</script>
