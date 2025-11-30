<template>
  <Card :class="`${bgClass}`">
    <CardHeader>
      <div class="flex items-center gap-3">
        <div
          :class="`mb-2 flex h-10 w-10 items-center justify-center rounded-xl border ${emojiClass} p-2 text-2xl`"
        >
          {{ emoji }}
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

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
  bgClass: {
    type: String,
    required: true,
  },
  emojiClass: {
    type: String,
    required: true,
  },
})
</script>
