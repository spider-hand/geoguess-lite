<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-8 py-4">
      <div class="font-[JetBrains_Mono] text-xl font-semibold">Round 1 / 5</div>
      <nav class="flex gap-4">
        <div class="text-muted-foreground font-[JetBrains_Mono] text-lg px-4 py-2 h-9">
          [Time: 02:45]
        </div>
        <div class="text-muted-foreground font-[JetBrains_Mono] text-lg px-4 py-2 h-9">
          [Score: 5000]
        </div>
      </nav>
    </header>
    <main class="grow flex flex-col lg:flex-row gap-6 p-6 sm:p-8">
      <StreetViewComponent />
      <div class="flex flex-col lg:w-1/3 lg:max-w-md gap-6">
        <MapComponent />
        <Button
          class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
          Make Guess
        </Button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import MapComponent from '@/components/MapComponent.vue';
import StreetViewComponent from '@/components/StreetViewComponent.vue';
import Button from '@/components/ui/button/Button.vue';

</script>
