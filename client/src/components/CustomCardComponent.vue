<template>
  <Card
    :class="`${bgClass} h-full cursor-pointer border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`"
  >
    <CardContent :class="`${contentAlign} flex h-full flex-col justify-between`">
      <div class="flex" :class="iconAlign">
        <div
          :class="`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border p-2 ${iconClass}`"
        >
          <component :is="icon" class="h-6 w-6" />
        </div>
      </div>
      <CardTitle :class="`mb-2 font-[Roboto] text-xl`">
        {{ title }}
      </CardTitle>
      <CardDescription :class="`text-muted-foreground font-[JetBrains_Mono] text-lg`">
        {{ description }}
      </CardDescription>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    title: string
    description: string
    icon: Component
    bgClass: string
    iconClass: string
    contentAlign?: string
    iconAlign?: string
  }>(),
  {
    contentAlign: 'text-center',
    iconAlign: 'justify-center',
  },
)
</script>
