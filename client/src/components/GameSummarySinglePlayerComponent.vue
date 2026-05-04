<template>
  <div class="container mx-auto max-w-4xl grow p-6">
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-left font-[Roboto] text-4xl font-bold">Game Summary</h1>
      <p class="text-muted-foreground text-left font-[JetBrains_Mono] text-lg">
        Well played! Here's how you did.
      </p>
    </div>

    <div class="mb-6 flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
        <Target class="h-7 w-7 text-white" />
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="font-[Roboto] text-lg font-bold">Score</h2>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-[JetBrains_Mono] text-lg"
              >{{ totalScore }} / {{ ROUNDS * MAX_SCORE }}</span
            >
          </div>
          <Progress
            :model-value="(totalScore / (ROUNDS * MAX_SCORE)) * 100"
            :max="ROUNDS * MAX_SCORE"
            class="h-2 [&>div]:bg-orange-600"
          />
        </div>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCardComponent title="Total Distance Off" :value="totalDistance" :icon="MapPinned" />
      <SummaryCardComponent
        title="Average Score"
        :value="`${averageScore} points`"
        :icon="ChartColumnBig"
      />
      <SummaryCardComponent title="Average Time" :value="averageTime" :icon="Timer" />
    </div>

    <div class="mb-6">
      <h2 class="mb-4 font-[Roboto] text-2xl font-bold">Round Breakdown</h2>
      <Accordion
        type="single"
        collapsible
        :unmount-on-hide="false"
        @update:model-value="onAccordionChange"
      >
        <AccordionItem v-for="record in gameRecords" :key="record.round" :value="`${record.round}`">
          <AccordionTrigger class="flex items-center">
            <div class="flex items-center gap-4">
              <span class="font-[JetBrains_Mono] text-xl">Round {{ record.round }}</span>
              <span class="text-muted-foreground font-[JetBrains_Mono] text-xl"
                >({{ record.score }} points)</span
              >
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div class="h-64">
                <MapComponent
                  v-if="openedRounds.has(`${record.round}`)"
                  :player-locations="record.playerLocations"
                  :correct-location="record.correctLocation"
                  :center="record.mapCenter"
                  :zoom="record.mapZoom"
                />
              </div>
              <div class="flex h-64 flex-col">
                <StreetViewComponent
                  v-if="openedRounds.has(`${record.round}`)"
                  class="h-full! min-h-full! w-full! flex-1!"
                  :allow-moving="false"
                  :allow-zooming="false"
                  :image-id="record.imageId"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="flex justify-center gap-4">
      <Button
        v-if="isPlayAgainEnabled"
        data-testid="play-again-button"
        @click="$emit('play-again')"
        class="rounded-none font-[JetBrains_Mono] text-lg"
      >
        Play Again
      </Button>
      <Button
        data-testid="return-to-menu-button"
        @click="$emit('return-to-menu')"
        variant="ghost"
        class="text-muted-foreground rounded-none font-[JetBrains_Mono] text-lg"
      >
        [Return to Main Menu]
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MapComponent from './MapComponent.vue'
import StreetViewComponent from './StreetViewComponent.vue'
import SummaryCardComponent from './SummaryCardComponent.vue'
import Accordion from './ui/accordion/Accordion.vue'
import AccordionContent from './ui/accordion/AccordionContent.vue'
import AccordionItem from './ui/accordion/AccordionItem.vue'
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue'
import { MAX_SCORE, ROUNDS } from '@/consts'
import Button from './ui/button/Button.vue'
import Progress from './ui/progress/Progress.vue'
import type { RoundRecord } from '@/types'
import { formatDistance } from '@/utils'
import type { UserDistanceUnitEnum } from '@/services/models'
import { Target, MapPinned, ChartColumnBig, Timer } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    totalScore: number
    averageScore: number
    gameRecords: RoundRecord[]
    isPlayAgainEnabled?: boolean
    distanceUnit?: UserDistanceUnitEnum
  }>(),
  {
    isPlayAgainEnabled: true,
    distanceUnit: 'km',
  },
)

// Track which rounds have been opened for lazy loading the content
const openedRounds = ref<Set<string>>(new Set())

const onAccordionChange = (value: string | string[] | undefined) => {
  openedRounds.value.add(value as string)
}

const totalDistance = computed(() => {
  if (props.gameRecords.length === 0) return formatDistance(0, props.distanceUnit)

  const sum = props.gameRecords.reduce((acc, record) => {
    return record.distance >= 0 ? acc + record.distance : acc
  }, 0)

  return formatDistance(Math.round(sum), props.distanceUnit)
})

const averageTime = computed(() => {
  return 'N/A'
})

defineEmits(['play-again', 'return-to-menu'])
</script>
