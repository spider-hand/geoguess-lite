<template>
  <div class="container mx-auto max-w-4xl grow p-6">
    <div class="mb-8 text-center">
      <h1 class="mb-2 text-left font-[Roboto] text-4xl font-bold">Game Summary</h1>
      <p class="text-muted-foreground text-left font-[JetBrains_Mono] text-lg">
        Well played! Here's how you did.
      </p>
    </div>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="text-muted-foreground font-[Roboto]">Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-[JetBrains_Mono]"
              >{{ totalScore }} / {{ gameConfig.rounds * MAX_SCORE }}</span
            >
          </div>
          <Progress
            :model-value="(totalScore / (gameConfig.rounds * MAX_SCORE)) * 100"
            :max="gameConfig.rounds * MAX_SCORE"
            class="h-2"
          />
        </div>
      </CardContent>
    </Card>

    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Total Distance Off</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="font-[JetBrains_Mono] text-2xl font-bold">1,234km</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="font-[JetBrains_Mono] text-2xl font-bold">850</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Average Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="font-[JetBrains_Mono] text-2xl font-bold">1m 32s</div>
        </CardContent>
      </Card>
    </div>

    <div class="mb-6">
      <h2 class="mb-4 font-[Roboto] text-2xl font-bold">Round Breakdown</h2>
      <Accordion type="single" collapsible>
        <AccordionItem v-for="round in gameConfig.rounds" :key="round" :value="`round-${round}`">
          <AccordionTrigger class="flex items-center font-[Roboto] text-xl"
            >Round {{ round }}</AccordionTrigger
          >
          <AccordionContent>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div class="h-64">
                <MapComponent />
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
      <Button @click="$emit('play-again')" class="rounded-none font-[JetBrains_Mono] text-lg">
        Play Again
      </Button>
      <Button
        @click="$emit('return-to-menu')"
        variant="ghost"
        class="font-[JetBrains_Mono] text-lg"
      >
        Return to Main Menu
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useGameConfigStore from '@/stores/gameConfig'
import MapComponent from './MapComponent.vue'
import StreetViewComponent from './StreetViewComponent.vue'
import Accordion from './ui/accordion/Accordion.vue'
import AccordionContent from './ui/accordion/AccordionContent.vue'
import AccordionItem from './ui/accordion/AccordionItem.vue'
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardHeader from './ui/card/CardHeader.vue'
import CardTitle from './ui/card/CardTitle.vue'
import { MAX_SCORE } from '@/consts'
import Button from './ui/button/Button.vue'

const gameConfig = useGameConfigStore()

defineProps({
  totalScore: {
    type: Number,
    required: true,
  },
})

defineEmits(['play-again', 'return-to-menu'])
</script>
