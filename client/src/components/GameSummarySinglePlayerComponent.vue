<template>
  <div class="grow container mx-auto p-6 max-w-4xl">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 text-left font-[Roboto]">Game Summary</h1>
      <p class="text-lg text-left text-muted-foreground font-[JetBrains_Mono]">Well played! Here's how you did.</p>
    </div>

    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="font-[Roboto] text-muted-foreground">Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-[JetBrains_Mono]">{{ totalScore }} / {{ gameConfig.rounds * MAX_SCORE }}</span>
          </div>
          <Progress :model-value="(totalScore / (gameConfig.rounds * MAX_SCORE)) * 100"
            :max="gameConfig.rounds * MAX_SCORE" class="h-2" />
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Total Distance Off</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold font-[JetBrains_Mono]">1,234km</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold font-[JetBrains_Mono]">850</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-muted-foreground font-[Roboto]">Average Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold font-[JetBrains_Mono]">1m 32s</div>
        </CardContent>
      </Card>
    </div>

    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4 font-[Roboto]">Round Breakdown</h2>
      <Accordion type="single" collapsible>
        <AccordionItem v-for="round in gameConfig.rounds" :key="round" :value="`round-${round}`">
          <AccordionTrigger class="flex items-center text-xl font-[Roboto]">Round {{ round }}</AccordionTrigger>
          <AccordionContent>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="h-64">
                <MapComponent />
              </div>
              <div class="h-64 flex flex-col">
                <StreetViewComponent class="min-h-full! h-full! flex-1! w-full!" :allow-moving="false"
                  :allow-zooming="false" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <div class="flex gap-4 justify-center">
      <Button @click="$emit('play-again')" class="font-[JetBrains_Mono] text-lg rounded-none">
        Play Again
      </Button>
      <Button @click="$emit('return-to-menu')" variant="ghost" class="font-[JetBrains_Mono] text-lg">
        Return to Main Menu
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useGameConfigStore from '@/stores/gameConfig';
import MapComponent from './MapComponent.vue';
import StreetViewComponent from './StreetViewComponent.vue';
import Accordion from './ui/accordion/Accordion.vue';
import AccordionContent from './ui/accordion/AccordionContent.vue';
import AccordionItem from './ui/accordion/AccordionItem.vue';
import AccordionTrigger from './ui/accordion/AccordionTrigger.vue';
import Card from './ui/card/Card.vue';
import CardContent from './ui/card/CardContent.vue';
import CardHeader from './ui/card/CardHeader.vue';
import CardTitle from './ui/card/CardTitle.vue';
import { MAX_SCORE } from '@/consts';
import Button from './ui/button/Button.vue';

const gameConfig = useGameConfigStore();

defineProps({
  totalScore: {
    type: Number,
    required: true,
  },
});

defineEmits(['play-again', 'return-to-menu']);
</script>