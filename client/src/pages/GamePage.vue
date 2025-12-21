<template>
  <div class="flex min-h-screen flex-col">
    <HeaderComponent />
    <main class="flex flex-col gap-8 bg-gray-50 p-8 lg:flex-row">
      <div class="order-1 flex flex-col gap-8 lg:order-2 lg:flex-1">
        <div class="flex flex-col items-center gap-2 text-center">
          <h1 class="font-[JetBrains_Mono] text-4xl font-bold lg:text-5xl">Start New Game</h1>
          <p class="text-muted-foreground font-[JetBrains_Mono] text-xl">
            Select a game mode to begin
          </p>
        </div>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(mode, index) in gameModes"
            :key="index"
            @click="gameConfig.selectedGameMode = mode.id"
            class="h-full"
          >
            <CustomCardComponent
              :title="mode.title"
              :description="mode.description"
              :emoji="mode.emoji"
              :bg-class="getGameModeCardClass(mode.id)"
              :emoji-class="mode.emojiClass"
            />
          </div>
        </div>
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
                Customize your game experience
              </p>
            </div>
            <div v-if="gameConfig.selectedGameMode === 'multiplayer'" class="flex flex-col gap-4">
              <div class="flex flex-col gap-4">
                <CustomCheckboxComponent
                  id="is-host"
                  label="I am the host"
                  v-model="gameConfig.isHost"
                />
                <div v-if="!gameConfig.isHost" class="flex flex-col gap-1">
                  <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
                    Room Number
                  </label>
                  <Input
                    v-model="gameConfig.roomNumber"
                    placeholder="Enter room number"
                    class="max-w-xs font-[JetBrains_Mono]"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="
                gameConfig.selectedGameMode === 'single-player' ||
                (gameConfig.selectedGameMode === 'multiplayer' && gameConfig.isHost)
              "
              class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3"
            >
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                  <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
                    Map Type
                  </label>
                  <Select v-model="gameConfig.mapType">
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
                <div class="flex flex-col gap-8">
                  <CustomSliderComponent
                    label="Time Limit Per Round"
                    v-model="gameConfig.timeLimit"
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
                <div class="flex flex-col gap-4">
                  <CustomCheckboxComponent
                    id="allow-moving"
                    label="Allow Moving"
                    v-model="gameConfig.allowMoving"
                  />
                  <CustomCheckboxComponent
                    id="allow-zooming"
                    label="Allow Zooming"
                    v-model="gameConfig.allowZooming"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <Button
                size="lg"
                class="cursor-pointer rounded-none font-[JetBrains_Mono] text-lg transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                @click="startGame"
                :disabled="
                  !user ||
                  isRoomLoading ||
                  (gameConfig.selectedGameMode === 'daily-challenge' &&
                    user.hasPlayedDailyChallenge) ||
                  (gameConfig.selectedGameMode === 'multiplayer' &&
                    !gameConfig.isHost &&
                    !gameConfig.roomNumber)
                "
              >
                {{ isRoomLoading ? 'Loading...' : 'Start Game' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="order-2 flex flex-col gap-8 lg:order-1 lg:w-80">
        <Card class="border">
          <CardContent class="flex flex-col gap-6">
            <div>
              <h2 class="text-foreground font-[Roboto] text-2xl font-semibold">Profile</h2>
            </div>
            <template v-if="!isEditingProfile">
              <div class="flex flex-col items-center gap-4">
                <div
                  class="flex h-20 w-20 items-center justify-center rounded-full border text-4xl"
                  :class="getAvatarClass(user?.avatarBg)"
                >
                  {{ user?.avatarEmoji }}
                </div>
                <div class="text-center">
                  <h3 class="text-foreground font-[Roboto] text-lg font-semibold">
                    {{ user?.name }}
                  </h3>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex justify-between">
                  <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                    >Games Played</span
                  >
                  <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{
                    user?.gamesPlayed
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                    >Avg. Score</span
                  >
                  <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{
                    user?.averageScore
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                    >High Score</span
                  >
                  <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{
                    user?.bestScore
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                    >Distance Unit</span
                  >
                  <span
                    v-if="user && user.distanceUnit"
                    class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >{{ user.distanceUnit === 'km' ? 'Kilometers' : 'Miles' }}</span
                  >
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  @click="startEditProfile"
                  class="text-muted-foreground cursor-pointer rounded-none font-[JetBrains_Mono]"
                >
                  [Edit Profile]
                </Button>
                <Button
                  variant="ghost"
                  @click="startDeleteAccount"
                  class="cursor-pointer rounded-none font-[JetBrains_Mono] text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  [Delete Account]
                </Button>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col items-center gap-4">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full border text-4xl"
                    :class="getAvatarClass(editForm.avatarBg)"
                  >
                    {{ editForm.avatarEmoji }}
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >Name</label
                  >
                  <Input
                    v-model="editForm.name"
                    placeholder="Enter your name"
                    class="font-[JetBrains_Mono]"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >Avatar Emoji</label
                  >
                  <emoji-picker
                    @emoji-click="onEmojiSelect"
                    class="w-full font-[JetBrains_Mono]"
                  ></emoji-picker>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >Background Color</label
                  >
                  <Select v-model="editForm.avatarBg">
                    <SelectTrigger class="w-full">
                      <SelectValue
                        class="font-[JetBrains_Mono]"
                        placeholder="Select background color"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="color in Object.keys(AVATAR_CLASS_MAP)"
                        :key="color"
                        :value="color"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="h-4 w-4 rounded-full border"
                            :class="getAvatarClass(color)"
                          ></div>
                          <span class="font-[JetBrains_Mono] capitalize">{{ color }}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >Distance Unit</label
                  >
                  <Select v-model="editForm.distanceUnit">
                    <SelectTrigger class="w-full">
                      <SelectValue
                        class="font-[JetBrains_Mono]"
                        placeholder="Select distance unit"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km" class="font-[JetBrains_Mono]">
                        Kilometers (km)
                      </SelectItem>
                      <SelectItem value="mile" class="font-[JetBrains_Mono]">
                        Miles (mi)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <Button
                    @click="saveProfile"
                    :disabled="isPendingOnUpdateUser"
                    class="cursor-pointer rounded-none font-[JetBrains_Mono] transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                  >
                    {{ isPendingOnUpdateUser ? 'Saving...' : 'Save Changes' }}
                  </Button>
                  <Button
                    variant="ghost"
                    @click="cancelEditProfile"
                    class="text-muted-foreground cursor-pointer rounded-none font-[JetBrains_Mono]"
                  >
                    [Cancel]
                  </Button>
                </div>
              </div>
            </template>
          </CardContent>
        </Card>
        <Card v-if="isDeletingAccount" class="borde">
          <CardContent class="flex flex-col gap-6">
            <div>
              <h2 class="font-[Roboto] text-2xl font-semibold text-red-500">Delete Account</h2>
            </div>
            <div class="flex flex-col gap-4">
              <p class="text-foreground font-[JetBrains_Mono] text-sm">
                This action cannot be undone. This will permanently delete your account and remove
                all your data.
              </p>
              <p class="text-foreground font-[JetBrains_Mono] text-sm">
                Please type <strong>"Delete account"</strong> to confirm deletion.
              </p>
              <Input
                v-model="deleteConfirmationText"
                placeholder="Delete account"
                class="font-[JetBrains_Mono]"
              />
              <div class="flex flex-col gap-2">
                <Button
                  @click="confirmDeleteAccount"
                  :disabled="deleteConfirmationText !== 'Delete account' || isPendingOnDeleteUser"
                  class="cursor-pointer rounded-none bg-red-600 font-[JetBrains_Mono] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:opacity-95"
                >
                  {{ isPendingOnDeleteUser ? 'Deleting...' : 'Delete Account' }}
                </Button>
                <Button
                  variant="ghost"
                  @click="cancelDeleteAccount"
                  :disabled="isPendingOnDeleteUser"
                  class="text-muted-foreground cursor-pointer rounded-none font-[JetBrains_Mono]"
                >
                  [Cancel]
                </Button>
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
              <div v-if="leaderboard.length === 0" class="flex items-center justify-center py-8">
                <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                  No scores today yet
                </span>
              </div>
              <div
                v-else
                v-for="(player, index) in leaderboard"
                :key="index"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full border text-lg"
                    :class="player.avatarClass"
                  >
                    {{ player.emoji }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-foreground font-[Roboto] text-sm font-medium">{{
                      player.name
                    }}</span>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-xs"
                      >#{{ index + 1 }}</span
                    >
                  </div>
                </div>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">{{
                  player.score
                }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import 'emoji-picker-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import CustomCardComponent from '@/components/CustomCardComponent.vue'
import CustomSliderComponent from '@/components/CustomSliderComponent.vue'
import CustomCheckboxComponent from '@/components/CustomCheckboxComponent.vue'
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
import useUserQuery from '@/composables/useUserQuery'
import useDailyScoreQuery from '@/composables/useDailyScoreQuery'
import { AVATAR_CLASS_MAP } from '@/consts'
import type { GameModeType } from '@/types'
import useGameConfigStore from '@/stores/gameConfig'
import { useMultiplayerRoom } from '@/composables/useMultiplayerRoom'
import { getAvatarClass } from '@/utils'
import type { UserDistanceUnitEnum } from '@/services'

interface GameModeItem {
  id: GameModeType
  title: string
  description: string
  emoji: string
  class: string
  emojiClass: string
}

const gameModes: GameModeItem[] = [
  {
    id: 'single-player',
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
    id: 'daily-challenge',
    title: 'Daily Challenge',
    description: "Compete in today's unique challenge",
    emoji: '🏆',
    class: 'bg-purple-50 border-purple-100',
    emojiClass: 'bg-purple-100 border-purple-200',
  },
]

const { todayTopScores } = useDailyScoreQuery()

const leaderboard = computed(() => {
  if (!todayTopScores.value?.scores) {
    return []
  }

  return todayTopScores.value.scores.map((player) => ({
    name: player.name,
    emoji: player.avatarEmoji,
    avatarClass: getAvatarClass(player.avatarBg),
    score: player.score,
  }))
})

const router = useRouter()

const {
  user,
  mutateUserUpdateAsync,
  isPendingOnUpdateUser,
  mutateUserDeleteAsync,
  isPendingOnDeleteUser,
} = useUserQuery()

const isEditingProfile = ref(false)
const editForm = ref({
  name: '',
  avatarEmoji: '',
  avatarBg: '',
  distanceUnit: 'km' as UserDistanceUnitEnum,
})

const isDeletingAccount = ref(false)
const deleteConfirmationText = ref('')

const gameConfig = useGameConfigStore()
const { createRoom, joinRoom, isLoading: isRoomLoading } = useMultiplayerRoom()

const getGameModeCardClass = (modeId: GameModeType) => {
  const mode = gameModes.find((m) => m.id === modeId)
  const baseClass = mode?.class || ''

  if (gameConfig.selectedGameMode === modeId) {
    if (modeId === 'single-player') {
      return `${baseClass} border-2! border-blue-500`
    } else if (modeId === 'multiplayer') {
      return `${baseClass} border-2! border-green-500`
    } else if (modeId === 'daily-challenge') {
      return `${baseClass} border-2! border-purple-500`
    }
  }

  return baseClass
}

const startEditProfile = () => {
  if (user.value) {
    editForm.value = {
      name: user.value.name,
      avatarEmoji: user.value.avatarEmoji,
      avatarBg: user.value.avatarBg,
      distanceUnit: user.value.distanceUnit,
    }
  }
  isEditingProfile.value = true
}

const cancelEditProfile = () => {
  isEditingProfile.value = false
  editForm.value = { name: '', avatarEmoji: '', avatarBg: '', distanceUnit: 'km' }
}

const saveProfile = async () => {
  try {
    if (editForm.value.name && editForm.value.avatarEmoji && editForm.value.avatarBg) {
      await mutateUserUpdateAsync({
        name: editForm.value.name,
        avatarEmoji: editForm.value.avatarEmoji,
        avatarBg: editForm.value.avatarBg,
        distanceUnit: editForm.value.distanceUnit,
      })
    }
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    isEditingProfile.value = false
  }
}

const onEmojiSelect = (event: CustomEvent) => {
  editForm.value.avatarEmoji = event.detail.unicode
}

const startDeleteAccount = () => {
  isDeletingAccount.value = true
}

const cancelDeleteAccount = () => {
  isDeletingAccount.value = false
  deleteConfirmationText.value = ''
}

const confirmDeleteAccount = async () => {
  if (deleteConfirmationText.value === 'Delete account') {
    try {
      await mutateUserDeleteAsync()
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }
}

const startGame = async () => {
  switch (gameConfig.selectedGameMode) {
    case 'single-player':
      router.push({ name: 'game-single-player' })
      break
    case 'multiplayer':
      if (!user.value) return

      try {
        if (gameConfig.isHost) {
          // Create room as host
          const player = {
            id: user.value.id,
            name: user.value.name,
            avatarEmoji: user.value.avatarEmoji,
            avatarBg: user.value.avatarBg,
            isHost: true,
            isConnected: true,
            loadedRound: 0,
          }

          const config = {
            mapType: gameConfig.mapType,
            timeLimit: gameConfig.timeLimit,
            allowMoving: gameConfig.allowMoving,
            allowZooming: gameConfig.allowZooming,
          }

          const roomId = await createRoom(player, config)
          router.push({ name: 'game-multiplayer', params: { roomId } })
        } else {
          // Join existing room
          if (!gameConfig.roomNumber) {
            return
          }

          const player = {
            id: user.value.id,
            name: user.value.name,
            avatarEmoji: user.value.avatarEmoji,
            avatarBg: user.value.avatarBg,
            isHost: false,
            isConnected: true,
            loadedRound: 0,
          }

          await joinRoom(gameConfig.roomNumber, player)
          router.push({ name: 'game-multiplayer', params: { roomId: gameConfig.roomNumber } })
        }
      } catch {}
      break
    case 'daily-challenge':
      router.push({ name: 'game-daily-challenge' })
      break
    default:
      router.push({ name: 'game-single-player' })
  }
}
</script>

<style scoped>
emoji-picker {
  --button-hover-background: var(--color-gray-200);
  --border-radius: 8px;
  --input-border-radius: 8px;
  --input-border-color: var(--color-gray-300);
  --input-padding: 4px 12px;
  --input-placeholder-color: var(--color-gray-500);
  --indicator-color: var(--color-blue-500);
}
</style>
