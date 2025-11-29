<template>
  <header class="flex items-center justify-between border-b px-8 py-4">
    <button class="flex flex-row items-center gap-2 cursor-pointer font-[JetBrains_Mono] text-xl font-semibold"
      @click="router.push('/')">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 144 144" fill="none">
        <circle cx="72" cy="72" r="72" fill="#A5B4FC" />
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M113.143 64.5714C113.143 41.6122 94.5307 23 71.5714 23C48.6122 23 30 41.6122 30 64.5714C30 70.255 31.1406 75.6722 33.2054 80.6066C41.7693 103.989 71.7899 120 71.7899 120C71.7899 120 108.667 100.332 112.337 72.7593C112.866 70.1121 113.143 67.3742 113.143 64.5714Z"
          fill="white" />
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M106.513 72.064L106.475 72.2549L106.45 72.4479C104.913 84.1225 96.2031 94.8186 86.8041 103.03C82.2243 107.031 77.7332 110.224 74.3826 112.416C73.4092 113.053 72.5362 113.603 71.7901 114.061C71.2943 113.757 70.7424 113.412 70.1421 113.028C67.3382 111.233 63.512 108.604 59.4405 105.28C51.1431 98.5055 42.507 89.3905 38.7821 79.1086L38.7359 78.9811L38.684 78.8559C36.9177 74.5883 35.939 69.8985 35.939 64.9623C35.939 45.067 51.8922 28.9387 71.5716 28.9387C91.251 28.9387 107.204 45.067 107.204 64.9623C107.204 67.3988 106.966 69.7729 106.513 72.064Z"
          fill="#F97316" />
        <path
          d="M87.4083 64.5714C87.4083 55.825 80.318 48.7346 71.5716 48.7346C62.8252 48.7346 55.7349 55.825 55.7349 64.5714C55.7349 73.3177 62.8252 80.4081 71.5716 80.4081C80.318 80.4081 87.4083 73.3177 87.4083 64.5714Z"
          fill="#FDE047" />
      </svg>
      Geoguess
      Lite</button>
    <nav class="flex gap-4">
      <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg"
        @click="openGithub">
        [Github]
      </Button>
      <Button v-if="isCurrentUserLoaded && !currentUser"
        class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
        @click="signUpWithGoogle">
        Sign Up
      </Button>
      <Button v-else variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg"
        @click="signOut">
        [Sign Out]
      </Button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from './ui/button/Button.vue';
import useAuth from '@/composables/useAuth';

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle, signOut } = useAuth();

const openGithub = () => {
  window.open('https://github.com/spider-hand/geoguess-lite', '_blank')
}
</script>