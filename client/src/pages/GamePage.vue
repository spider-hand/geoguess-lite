<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-8 py-4">
      <div class="font-[JetBrains_Mono] text-xl font-semibold">Geoguess Lite</div>
      <nav class="flex gap-4">
        <Button
          variant="ghost"
          class="text-muted-foreground cursor-pointer font-[JetBrains_Mono] text-lg"
        >
          [Github]
        </Button>
      </nav>
    </header>
    <main class="flex flex-col gap-8 bg-gray-50 p-8">
      <div class="flex flex-col items-center gap-2 text-center">
        <h1 class="font-[JetBrains_Mono] text-4xl font-bold lg:text-5xl">Start New Game</h1>
        <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
          Select a game mode to begin
        </p>
      </div>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <CustomCardComponent
          v-for="(mode, index) in gameModes"
          :key="index"
          :title="mode.title"
          :description="mode.description"
          :emoji="mode.emoji"
          :bg-class="mode.class"
          :emoji-class="mode.emojiClass"
        />
      </div>
      <Card class="border">
        <CardContent class="flex flex-col gap-8">
          <div>
            <div
              class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl"
            >
              ⚙️
            </div>
            <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">Game Configuration</h2>
            <p class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-base">
              Customize your game experience
            </p>
          </div>
          <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="text-foreground font-[Roboto] text-lg font-semibold">Maps</h3>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
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
                <h3 class="text-foreground font-[Roboto] text-lg font-semibold">Rounds & Time</h3>
              </div>
              <div class="flex flex-col gap-8">
                <CustomSliderComponent
                  label="Number of Rounds"
                  v-model="rounds"
                  :min="5"
                  :max="10"
                  :step="1"
                  unit=" rounds"
                />
                <CustomSliderComponent
                  label="Time Limit Per Round"
                  v-model="timeLimit"
                  :min="0"
                  :max="300"
                  :step="60"
                  unit="s"
                  :unlimited-value="0"
                  unlimited-text="Unlimited"
                  help-text="Set to 0 for unlimited time"
                />
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="text-foreground font-[Roboto] text-lg font-semibold">Gameplay</h3>
              </div>
              <div class="flex flex-col gap-4">
                <CustomCheckboxComponent
                  id="allow-moving"
                  label="Allow Moving"
                  v-model="allowMoving"
                />
                <CustomCheckboxComponent
                  id="allow-panning"
                  label="Allow Panning"
                  v-model="allowPanning"
                />
                <CustomCheckboxComponent
                  id="allow-zooming"
                  label="Allow Zooming"
                  v-model="allowZooming"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button
              size="lg"
              class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
            >
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
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CustomCardComponent from '@/components/CustomCardComponent.vue'
import CustomSliderComponent from '@/components/CustomSliderComponent.vue'
import CustomCheckboxComponent from '@/components/CustomCheckboxComponent.vue'

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
</script>
