<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-8 py-4">
      <div class="font-[JetBrains_Mono] text-xl font-semibold">Geoguess Lite</div>
      <nav class="flex gap-4">
        <Button variant="ghost" class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg">
          [Github]
        </Button>
      </nav>
    </header>
    <main class="flex flex-col gap-8 p-8 bg-gray-50">
      <div class="flex flex-col items-center text-center gap-2">
        <h1 class="font-[JetBrains_Mono] text-4xl font-bold lg:text-5xl">
          Start New Game
        </h1>
        <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
          Select a game mode to begin
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="(mode, index) in gameModes" :key="index"
          :class="`${mode.class} border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`">
          <CardContent class="text-center">
            <div class="flex justify-center">
              <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border text-4xl"
                :class="mode.emojiClass">
                {{ mode.emoji }}
              </div>
            </div>
            <CardTitle class="font-[Roboto] text-xl">
              {{ mode.title }}
            </CardTitle>
            <CardDescription class="text-muted-foreground font-[JetBrains_Mono] text-base">
              {{ mode.description }}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <Card class="border">
        <CardContent class="flex flex-col gap-8">
          <div>
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl">
              ⚙️
            </div>
            <h2 class="font-[Roboto] text-2xl font-semibold text-foreground">Game Configuration</h2>
            <p class="text-muted-foreground font-[JetBrains_Mono] text-base mt-1">
              Customize your game experience
            </p>
          </div>
          <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="font-[Roboto] text-lg font-semibold text-foreground">Maps</h3>
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-[JetBrains_Mono] text-base font-medium text-foreground">
                  Map Type
                </label>
                <Select v-model="mapType">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select map type" class="font-[JetBrains_Mono]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="world" class="font-[JetBrains_Mono]">World</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="font-[Roboto] text-lg font-semibold text-foreground">Rounds & Time</h3>
              </div>
              <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                  <div>
                    <label class="font-[JetBrains_Mono] text-base font-medium text-foreground">
                      Number of Rounds
                    </label>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div>
                      <Slider v-model="roundsSliderValue" :min="5" :max="10" :step="1" class="w-full"
                        @update:model-value="(value) => rounds = value?.[0] ?? 5" />
                    </div>
                    <div class="flex justify-between text-sm text-muted-foreground font-[JetBrains_Mono]">
                      <span>5</span>
                      <span class="font-medium text-foreground">{{ rounds }} rounds</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div>
                    <label class="font-[JetBrains_Mono] text-base font-medium text-foreground">
                      Time Limit Per Round
                    </label>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div>
                      <Slider v-model="timeLimitSliderValue" :min="0" :max="300" :step="60" class="w-full"
                        @update:model-value="(value) => timeLimit = value?.[0] ?? 0" />
                    </div>
                    <div class="flex justify-between text-sm text-muted-foreground font-[JetBrains_Mono]">
                      <span>0s</span>
                      <span class="font-medium text-foreground">
                        {{ timeLimit === 0 ? 'Unlimited' : `${timeLimit}s` }}
                      </span>
                      <span>300s</span>
                    </div>
                  </div>
                  <p class="font-[JetBrains_Mono] text-sm text-muted-foreground mt-1">
                    Set to 0 for unlimited time
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="font-[Roboto] text-lg font-semibold text-foreground">Gameplay</h3>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2">
                  <Checkbox id="allow-moving" :checked="allowMoving"
                    @update:checked="(checked: boolean) => allowMoving = checked" />
                  <label for="allow-moving"
                    class="font-[JetBrains_Mono] text-base font-medium text-foreground cursor-pointer">
                    Allow Moving
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox id="allow-panning" :checked="allowPanning"
                    @update:checked="(checked: boolean) => allowPanning = checked" />
                  <label for="allow-panning"
                    class="font-[JetBrains_Mono] text-base font-medium text-foreground cursor-pointer">
                    Allow Panning
                  </label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox id="allow-zooming" :checked="allowZooming"
                    @update:checked="(checked: boolean) => allowZooming = checked" />
                  <label for="allow-zooming"
                    class="font-[JetBrains_Mono] text-base font-medium text-foreground cursor-pointer">
                    Allow Zooming
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button size="lg"
              class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95">
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

const gameModes = [
  {
    id: 'single',
    title: 'Single Player',
    description: 'Explore the world at your own pace',
    emoji: '🌍',
    class: 'bg-blue-50 border-blue-100',
    emojiClass: 'bg-blue-100 border-blue-200',
  },
  {
    id: 'multiplayer',
    title: 'Multiplayer',
    description: 'Challenge friends',
    emoji: '👥',
    class: 'bg-green-50 border-green-100',
    emojiClass: 'bg-green-100 border-green-200',
  },
  {
    id: 'daily',
    title: 'Daily Challenge',
    description: "Compete in today's unique challenge",
    emoji: '🏆',
    class: 'bg-purple-50 border-purple-100',
    emojiClass: 'bg-purple-100 border-purple-200',
  },
]

const mapType = ref<string>('world')
const rounds = ref<number>(5)
const timeLimit = ref<number>(0)
const allowMoving = ref<boolean>(true)
const allowPanning = ref<boolean>(true)
const allowZooming = ref<boolean>(true)

const roundsSliderValue = ref([5])
const timeLimitSliderValue = ref([0])
</script>
