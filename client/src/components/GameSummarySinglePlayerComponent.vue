<template>
  <div class="container mx-auto max-w-4xl grow p-6">
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-left font-[Roboto] text-4xl font-bold">Game Summary</h1>
      <p class="text-muted-foreground text-left font-[JetBrains_Mono] text-lg">
        Well played! Here's how you did.
      </p>
    </div>

    <Card class="mb-6 border-indigo-100 bg-indigo-50">
      <CardHeader>
        <div class="flex items-center gap-3">
          <div
            class="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-100 p-2 text-2xl"
          >
            🎯
          </div>
          <CardTitle class="text-muted-foreground font-[Roboto]">Score</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-[JetBrains_Mono]">{{ totalScore }} / {{ ROUNDS * MAX_SCORE }}</span>
          </div>
          <Progress
            :model-value="(totalScore / (ROUNDS * MAX_SCORE)) * 100"
            :max="ROUNDS * MAX_SCORE"
            class="h-2 [&>div]:bg-indigo-700"
          />
        </div>
      </CardContent>
    </Card>

    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCardComponent
        title="Total Distance Off"
        :value="totalDistance"
        emoji="📍"
        bg-class="bg-red-50 border-red-100"
        emoji-class="bg-red-100 border-red-200"
      />
      <SummaryCardComponent
        title="Average Score"
        :value="`${averageScore} points`"
        emoji="📊"
        bg-class="bg-emerald-50 border-emerald-100"
        emoji-class="bg-emerald-100 border-emerald-200"
      />
      <SummaryCardComponent
        title="Average Time"
        :value="averageTime"
        emoji="⏱️"
        bg-class="bg-amber-50 border-amber-100"
        emoji-class="bg-amber-100 border-amber-200"
      />
    </div>

    <div class="mb-6">
      <h2 class="mb-4 font-[Roboto] text-2xl font-bold">Round Breakdown</h2>
      <Accordion type="single" collapsible>
        <AccordionItem
          v-for="record in gameRecords"
          :key="record.round"
          :value="`round-${record.round}`"
        >
          <AccordionTrigger class="flex items-center">
            <div class="flex items-center gap-2">
              <span class="font-[Roboto] text-xl">Round {{ record.round }}</span>
              <span class="text-muted-foreground">{{ record.score }} points</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div class="h-64">
                <MapComponent
                  :player-location="record.playerLocation"
                  :correct-location="record.correctLocation"
                  :center="record.mapCenter"
                  :zoom="record.mapZoom"
                />
              </div>
              <div class="flex h-64 flex-col">
                <StreetViewComponent
                  class="h-full! min-h-full! w-full! flex-1!"
                  :allow-moving="false"
                  :allow-zooming="false"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="flex justify-center gap-4">
      <Button
        @click="$emit('play-again')"
        class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg"
      >
        Play Again
      </Button>
      <Button
        @click="$emit('return-to-menu')"
        variant="ghost"
        class="text-muted-foreground cursor-pointer rounded-none font-[JetBrains_Mono] text-lg"
      >
        [Return to Main Menu]
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import MapComponent from './MapComponent.vue'
import StreetViewComponent from './StreetViewComponent.vue'
import SummaryCardComponent from './SummaryCardComponent.vue'
import Accordion from './ui/accordion/Accordion.vue'
import AccordionContent from './ui/accordion/AccordionContent.vue'
import AccordionItem from './ui/accordion/AccordionItem.vue'
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardHeader from './ui/card/CardHeader.vue'
import CardTitle from './ui/card/CardTitle.vue'
import { MAX_SCORE, ROUNDS } from '@/consts'
import Button from './ui/button/Button.vue'
import Progress from './ui/progress/Progress.vue'
import type { RoundRecord } from '@/types'

const props = defineProps({
  totalScore: {
    type: Number,
    required: true,
  },
  averageScore: {
    type: Number,
    required: true,
  },
  gameRecords: {
    type: Array as PropType<RoundRecord[]>,
    required: true,
  },
})

const totalDistance = computed(() => {
  if (props.gameRecords.length === 0) return '0km'

  const sum = props.gameRecords.reduce((acc, record) => {
    return record.distance >= 0 ? acc + record.distance : acc
  }, 0)

  return `${Math.round(sum)}km`
})

const averageTime = computed(() => {
  return 'N/A'
})

defineEmits(['play-again', 'return-to-menu'])
</script>
