<template>
  <Card
    :class="`${bgClass} h-full cursor-pointer border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`"
  >
    <CardContent :class="`${contentAlign} flex h-full flex-col justify-between`">
      <div class="flex" :class="iconAlign">
        <div
          :class="`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border p-2 text-3xl ${emojiClass}`"
        >
          {{ emoji }}
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

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
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
  contentAlign: {
    type: String,
    default: 'text-center',
  },
  iconAlign: {
    type: String,
    default: 'justify-center',
  },
})
</script>
