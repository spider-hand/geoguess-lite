<template>
  <header class="flex h-15 items-center justify-between px-5 md:px-8">
    <button class="flex items-center gap-2" @click="router.push('/')">
      <img src="@/assets/images/logo.svg" width="40" alt="GeoGuess Lite Logo" />
      <span class="font-[JetBrains_Mono] text-xl font-extrabold md:text-2xl">GeoGuess Lite</span>
    </button>
    <nav class="flex items-center gap-2">
      <button
        class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        @click="openGithub"
      >
        [Github]
      </button>
      <button
        v-if="isCurrentUserLoaded && !currentUser"
        data-testid="sign-up-button"
        class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        @click="signUpWithGoogle"
      >
        [Sign Up]
      </button>
      <button
        v-if="isCurrentUserLoaded && currentUser"
        data-testid="sign-out-button"
        class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        @click="signOut"
      >
        [Sign Out]
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import useAuth from '@/composables/useAuth'

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle, signOut } = useAuth()

const openGithub = () => {
  window.open('https://github.com/spider-hand/geoguess-lite', '_blank')
}
</script>
