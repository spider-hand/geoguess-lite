<template>
  <div class="flex min-h-screen flex-col">
    <HeaderComponent />
    <main class="flex flex-col lg:flex-row gap-8 bg-gray-50 p-8">
      <div class="flex flex-col gap-8 lg:flex-1 order-1 lg:order-2">
        <div class="flex flex-col items-center gap-2 text-center">
          <h1 class="font-[JetBrains_Mono] text-4xl font-bold lg:text-5xl">Start New Game</h1>
          <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
            Select a game mode to begin
          </p>
        </div>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CustomCardComponent v-for="(mode, index) in gameModes" :key="index" :title="mode.title"
            :description="mode.description" :emoji="mode.emoji" :bg-class="mode.class" :emoji-class="mode.emojiClass" />
        </div>
        <Card class="border">
          <CardContent class="flex flex-col gap-8">
            <div>
              <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl">
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
                  <CustomSliderComponent label="Number of Rounds" v-model="rounds" :min="5" :max="10" :step="1"
                    unit=" rounds" />
                  <CustomSliderComponent label="Time Limit Per Round" v-model="timeLimit" :min="0" :max="300" :step="60"
                    unit="s" :unlimited-value="0" unlimited-text="Unlimited" help-text="Set to 0 for unlimited time" />
                </div>
              </div>
              <div class="flex flex-col gap-4">
                <div>
                  <h3 class="text-foreground font-[Roboto] text-lg font-semibold">Gameplay</h3>
                </div>
                <div class="flex flex-col gap-4">
                  <CustomCheckboxComponent id="allow-moving" label="Allow Moving" v-model="allowMoving" />
                  <CustomCheckboxComponent id="allow-panning" label="Allow Panning" v-model="allowPanning" />
                  <CustomCheckboxComponent id="allow-zooming" label="Allow Zooming" v-model="allowZooming" />
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <Button size="lg"
                class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                @click="router.push({
                  name: 'game-single-player',
                })">
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="flex flex-col gap-8 lg:w-80 order-2 lg:order-1">
        <Card class="border">
          <CardContent class="flex flex-col gap-6">
            <div>
              <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">Profile</h2>
            </div>
            <div class="flex flex-col items-center gap-4">
              <div class="flex h-20 w-20 items-center justify-center rounded-full text-4xl border"
                :class="getAvatarClass(user?.avatarBg)">
                {{ user?.avatarEmoji }}
              </div>
              <div class="text-center">
                <h3 class="text-foreground font-[Roboto] text-lg font-semibold">{{ user?.name }}</h3>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between">
                <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">Games Played</span>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{ user?.gamesPlayed
                  }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">Avg. Score</span>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{ user?.averageScore
                  }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">High Score</span>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{ user?.bestScore
                  }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border">
          <CardContent class="flex flex-col gap-6">
            <div>
              <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">Leaderboard</h2>
              <p class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-base">
                Today's Top Players
              </p>
            </div>
            <div class="flex flex-col gap-4">
              <div v-for="(player, index) in leaderboard" :key="index" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    :class="player.avatarClass">
                    {{ player.emoji }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-foreground font-[Roboto] text-sm font-medium">{{ player.name }}</span>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-xs">#{{ index + 1 }}</span>
                  </div>
                </div>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{ player.score }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import useUserQuery from '@/composables/useUserQuery'
import { AVATAR_CLASS_MAP } from '@/consts'

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


const leaderboard = [
  { name: 'GeoMaster', emoji: '🏆', avatarClass: 'bg-yellow-100 border border-yellow-200', score: 4950 },
  { name: 'WorldExplorer', emoji: '🌍', avatarClass: 'bg-green-100 border border-green-200', score: 4720 },
  { name: 'MapWizard', emoji: '🧙‍♂️', avatarClass: 'bg-purple-100 border border-purple-200', score: 4680 },
  { name: 'Navigator_Pro', emoji: '🧭', avatarClass: 'bg-blue-100 border border-blue-200', score: 4520 },
  { name: 'GlobeTrotter', emoji: '✈️', avatarClass: 'bg-red-100 border border-red-200', score: 4350 }
]

const router = useRouter()

const { user } = useUserQuery()

const mapType = ref<string>('world')
const rounds = ref<number>(5)
const timeLimit = ref<number>(0)
const allowMoving = ref<boolean>(true)
const allowPanning = ref<boolean>(true)
const allowZooming = ref<boolean>(true)

const getAvatarClass = (avatarBg?: string) => {
  return avatarBg ? AVATAR_CLASS_MAP[avatarBg] ?? "" : ""
}
</script>
