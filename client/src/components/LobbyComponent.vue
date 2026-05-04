<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between px-4 py-4 sm:px-8">
      <div class="font-[JetBrains_Mono] text-lg font-semibold sm:text-xl">
        <span>Room #{{ roomId }} - Lobby</span>
      </div>
    </header>
    <main class="flex grow flex-col gap-8 p-8 lg:flex-row">
      <div class="order-1 flex flex-col gap-8 lg:order-2 lg:flex-1">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section class="rounded-2xl bg-slate-50 p-6">
            <div class="flex flex-col gap-6">
              <div>
                <h2 class="text-foreground font-[JetBrains_Mono] text-xl font-bold">
                  Players ({{ players.length }})
                </h2>
              </div>
              <div class="flex flex-col gap-3">
                <div
                  v-for="player in players"
                  :key="player.id"
                  class="flex items-center gap-3 rounded-lg bg-white p-4"
                >
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full border text-lg"
                    :class="player.avatarClass"
                  >
                    {{ player.emoji }}
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col">
                    <span
                      class="text-foreground truncate font-[JetBrains_Mono] text-base font-medium"
                      >{{ player.name }}</span
                    >
                  </div>
                  <span
                    v-if="player.isHost"
                    class="rounded-full bg-orange-600 px-3 py-1 font-[JetBrains_Mono] text-xs font-bold text-white"
                  >
                    Host
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div class="flex flex-col gap-8">
            <section class="rounded-2xl bg-slate-50 p-6">
              <div class="flex flex-col gap-6">
                <div>
                  <h2 class="text-foreground font-[JetBrains_Mono] text-xl font-bold">
                    Game Configuration
                  </h2>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  <div class="rounded-lg bg-white px-4 py-3">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Map Type
                    </label>
                    <div class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.mapType }}
                    </div>
                  </div>
                  <div class="rounded-lg bg-white px-4 py-3">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Time Limit
                    </label>
                    <div class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.timeLimit === 0 ? 'Unlimited' : `${gameConfig.timeLimit}s` }}
                    </div>
                  </div>
                  <div class="rounded-lg bg-white px-4 py-3">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Only Panorama Images
                    </label>
                    <div class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.onlyPanorama ? 'Yes' : 'No' }}
                    </div>
                  </div>
                  <div class="rounded-lg bg-white px-4 py-3">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Allow Moving
                    </label>
                    <div class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.allowMoving ? 'Yes' : 'No' }}
                    </div>
                  </div>
                  <div class="rounded-lg bg-white px-4 py-3">
                    <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      Allow Zooming
                    </label>
                    <div class="text-muted-foreground mt-1 font-[JetBrains_Mono] text-sm">
                      {{ gameConfig.allowZooming ? 'Yes' : 'No' }}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="flex gap-4">
              <Button
                v-if="!isCreatingRounds"
                data-testid="leave-room-button"
                variant="ghost"
                size="lg"
                @click="leaveRoom"
                class="flex-1 rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
              >
                [Leave Room]
              </Button>
              <Button
                data-testid="start-game-button"
                size="lg"
                @click="startGame"
                :disabled="players.length < 2 || !myself?.isHost || isCreatingRounds"
                :class="isCreatingRounds ? 'w-full' : 'flex-1'"
                class="rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{
                  isCreatingRounds ? 'Creating the game.. It might take a while..' : 'Start Game'
                }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { GameConfigNode, PlayerResult } from '@/types'

defineProps<{
  roomId: string
  myself: {
    id: string
    name: string
    emoji: string
    avatarClass: string
    isHost: boolean
  } | null
  players: PlayerResult[]
  gameConfig: GameConfigNode
  isCreatingRounds: boolean
}>()

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
