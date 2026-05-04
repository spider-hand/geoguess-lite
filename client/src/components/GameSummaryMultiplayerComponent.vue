<template>
  <div class="container mx-auto max-w-4xl grow p-6">
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-left font-[Roboto] text-4xl font-bold">Game Summary</h1>
      <p class="text-muted-foreground text-left font-[JetBrains_Mono] text-lg">
        Well played! Here's how everyone did.
      </p>
    </div>

    <div class="mb-6 flex flex-col gap-4 rounded-xl bg-slate-50 px-6 py-6">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
        <Trophy class="h-7 w-7 text-white" />
      </div>
      <div class="flex flex-col gap-3">
        <div>
          <h2 class="font-[JetBrains_Mono] text-lg font-bold">Final Results</h2>
        </div>
        <div class="space-y-3">
          <div
            v-for="(player, index) in sortedPlayers"
            :key="player.id"
            class="flex items-center justify-between rounded-lg bg-white p-4"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div
                data-testid="player-rank"
                class="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full font-[JetBrains_Mono] text-sm font-bold"
                :class="index === 0 ? 'bg-orange-600 text-white' : 'bg-slate-100'"
              >
                {{ index + 1 }}
              </div>
              <div
                class="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full border text-lg"
                :class="player.avatarClass"
              >
                {{ player.emoji }}
              </div>
              <span
                data-testid="player-name"
                class="truncate font-[JetBrains_Mono] text-lg font-medium"
              >
                {{ player.name }}
              </span>
            </div>
            <div class="text-right">
              <div class="font-[JetBrains_Mono] text-lg font-bold">{{ player.score }} points</div>
              <div class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                {{ formatDistance(player.distance, props.distanceUnit) }} off
              </div>
            </div>
          </div>
        </div>
      </div>
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
            <div class="flex items-center gap-2">
              <span class="font-[JetBrains_Mono] text-xl">Round {{ record.round }}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="space-y-6">
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

              <div class="flex flex-col gap-2">
                <div
                  v-for="player in record.playerResults"
                  :key="player.id"
                  class="flex items-center justify-between rounded bg-slate-50 p-3"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
                      :class="player.avatarClass"
                    >
                      {{ player.emoji }}
                    </div>
                    <span class="font-[JetBrains_Mono] text-sm font-medium">{{ player.name }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-[JetBrains_Mono] text-sm font-bold">
                      {{ player.score }} points
                    </div>
                    <div class="text-muted-foreground font-[JetBrains_Mono] text-xs">
                      {{ formatDistance(player.distance, props.distanceUnit) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="flex justify-center gap-4">
      <Button
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
import Accordion from './ui/accordion/Accordion.vue'
import AccordionContent from './ui/accordion/AccordionContent.vue'
import AccordionItem from './ui/accordion/AccordionItem.vue'
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue'
import Button from './ui/button/Button.vue'
import type { MultiplayerRoundRecord, PlayerResult } from '@/types'
import { formatDistance } from '@/utils'
import type { UserDistanceUnitEnum } from '@/services/models'
import { Trophy } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    players: PlayerResult[]
    gameRecords: MultiplayerRoundRecord[]
    distanceUnit?: UserDistanceUnitEnum
  }>(),
  {
    distanceUnit: 'km',
  },
)

// Track which rounds have been opened for lazy loading the content
const openedRounds = ref<Set<string>>(new Set())

const onAccordionChange = (value: string | string[] | undefined) => {
  openedRounds.value.add(value as string)
}

const sortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => b.score - a.score)
})

defineEmits(['return-to-menu'])
</script>
