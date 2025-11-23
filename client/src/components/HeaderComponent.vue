<template>
  <header class="flex items-center justify-between border-b px-8 py-4">
    <button class="cursor-pointer font-[JetBrains_Mono] text-xl font-semibold" @click="router.push('/')">Geoguess
      Lite</button>
    <nav class="flex gap-4">
      <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg">
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
</script>