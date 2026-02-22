import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import MultiplayerGamePage from '@/pages/MultiplayerGamePage.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockFormattedTime = ref('01:00')
const mockIsExpired = ref(false)
const mockStart = vi.fn()
const mockStop = vi.fn()
const mockReset = vi.fn()

vi.mock('@/composables/useTimer', () => ({
  useTimer: () => ({
    isExpired: mockIsExpired,
    formattedTime: mockFormattedTime,
    start: mockStart,
    stop: mockStop,
    reset: mockReset,
  }),
}))

const mockUser = ref({
  id: 'user123',
  name: 'Player 1',
  distanceUnit: 'km',
  avatarEmoji: '🎮',
  avatarBg: 'blue',
})

vi.mock('@/composables/useUserQuery', () => ({
  default: () => ({
    user: mockUser,
  }),
}))

const mockIsWaiting = ref(true)
const mockIsLoading = ref(false)
const mockIsLoaded = ref(false)
const mockIsPlaying = ref(false)
const mockIsFinished = ref(false)
const mockIsError = ref(false)
const mockCurrentRound = ref(1)
const mockCurrentRoundImageId = ref('img1')
const mockPlayers = ref([
  {
    id: 'user123',
    name: 'Player 1',
    emoji: '🎮',
    avatarClass: 'bg-blue-100',
    isHost: true,
    score: 0,
    distance: 0,
    status: 'Waiting',
  },
])
const mockMyself = ref({
  id: 'user123',
  name: 'Player 1',
  emoji: '🎮',
  avatarClass: 'bg-blue-100',
  isHost: true,
})
const mockGameConfig = ref({
  mapType: 'world',
  timeLimit: 60,
  onlyPanorama: false,
  allowMoving: true,
  allowZooming: true,
})

vi.mock('@/composables/useMultiplayerRoom', () => ({
  useMultiplayerRoom: () => ({
    currentRoom: ref({}),
    isWaiting: mockIsWaiting,
    isLoading: mockIsLoading,
    isLoaded: mockIsLoaded,
    isPlaying: mockIsPlaying,
    isFinished: mockIsFinished,
    isError: mockIsError,
    currentRound: mockCurrentRound,
    currentRoundImageId: mockCurrentRoundImageId,
    players: mockPlayers,
    myself: mockMyself,
    gameConfig: mockGameConfig,
    multiplayerRounds: ref([]),
    hasEveryoneLoaded: ref(false),
    hasEveryoneGuessed: ref(false),
    progressPercentage: ref(0),
    getRoomById: vi.fn(),
    leaveRoom: vi.fn(),
    updateCurrentRoundImageId: vi.fn(),
  }),
}))

vi.mock('@/composables/useMultiplayerRoundsApi', () => ({
  default: () => ({
    createRounds: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('@/lib/firebase', () => ({
  db: {},
}))

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/components/MapComponent.vue', () => ({
  default: {
    template: '<div data-testid="map">Map</div>',
    methods: {
      disableClicks: vi.fn(),
      showCorrectLocation: vi.fn(),
      centerMapOnMarkers: vi.fn(),
      clearMarker: vi.fn(),
      enableClicks: vi.fn(),
    },
  },
}))

vi.mock('@/components/StreetViewComponent.vue', () => ({
  default: {
    template: '<div data-testid="streetview">StreetView</div>',
    methods: {
      loadRandomView: vi.fn(),
    },
  },
}))

vi.mock('@/components/HeaderComponent.vue', () => ({
  default: {
    template: '<header data-testid="header">Header</header>',
  },
}))

vi.mock('@/components/LobbyComponent.vue', () => ({
  default: {
    template:
      '<div data-testid="lobby"><button data-testid="emit-start-game" @click="$emit(\'start-game\')">Start</button><button data-testid="emit-leave-room" @click="$emit(\'leave-room\')">Leave</button></div>',
    props: ['roomId', 'myself', 'players', 'gameConfig', 'isCreatingRounds'],
    emits: ['start-game', 'leave-room'],
  },
}))

vi.mock('@/components/GameSummaryMultiplayerComponent.vue', () => ({
  default: {
    template:
      '<div data-testid="game-summary"><button data-testid="emit-return-to-menu" @click="$emit(\'return-to-menu\')">Return</button></div>',
    props: ['players', 'gameRecords', 'distanceUnit'],
    emits: ['return-to-menu'],
  },
}))

vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    template:
      '<button :disabled="disabled" :data-testid="$attrs[\'data-testid\']"><slot /></button>',
    props: ['variant', 'disabled'],
  },
}))

vi.mock('@/components/ui/progress/Progress.vue', () => ({
  default: {
    template: '<div data-testid="progress">Progress</div>',
    props: ['modelValue'],
  },
}))

describe('MultiplayerGamePage', () => {
  beforeEach(() => {
    mockFormattedTime.value = '01:00'
    mockIsExpired.value = false
    mockIsWaiting.value = true
    mockIsLoading.value = false
    mockIsLoaded.value = false
    mockIsPlaying.value = false
    mockIsFinished.value = false
    mockIsError.value = false
    mockPush.mockClear()
  })

  it('should show lobby when waiting for players', () => {
    mockIsWaiting.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const lobby = wrapper.find('[data-testid="lobby"]')
    expect(lobby.exists()).toBe(true)
  })

  it('should not show lobby when not waiting', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const lobby = wrapper.find('[data-testid="lobby"]')
    expect(lobby.exists()).toBe(false)
  })

  it('should show loading screen when game is loading', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    expect(wrapper.text()).toContain('Creating the game')
  })

  it('should not show loading screen when not loading', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    expect(wrapper.text()).not.toContain('Creating the game')
  })

  it('should show progress bar during loading', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const progress = wrapper.find('[data-testid="progress"]')
    expect(progress.exists()).toBe(true)
  })

  it('should show error message when loading fails', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = true
    mockIsError.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    expect(wrapper.text()).toContain('An error occurred')
  })

  it('should not show error message when no error', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsError.value = false

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    expect(wrapper.text()).not.toContain('An error occurred')
  })

  it('should display room ID in header during gameplay', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    expect(wrapper.text()).toContain('Room #room123')
  })

  it('should show game UI when loaded and playing', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const map = wrapper.find('[data-testid="map"]')
    const streetview = wrapper.find('[data-testid="streetview"]')
    expect(map.exists()).toBe(true)
    expect(streetview.exists()).toBe(true)
  })

  it('should show Make Guess button during gameplay when result not shown', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.exists()).toBe(true)
  })

  it('should not show Next Round button when playing and result not shown', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
    expect(nextRoundButton.exists()).toBe(false)
  })

  it('should not show Summary button when game is still playing', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    expect(summaryButton.exists()).toBe(false)
  })

  it('should not show game summary in default game state', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const gameSummary = wrapper.find('[data-testid="game-summary"]')
    expect(gameSummary.exists()).toBe(false)
  })

  it('should not show HeaderComponent in gameplay state', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const header = wrapper.find('[data-testid="header"]')
    expect(header.exists()).toBe(false)
  })

  it('should disable Make Guess button when no marker is placed', () => {
    mockIsWaiting.value = false
    mockIsLoading.value = false
    mockIsLoaded.value = true
    mockIsPlaying.value = true

    const wrapper = mount(MultiplayerGamePage, {
      props: {
        roomId: 'room123',
      },
    })

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.attributes('disabled')).toBeDefined()
  })
})
