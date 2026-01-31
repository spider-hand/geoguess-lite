<template>
  <Card :class="`${bgClass}`">
    <CardHeader>
      <div class="flex items-center gap-3">
        <div
          :class="`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass} p-2`"
        >
          <component :is="icon" class="h-5 w-5" />
        </div>
        <CardTitle class="text-muted-foreground font-[Roboto]">{{ title }}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div class="font-[JetBrains_Mono] text-2xl font-bold">{{ value }}</div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardHeader from './ui/card/CardHeader.vue'
import CardTitle from './ui/card/CardTitle.vue'
import type { Component } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  icon: {
    type: Object as () => Component,
    required: true,
  },
  bgClass: {
    type: String,
    required: true,
  },
  iconClass: {
    type: String,
    required: true,
  },
})
</script>
