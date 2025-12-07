<template>
  <div class="container mx-auto max-w-4xl grow p-6">
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-left font-[Roboto] text-4xl font-bold">Game Summary</h1>
      <p class="text-muted-foreground text-left font-[JetBrains_Mono] text-lg">
        Well played! Here's how everyone did.
      </p>
    </div>

    <Card class="mb-6 border">
      <CardContent class="flex flex-col gap-8">
        <div>
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl"
          >
            🏆
          </div>
          <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">Leaderboard</h2>
          <p class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-base">Final rankings</p>
        </div>
        <div class="space-y-3">
          <div
            v-for="(player, index) in sortedPlayers"
            :key="player.id"
            class="flex items-center justify-between rounded border bg-white p-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full font-[JetBrains_Mono] text-sm font-bold"
              >
                {{ index + 1 }}
              </div>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border text-lg"
                :class="player.avatarClass"
              >
                {{ player.emoji }}
              </div>
              <span class="font-[Roboto] text-lg font-medium">{{ player.name }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="font-[JetBrains_Mono] text-lg font-bold">{{ player.score }} points</div>
                <div class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                  {{ player.distance }}km off
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

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
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="space-y-6">
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div class="h-64">
                  <MapComponent
                    :player-locations="record.playerLocations"
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
                    :image-id="record.imageId"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div
                  v-for="player in record.playerResults"
                  :key="player.id"
                  class="flex items-center justify-between rounded border p-3"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full border text-sm"
                      :class="player.avatarClass"
                    >
                      {{ player.emoji }}
                    </div>
                    <span class="font-[JetBrains_Mono] text-sm">{{ player.name }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-[JetBrains_Mono] text-sm font-bold">
                      {{ player.score }} points
                    </div>
                    <div class="text-muted-foreground font-[JetBrains_Mono] text-xs">
                      {{ player.distance }}km
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
import Accordion from './ui/accordion/Accordion.vue'
import AccordionContent from './ui/accordion/AccordionContent.vue'
import AccordionItem from './ui/accordion/AccordionItem.vue'
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import Button from './ui/button/Button.vue'
import type { MultiplayerRoundRecord, PlayerResult } from '@/types'

const props = defineProps({
  players: {
    type: Array as PropType<PlayerResult[]>,
    required: true,
  },
  gameRecords: {
    type: Array as PropType<MultiplayerRoundRecord[]>,
    required: true,
  },
})

const sortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => b.score - a.score)
})

defineEmits(['return-to-menu'])
</script>
