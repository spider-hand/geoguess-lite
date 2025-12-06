<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between border-b px-4 py-4 sm:px-8">
      <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
        <span>Room #{{ roomId }} - Lobby</span>
      </div>
    </header>
    <main class="flex grow flex-col gap-8 bg-gray-50 p-8 lg:flex-row">
      <div class="order-1 flex flex-col gap-8 lg:order-2 lg:flex-1">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card class="border">
            <CardContent class="flex flex-col gap-8">
              <div>
                <div
                  class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl"
                >
                  👥
                </div>
                <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">
                  Players ({{ players.length }})
                </h2>
                <p class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-base">
                  Players in this room
                </p>
              </div>
              <div class="flex flex-col gap-3">
                <div
                  v-for="player in players"
                  :key="player.id"
                  class="flex items-center gap-3 rounded border p-3"
                >
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full border text-lg"
                    :class="player.avatarClass"
                  >
                    {{ player.emoji }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-foreground font-[Roboto] text-base font-medium">{{
                      player.name
                    }}</span>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">{{
                      player.isHost ? 'Host' : 'Player'
                    }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div class="flex flex-col gap-8">
            <Card class="border">
              <CardContent class="flex flex-col gap-8">
                <div>
                  <div
                    class="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-gray-100 text-4xl"
                  >
                    ⚙️
                  </div>
                  <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">
                    Game Configuration
                  </h2>
                  <p class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-base">
                    Settings for this game
                  </p>
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex flex-col gap-1">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Map Type
                    </label>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">{{
                      gameConfig.mapType
                    }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Time Limit
                    </label>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.timeLimit === 0 ? 'Unlimited' : `${gameConfig.timeLimit}s` }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Allow Moving
                    </label>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.allowMoving ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Allow Zooming
                    </label>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.allowZooming ? 'Yes' : 'No' }}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div class="flex gap-4">
              <Button
                variant="ghost"
                size="lg"
                @click="leaveRoom"
                class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
              >
                Leave Room
              </Button>
              <Button
                size="lg"
                @click="startGame"
                :disabled="players.length < 2 || !myself?.isHost || isCreatingRounds"
                class="flex-1 cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ isCreatingRounds ? 'Starting...' : 'Start Game' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { PropType } from 'vue'

defineProps({
  roomId: {
    type: String,
    required: true,
  },
  myself: {
    type: Object as PropType<{
      id: string
      name: string
      emoji: string
      avatarClass: string
      isHost: boolean
    } | null>,
    default: null,
    required: true,
  },
  players: {
    type: Array as PropType<
      Array<{
        id: string
        name: string
        emoji: string
        avatarClass: string
        isHost: boolean
      }>
    >,
    required: true,
  },
  gameConfig: {
    type: Object as PropType<{
      mapType: string
      timeLimit: number
      allowMoving: boolean
      allowZooming: boolean
    }>,
    required: true,
  },
  isCreatingRounds: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  startGame: []
  leaveRoom: []
}>()

const startGame = () => {
  emit('startGame')
}

const leaveRoom = () => {
  emit('leaveRoom')
}
</script>
