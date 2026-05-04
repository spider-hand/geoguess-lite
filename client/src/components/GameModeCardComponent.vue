<template>
  <button
    type="button"
    :disabled="isDisabled"
    :class="[
      'relative flex flex-row items-center gap-4 rounded-lg p-4',
      isSelected ? 'bg-amber-50' : 'bg-slate-100 hover:bg-amber-50',
      isDisabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
    @click="emit('select')"
  >
    <div
      class="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-orange-600"
    >
      <component :is="icon" class="h-7 w-7 text-white" />
    </div>
    <div class="flex flex-col gap-2 text-start">
      <h3 :class="['font-[Roboto] font-bold', isSelected ? 'text-orange-900' : '']">{{ title }}</h3>
      <span class="text-muted-foreground font-[JetBrains_Mono]">{{ description }}</span>
    </div>
    <div v-if="isSelected" class="absolute top-2 right-2 rounded-full bg-orange-600 p-1">
      <Check class="h-3 w-3 text-white" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  title: string
  description: string
  icon: Component
  isSelected: boolean
  isDisabled: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>
