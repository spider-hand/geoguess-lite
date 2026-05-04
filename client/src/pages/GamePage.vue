<template>
  <div class="min-h-screen bg-white">
    <HeaderComponent />
    <main class="min-h-[calc(100vh-3.75rem)] px-5 py-8 md:px-8 md:py-10 lg:px-8 lg:py-8">
      <section
        class="grid grid-cols-1 gap-8 xl:min-h-full xl:grid-cols-[minmax(0,2.4fr)_minmax(320px,1fr)]"
      >
        <div class="flex flex-col gap-8 xl:min-h-full">
          <section class="overflow-hidden rounded-2xl bg-slate-50">
            <img src="@/assets/images/main.png" class="h-64 w-full object-cover md:h-72 xl:h-80" />
          </section>
          <section class="relative z-10 xl:-mt-24 xl:flex-1">
            <div
              class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] xl:h-full"
            >
              <section class="min-h-72 rounded-2xl bg-slate-50 p-6 xl:h-full">
                <h2 class="mb-4 font-[JetBrains_Mono] text-xl font-bold">Game Mode Selection</h2>
                <div class="flex flex-col gap-3">
                  <button
                    :class="getGameModeCardClass('single-player')"
                    @click="
                      isGameModeAvailable('single-player') &&
                      (gameConfig.selectedGameMode = 'single-player')
                    "
                  >
                    <div
                      class="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-orange-600"
                    >
                      <Earth class="h-7 w-7 text-white" />
                    </div>
                    <div class="flex flex-col gap-2 text-start">
                      <h3 :class="getGameModeTitleClass('single-player')">Single Player</h3>
                      <span class="text-muted-foreground font-[JetBrains_Mono]"
                        >Explore the world at your own pace</span
                      >
                    </div>
                    <div
                      v-if="gameConfig.selectedGameMode === 'single-player'"
                      class="absolute top-2 right-2 rounded-full bg-orange-600 p-1"
                    >
                      <Check class="h-3 w-3 text-white" />
                    </div>
                  </button>
                  <button
                    :class="getGameModeCardClass('multiplayer')"
                    @click="
                      isGameModeAvailable('multiplayer') &&
                      (gameConfig.selectedGameMode = 'multiplayer')
                    "
                  >
                    <div
                      class="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-orange-600"
                    >
                      <Sword class="h-7 w-7 text-white" />
                    </div>
                    <div class="flex flex-col gap-2 text-start">
                      <h3 :class="getGameModeTitleClass('multiplayer')">Multiplayer</h3>
                      <span class="text-muted-foreground font-[JetBrains_Mono]"
                        >Challenge your friends in real-time</span
                      >
                    </div>
                    <div
                      v-if="gameConfig.selectedGameMode === 'multiplayer'"
                      class="absolute top-2 right-2 rounded-full bg-orange-600 p-1"
                    >
                      <Check class="h-3 w-3 text-white" />
                    </div>
                  </button>
                  <button
                    :class="getGameModeCardClass('daily-challenge')"
                    @click="
                      isGameModeAvailable('daily-challenge') &&
                      (gameConfig.selectedGameMode = 'daily-challenge')
                    "
                  >
                    <div
                      class="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-orange-600"
                    >
                      <Calendar class="h-7 w-7 text-white" />
                    </div>
                    <div class="flex flex-col gap-2 text-start">
                      <h3 :class="getGameModeTitleClass('daily-challenge')">Daily Challenge</h3>
                      <span class="text-muted-foreground font-[JetBrains_Mono]"
                        >Complete in today's unique challenge</span
                      >
                    </div>
                    <div
                      v-if="gameConfig.selectedGameMode === 'daily-challenge'"
                      class="absolute top-2 right-2 rounded-full bg-orange-600 p-1"
                    >
                      <Check class="h-3 w-3 text-white" />
                    </div>
                  </button>
                </div>
              </section>
              <section class="min-h-72 rounded-2xl bg-slate-50 p-6 xl:h-full">
                <h2 class="mb-4 font-[JetBrains_Mono] text-xl font-bold">Game Configuration</h2>
                <div class="flex flex-col gap-6">
                  <div
                    v-if="gameConfig.selectedGameMode === 'multiplayer'"
                    class="flex flex-col gap-4"
                  >
                    <CustomCheckboxComponent
                      id="is-host"
                      label="I am the host"
                      v-model="gameConfig.isHost"
                    />
                  </div>
                  <div
                    v-if="gameConfig.selectedGameMode === 'multiplayer' && !gameConfig.isHost"
                    class="flex flex-col gap-1"
                  >
                    <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
                      Room Number
                    </label>
                    <Input
                      v-model="gameConfig.roomNumber"
                      placeholder="Enter room number"
                      class="w-full bg-white font-[JetBrains_Mono]"
                    />
                  </div>
                  <div
                    v-if="gameConfig.selectedGameMode === 'daily-challenge'"
                    class="flex flex-col gap-6"
                  >
                    <div class="flex flex-col gap-1">
                      <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
                        Map Type
                      </label>
                      <Select :model-value="dailyChallengeConfig.mapType" disabled>
                        <SelectTrigger class="w-full bg-white" disabled>
                          <SelectValue
                            placeholder="Select map type"
                            class="font-[JetBrains_Mono]"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="world" class="font-[JetBrains_Mono]">World</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex flex-col gap-4">
                      <div class="flex flex-col gap-8">
                        <CustomSliderComponent
                          label="Time Limit Per Round"
                          :model-value="dailyChallengeConfig.timeLimit"
                          :min="0"
                          :max="300"
                          :step="60"
                          unit="s"
                          :unlimited-value="0"
                          unlimited-text="Unlimited"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="flex flex-col gap-4">
                      <CustomCheckboxComponent
                        id="daily-only-panorama"
                        label="Only Panorama"
                        :model-value="dailyChallengeConfig.onlyPanorama"
                        disabled
                      />
                      <CustomCheckboxComponent
                        id="daily-allow-moving"
                        label="Allow Moving"
                        :model-value="dailyChallengeConfig.allowMoving"
                        disabled
                      />
                      <CustomCheckboxComponent
                        id="daily-allow-zooming"
                        label="Allow Zooming"
                        :model-value="dailyChallengeConfig.allowZooming"
                        disabled
                      />
                    </div>
                  </div>
                  <div
                    v-if="
                      gameConfig.selectedGameMode === 'single-player' ||
                      (gameConfig.selectedGameMode === 'multiplayer' && gameConfig.isHost)
                    "
                    class="flex flex-col gap-1"
                  >
                    <label class="text-foreground font-[JetBrains_Mono] text-base font-medium">
                      Map Type
                    </label>
                    <Select v-model="gameConfig.mapType">
                      <SelectTrigger class="w-full bg-white">
                        <SelectValue placeholder="Select map type" class="font-[JetBrains_Mono]" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="world" class="font-[JetBrains_Mono]">World</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div
                    v-if="
                      gameConfig.selectedGameMode === 'single-player' ||
                      (gameConfig.selectedGameMode === 'multiplayer' && gameConfig.isHost)
                    "
                    class="flex flex-col gap-4"
                  >
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
                      />
                    </div>
                  </div>
                  <div
                    v-if="
                      gameConfig.selectedGameMode === 'single-player' ||
                      (gameConfig.selectedGameMode === 'multiplayer' && gameConfig.isHost)
                    "
                    class="flex flex-col gap-4"
                  >
                    <CustomCheckboxComponent
                      id="only-panorama"
                      label="Only Panorama"
                      v-model="gameConfig.onlyPanorama"
                    />
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
                  <Button
                    class="cursor-pointer self-end rounded-none font-[JetBrains_Mono] transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                    @click="startGame"
                    :disabled="
                      !isCurrentUserLoaded ||
                      isRoomLoading ||
                      !isGameModeAvailable(gameConfig.selectedGameMode) ||
                      (gameConfig.selectedGameMode === 'daily-challenge' &&
                        user &&
                        user.hasPlayedDailyChallenge) ||
                      (gameConfig.selectedGameMode === 'multiplayer' &&
                        !gameConfig.isHost &&
                        !gameConfig.roomNumber)
                    "
                    >{{ isRoomLoading ? 'Loading...' : 'Start Game' }}</Button
                  >
                </div>
              </section>
            </div>
          </section>
        </div>
        <aside class="flex flex-col gap-6">
          <section class="flex min-h-72 flex-col rounded-2xl bg-slate-50 p-6">
            <h2 class="font-[JetBrains_Mono] text-xl font-bold">Profile</h2>
            <div v-if="isDeletingAccount && currentUser" class="mt-6 flex flex-col gap-4">
              <h3 class="font-[Roboto] text-xl font-semibold text-red-500">Delete Account</h3>
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
                class="bg-white font-[JetBrains_Mono]"
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
            <template v-else-if="currentUser">
              <div v-if="!isEditingProfile" class="mt-6 flex flex-col gap-6">
                <div class="flex flex-col items-center gap-4">
                  <div
                    class="flex h-20 w-20 items-center justify-center rounded-full border text-4xl"
                    :class="[getAvatarClass(user?.avatarBg), 'border-4']"
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
                    <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      {{ user?.gamesPlayed }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                      >Avg. Score</span
                    >
                    <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      {{ user?.averageScore }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                      >High Score</span
                    >
                    <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                      {{ user?.bestScore }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-sm"
                      >Distance Unit</span
                    >
                    <span
                      v-if="user && user.distanceUnit"
                      class="text-foreground font-[JetBrains_Mono] text-sm font-medium"
                    >
                      {{ user.distanceUnit === 'km' ? 'Kilometers' : 'Miles' }}
                    </span>
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
              </div>
              <div v-else class="mt-6 flex flex-col gap-4">
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
                    class="bg-white font-[JetBrains_Mono]"
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
                    <SelectTrigger class="w-full bg-white">
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
                    <SelectTrigger class="w-full bg-white">
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
            <template v-else>
              <div class="mt-6 flex flex-col gap-6">
                <span class="text-muted-foreground font-[JetBrains_Mono]">
                  Create an account to unlock all features
                </span>
                <Button
                  @click="signUpWithGoogle"
                  class="cursor-pointer self-end rounded-none font-[JetBrains_Mono] transition-all duration-300 hover:-translate-y-1 hover:opacity-95"
                >
                  Sign Up
                </Button>
              </div>
            </template>
          </section>
          <section class="flex min-h-80 flex-col rounded-2xl bg-slate-50 p-6">
            <h2 class="font-[JetBrains_Mono] text-xl font-bold">Leaderboard</h2>
            <span class="text-muted-foreground font-[JetBrains_Mono]">Today's top players</span>
            <div class="mt-6 flex flex-1 flex-col gap-4">
              <div
                v-if="leaderboard.length === 0"
                class="flex flex-1 items-center justify-center py-8"
              >
                <span class="text-muted-foreground font-[JetBrains_Mono] text-sm">
                  No scores today yet
                </span>
              </div>
              <div
                v-for="(player, index) in leaderboard"
                v-else
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
                    <span class="text-foreground font-[Roboto] text-sm font-medium">
                      {{ player.name }}
                    </span>
                    <span class="text-muted-foreground font-[JetBrains_Mono] text-xs">
                      #{{ index + 1 }}
                    </span>
                  </div>
                </div>
                <span class="text-foreground font-[JetBrains_Mono] text-sm font-medium">
                  {{ player.score }}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CustomCheckboxComponent from '@/components/CustomCheckboxComponent.vue'
import CustomSliderComponent from '@/components/CustomSliderComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import useAuth from '@/composables/useAuth'
import useDailyScoreQuery from '@/composables/useDailyScoreQuery'
import { useMultiplayerRoom } from '@/composables/useMultiplayerRoom'
import useUserQuery from '@/composables/useUserQuery'
import { AVATAR_CLASS_MAP } from '@/consts'
import type { UserDistanceUnitEnum } from '@/services'
import useGameConfigStore from '@/stores/gameConfig'
import type { GameModeType } from '@/types'
import { getAvatarClass } from '@/utils'
import { Check, Earth, Sword, Calendar } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import 'emoji-picker-element'

const router = useRouter()

const { currentUser, isCurrentUserLoaded, signUpWithGoogle } = useAuth()

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

const {
  user,
  mutateUserUpdateAsync,
  isPendingOnUpdateUser,
  mutateUserDeleteAsync,
  isPendingOnDeleteUser,
} = useUserQuery()

const isGuest = computed(() => isCurrentUserLoaded.value && !currentUser.value)

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

const isGameModeAvailable = (modeId: GameModeType) => {
  if (isGuest.value && (modeId === 'multiplayer' || modeId === 'daily-challenge')) {
    return false
  }
  return true
}

const dailyChallengeConfig = {
  mapType: 'world',
  timeLimit: 60,
  onlyPanorama: true,
  allowMoving: true,
  allowZooming: true,
} as const

const getGameModeCardClass = (modeId: GameModeType) => {
  return [
    'relative flex flex-row gap-4 items-center rounded-lg p-4',
    gameConfig.selectedGameMode === modeId ? 'bg-amber-50' : 'bg-slate-100 hover:bg-amber-50',
    !isGameModeAvailable(modeId) ? 'cursor-not-allowed opacity-50' : '',
  ]
}

const getGameModeTitleClass = (modeId: GameModeType) => {
  return ['font-bold', gameConfig.selectedGameMode === modeId ? 'text-orange-900' : '']
}

watch(isGuest, (guestMode) => {
  if (guestMode && !isGameModeAvailable(gameConfig.selectedGameMode)) {
    gameConfig.selectedGameMode = 'single-player'
  }
})

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
            onlyPanorama: gameConfig.onlyPanorama,
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
  --button-hover-background: var(--color-slate-200);
  --border-radius: 12px;
  --input-border-radius: 12px;
  --input-border-color: var(--color-slate-300);
  --input-padding: 4px 12px;
  --input-placeholder-color: var(--color-slate-500);
  --indicator-color: var(--color-orange-600);
}
</style>
