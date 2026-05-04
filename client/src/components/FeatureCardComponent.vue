<template>
  <div class="flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
      <component :is="icon" class="h-7 w-7 text-white" />
    </div>
    <div class="flex flex-col gap-1">
      <h4 class="font-[Roboto] text-lg font-bold">{{ title }}</h4>
      <span class="text-muted-foreground font-[JetBrains_Mono] text-lg">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description: string
  icon: Component
}>()
</script>
