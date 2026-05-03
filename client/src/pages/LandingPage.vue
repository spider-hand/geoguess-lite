<template>
  <div>
    <section>
      <HeaderComponent />
      <div class="bg-linear-to-t from-cyan-100 to-white md:relative">
        <div
          class="flex flex-col gap-6 px-5 pt-10 pb-8 md:absolute md:top-12 md:left-[120px] md:gap-4 md:px-0 md:pt-0 md:pb-0"
        >
          <h1
            class="font-[JetBrains_Mono] text-4xl font-extrabold md:text-5xl"
            style="line-height: 150%"
          >
            Light-weight, <br />Subscription-free<br />GeoGuessr Experience
          </h1>
          <div class="flex flex-col gap-3 md:flex-row md:gap-4">
            <button
              class="flex h-10 items-center justify-center bg-orange-600 px-6 py-3 font-[JetBrains_Mono] text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1"
              data-testid="get-started-button"
              @click="
                currentUser
                  ? router.push({
                      name: 'game',
                    })
                  : signUpWithGoogle()
              "
              :disabled="!isCurrentUserLoaded"
            >
              Get Started
            </button>
            <button
              v-if="!currentUser"
              class="flex items-center justify-center font-[JetBrains_Mono] text-lg font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
              data-testid="continue-as-guest-button"
              @click="router.push({ name: 'game' })"
            >
              [Continue as Guest]
            </button>
          </div>
        </div>
        <img src="@/assets/images/hero.png" style="width: 100%" alt="Hero Image" />
      </div>
    </section>
    <section
      class="flex flex-col items-center gap-20 px-5 pt-20 pb-12 md:gap-32 md:px-16 md:pt-36 md:pb-20"
    >
      <h2 class="text-center font-[JetBrains_Mono] text-3xl font-medium md:text-4xl">
        Explore the world, no limits
      </h2>
      <div class="flex flex-col gap-10 md:flex-row md:items-end md:gap-16">
        <div class="flex flex-col gap-3 md:flex-1">
          <h3 class="text-3xl font-bold md:text-4xl">Play without limits</h3>
          <span class="text-muted-foreground font-[JetBrains_Mono] text-lg md:text-xl">
            GeoGuess Lite offers a full GeoGuessr-style experience without the usual restrictions,
            making it a free and accessible alternative for players who want to explore without
            limits.
          </span>
        </div>
        <div
          class="relative h-[280px] w-full overflow-hidden rounded-2xl bg-slate-100 p-5 md:h-[480px] md:w-[640px] md:flex-1 md:p-6"
        >
          <img
            src="@/assets/images/street-view-demo-1.png"
            class="absolute top-5 -right-16 h-[88%] w-auto max-w-none rounded-xl object-cover shadow-lg sm:-right-14 md:top-6 md:-right-28 md:h-[84%] lg:-right-20"
            alt="Street View Demo 1"
          />
          <div
            class="absolute -bottom-4 -left-5 w-[48%] max-w-40 overflow-hidden rounded-xl bg-white shadow-xl sm:-bottom-5 sm:-left-6 sm:max-w-48 md:-bottom-8 md:-left-10 md:max-w-60 lg:max-w-72"
          >
            <img
              src="@/assets/images/map-demo-1.png"
              class="h-full w-full object-cover"
              alt="Map Demo 1"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-10 md:flex-row md:items-end md:gap-16">
        <div
          class="relative h-[280px] w-full overflow-hidden rounded-2xl bg-slate-100 p-5 md:h-[480px] md:w-[640px] md:flex-1 md:p-6"
        >
          <img
            src="@/assets/images/map-demo-2.png"
            class="absolute top-5 -left-16 h-[88%] w-auto max-w-none rounded-xl object-cover shadow-lg sm:-left-14 md:top-6 md:-left-28 md:h-[84%] lg:-left-20"
            alt="Map Demo 2"
          />
          <div
            class="absolute -right-5 -bottom-4 w-[48%] max-w-40 overflow-hidden rounded-xl bg-white shadow-xl sm:-right-6 sm:-bottom-5 sm:max-w-48 md:-right-10 md:-bottom-8 md:max-w-60 lg:max-w-72"
          >
            <img
              src="@/assets/images/street-view-demo-2.png"
              class="h-full w-full object-cover"
              alt="Street View Demo 2"
            />
          </div>
        </div>
        <div class="flex flex-col gap-3 md:flex-1">
          <h3 class="text-3xl font-bold md:text-4xl">A variety of game modes to explore</h3>
          <span class="text-muted-foreground font-[JetBrains_Mono] text-lg md:text-xl">
            GeoGuess Lite offers a range of game modes similar to GeoGuessr, designed for different
            ways to play. From solo exploration to real-time multiplayer, you can challenge your
            friends, compete on the same location, and see who gets closest in a shared experience.
          </span>
        </div>
      </div>
    </section>
    <section
      class="grid grid-cols-1 gap-6 px-5 pt-12 pb-12 md:grid-cols-3 md:px-16 md:pt-16 md:pb-20"
    >
      <div class="flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
          <Feather class="h-7 w-7 text-white" />
        </div>
        <div class="flex flex-col gap-1">
          <h4 class="text-lg font-bold">No subscriptions, no paywalls</h4>
          <span class="text-muted-foreground font-[JetBrains_Mono] text-lg">
            GeoGuess Lite is designed to stay accessible without locking features behind
            subscriptions. You can play freely without creating an account or worrying about usage
            limits getting in the way.
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
          <Puzzle class="h-7 w-7 text-white" />
        </div>
        <div class="flex flex-col gap-1">
          <h4 class="text-lg font-bold">Open source and transparent</h4>
          <span class="text-muted-foreground font-[JetBrains_Mono] text-lg">
            GeoGuess Lite is built as an open source project, allowing anyone to explore, modify,
            and contribute. The code is fully accessible, giving you complete transparency and the
            freedom to run or adapt the experience in your own way.
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
          <Recycle class="h-7 w-7 text-white" />
        </div>
        <div class="flex flex-col gap-1">
          <h4 class="text-lg font-bold">Community driven and flexible</h4>
          <span class="text-muted-foreground font-[JetBrains_Mono] text-lg">
            Designed to be flexible and community driven, GeoGuess Lite can be self hosted and
            extended to fit different needs. Whether you want to play casually or build on top of
            it, the platform is open to your ideas.
          </span>
        </div>
      </div>
    </section>
    <section
      class="flex flex-col items-center justify-center gap-4 px-5 pt-12 pb-12 md:px-16 md:pt-16 md:pb-20"
    >
      <h2 class="text-center font-[JetBrains_Mono] text-3xl font-medium md:text-4xl">
        Featured in
      </h2>
      <img src="@/assets/images/mapillary.png" width="300" alt="Mapillary Logo" />
    </section>
    <section
      class="flex flex-col gap-8 px-5 pt-12 pb-12 md:flex-row md:items-start md:gap-16 md:px-16 md:pt-16 md:pb-20"
    >
      <div class="flex flex-col items-start gap-4 md:flex-1">
        <h2 class="font-[JetBrains_Mono] text-3xl font-medium md:text-4xl">Start exploring now</h2>
        <button
          class="flex h-10 items-center justify-center bg-orange-600 px-6 py-3 font-[JetBrains_Mono] text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>
      <span class="text-muted-foreground font-[JetBrains_Mono] text-lg md:flex-1 md:text-xl">
        Jump into GeoGuess Lite and begin exploring the world instantly. No sign up, no setup, just
        open the game and start playing.
      </span>
    </section>
    <footer
      class="flex flex-col gap-8 bg-slate-50 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-20 md:py-16"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <img src="@/assets/images/logo.svg" width="40" alt="GeoGuess Lite Logo" />
          <span class="font-[JetBrains_Mono] text-xl font-extrabold md:text-2xl"
            >GeoGuess Lite</span
          >
        </div>
        <span class="text-medium font-[JetBrains_Mono]"
          >© {{ new Date().getFullYear() }} GeoGuess Lite</span
        >
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        >
          [Terms]
        </button>
        <button
          class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        >
          [Privacy]
        </button>
        <button
          class="font-[JetBrains_Mono] text-base font-bold transition-all duration-300 hover:-translate-y-1 md:text-xl"
        >
          [Contact]
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/HeaderComponent.vue'
import { Feather, Puzzle, Recycle } from 'lucide-vue-next'
import useAuth from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle } = useAuth()
</script>
