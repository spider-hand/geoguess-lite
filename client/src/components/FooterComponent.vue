<template>
  <footer class="bg-gray-50 px-8 py-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div class="font-[JetBrains_Mono] text-xl font-semibold">Geoguess Lite</div>
        <nav class="flex gap-4">
          <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[Roboto] text-base">
            Github
          </Button>
          <Button v-if="isCurrentUserLoaded && !currentUser" variant="ghost"
            class="text-muted-foreground cursor-pointer font-[Roboto] text-base" @click="signUpWithGoogle">
            Sign Up
          </Button>
          <Button v-else variant="ghost" class="text-muted-foreground cursor-pointer font-[Roboto] text-base"
            @click="signOut">
            Sign Out
          </Button>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import useAuth from '@/composables/useAuth';

const { currentUser, isCurrentUserLoaded, signUpWithGoogle, signOut } = useAuth();
</script>