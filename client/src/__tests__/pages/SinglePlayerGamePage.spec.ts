import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import SinglePlayerGamePage from '@/pages/SinglePlayerGamePage.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  onBeforeRouteLeave: vi.fn(),
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
  distanceUnit: 'km',
  avatarEmoji: '🎮',
  avatarBg: 'blue',
})

vi.mock('@/composables/useUserQuery', () => ({
  default: () => ({
    user: mockUser,
    mutateUserUpdate: vi.fn(),
  }),
}))

const mockImages = ref([
  { id: 'img1', lat: 35.6762, lng: 139.6503 },
  { id: 'img2', lat: 40.7128, lng: -74.006 },
])
const mockIsFetching = ref(false)
const mockIsSuccess = ref(true)

vi.mock('@/composables/useImagesQuery', () => ({
  default: () => ({
    images: mockImages,
    isFetchingOnFetchImages: mockIsFetching,
    isSuccessOnFetchImages: mockIsSuccess,
    refetchImages: vi.fn(),
  }),
}))

vi.mock('@/stores/gameConfig', () => ({
  default: () => ({
    mapType: 'world',
    timeLimit: 60,
    onlyPanorama: false,
    allowMoving: true,
    allowZooming: true,
  }),
}))

vi.mock('@/components/MapComponent.vue', () => ({
  default: {
    template:
      '<div data-testid="map"><button data-testid="emit-marker-placed" @click="$emit(\'marker-placed\', { lat: 35.6762, lng: 139.6503 })">Place Marker</button></div>',
    methods: {
      disableClicks: vi.fn(),
      showCorrectLocation: vi.fn(),
      centerMapOnMarkers: vi.fn(),
      clearMarker: vi.fn(),
      enableClicks: vi.fn(),
      removeMarkers: vi.fn(),
    },
    emits: ['marker-placed'],
  },
}))

vi.mock('@/components/StreetViewComponent.vue', () => ({
  default: {
    template:
      '<div data-testid="streetview"><button data-testid="emit-image-loaded" @click="$emit(\'image-loaded\', { lat: 35.6762, lng: 139.6503 }, \'img1\')">Load Image</button></div>',
    methods: {
      loadRandomView: vi.fn(),
    },
    emits: ['image-loaded', 'image-loading-start'],
  },
}))

vi.mock('@/components/HeaderComponent.vue', () => ({
  default: {
    template: '<header data-testid="header">Header</header>',
  },
}))

vi.mock('@/components/GameSummarySinglePlayerComponent.vue', () => ({
  default: {
    template:
      '<div data-testid="game-summary"><button data-testid="emit-play-again" @click="$emit(\'play-again\')">Play Again</button><button data-testid="emit-return-to-menu" @click="$emit(\'return-to-menu\')">Return</button></div>',
    props: ['totalScore', 'averageScore', 'gameRecords', 'distanceUnit'],
    emits: ['play-again', 'return-to-menu'],
  },
}))

vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    template:
      '<button :disabled="disabled" :data-testid="$attrs[\'data-testid\']"><slot /></button>',
    props: ['variant', 'disabled'],
  },
}))

describe('SinglePlayerGamePage', () => {
  beforeEach(() => {
    mockFormattedTime.value = '01:00'
    mockIsExpired.value = false
    mockIsFetching.value = false
    mockIsSuccess.value = true
    mockPush.mockClear()
  })

  it('should display current round number', () => {
    const wrapper = mount(SinglePlayerGamePage)

    expect(wrapper.text()).toContain('Round 1 / 5')
  })

  it('should display formatted time', () => {
    mockFormattedTime.value = '00:45'

    const wrapper = mount(SinglePlayerGamePage)

    expect(wrapper.text()).toContain('[Time: 00:45]')
  })

  it('should display total score', () => {
    const wrapper = mount(SinglePlayerGamePage)

    expect(wrapper.text()).toContain('[Score: 0]')
  })

  it('should not show header component in default game state', () => {
    const wrapper = mount(SinglePlayerGamePage)

    const header = wrapper.find('[data-testid="header"]')
    expect(header.exists()).toBe(false)
  })

  it('should show Loading text in Make Guess button when images are loading', () => {
    mockIsFetching.value = true

    const wrapper = mount(SinglePlayerGamePage)

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.text()).toContain('Loading')
  })

  it('should show Make Guess text when not loading', () => {
    mockIsFetching.value = false

    const wrapper = mount(SinglePlayerGamePage)

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.text()).toContain('Make Guess')
  })

  it('should disable Make Guess button when no marker is placed', () => {
    const wrapper = mount(SinglePlayerGamePage)

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.attributes('disabled')).toBeDefined()
  })

  it('should show Make Guess button when result is not shown', () => {
    const wrapper = mount(SinglePlayerGamePage)

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
    const summaryButton = wrapper.find('[data-testid="summary-button"]')

    expect(makeGuessButton.exists()).toBe(true)
    expect(nextRoundButton.exists()).toBe(false)
    expect(summaryButton.exists()).toBe(false)
  })

  // showSummaryView state tests
  it('should not show game summary in default game state', () => {
    const wrapper = mount(SinglePlayerGamePage)

    const gameSummary = wrapper.find('[data-testid="game-summary"]')
    expect(gameSummary.exists()).toBe(false)
  })

  it('should show main game content when not in summary view', () => {
    const wrapper = mount(SinglePlayerGamePage)

    const map = wrapper.find('[data-testid="map"]')
    const streetview = wrapper.find('[data-testid="streetview"]')
    expect(map.exists()).toBe(true)
    expect(streetview.exists()).toBe(true)
  })

  // User interaction flow tests
  it('should enable Make Guess button after marker is placed', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Simulate image loaded event first
    const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
    await loadImageButton.trigger('click')

    // Simulate marker placed
    const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
    await placeMarkerButton.trigger('click')

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButton.attributes('disabled')).toBeUndefined()
  })

  it('should show Next Round button after making a guess in round 1', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Load image
    const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
    await loadImageButton.trigger('click')

    // Place marker
    const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
    await placeMarkerButton.trigger('click')

    // Make guess
    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    await makeGuessButton.trigger('click')

    const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
    expect(nextRoundButton.exists()).toBe(true)
  })

  it('should hide Make Guess button after making a guess', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Load image
    const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
    await loadImageButton.trigger('click')

    // Place marker
    const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
    await placeMarkerButton.trigger('click')

    // Make guess
    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    await makeGuessButton.trigger('click')

    const makeGuessButtonAfter = wrapper.find('[data-testid="make-guess-button"]')
    expect(makeGuessButtonAfter.exists()).toBe(false)
  })

  it('should navigate to game page when return-to-menu is emitted from summary', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Complete 5 rounds to get to summary
    for (let round = 1; round <= 5; round++) {
      const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
      await loadImageButton.trigger('click')

      const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
      await placeMarkerButton.trigger('click')

      const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
      await makeGuessButton.trigger('click')

      if (round < 5) {
        const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
        await nextRoundButton.trigger('click')
      }
    }

    // Click Summary button
    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    await summaryButton.trigger('click')

    // Click return to menu
    const returnToMenuButton = wrapper.find('[data-testid="emit-return-to-menu"]')
    await returnToMenuButton.trigger('click')

    expect(mockPush).toHaveBeenCalledWith('/game')
  })

  it('should show HeaderComponent when in summary view', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Complete 5 rounds to get to summary
    for (let round = 1; round <= 5; round++) {
      const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
      await loadImageButton.trigger('click')

      const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
      await placeMarkerButton.trigger('click')

      const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
      await makeGuessButton.trigger('click')

      if (round < 5) {
        const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
        await nextRoundButton.trigger('click')
      }
    }

    // Click Summary button
    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    await summaryButton.trigger('click')

    const header = wrapper.find('[data-testid="header"]')
    expect(header.exists()).toBe(true)
  })

  it('should show game summary component when in summary view', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Complete 5 rounds to get to summary
    for (let round = 1; round <= 5; round++) {
      const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
      await loadImageButton.trigger('click')

      const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
      await placeMarkerButton.trigger('click')

      const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
      await makeGuessButton.trigger('click')

      if (round < 5) {
        const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
        await nextRoundButton.trigger('click')
      }
    }

    // Click Summary button
    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    await summaryButton.trigger('click')

    const gameSummary = wrapper.find('[data-testid="game-summary"]')
    expect(gameSummary.exists()).toBe(true)
  })

  it('should hide main game content when in summary view', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Complete 5 rounds to get to summary
    for (let round = 1; round <= 5; round++) {
      const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
      await loadImageButton.trigger('click')

      const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
      await placeMarkerButton.trigger('click')

      const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
      await makeGuessButton.trigger('click')

      if (round < 5) {
        const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
        await nextRoundButton.trigger('click')
      }
    }

    // Click Summary button
    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    await summaryButton.trigger('click')

    const map = wrapper.find('[data-testid="map"]')
    const streetview = wrapper.find('[data-testid="streetview"]')
    expect(map.exists()).toBe(false)
    expect(streetview.exists()).toBe(false)
  })

  it('should show Summary button after making guess in final round', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Complete 5 rounds
    for (let round = 1; round <= 5; round++) {
      const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
      await loadImageButton.trigger('click')

      const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
      await placeMarkerButton.trigger('click')

      const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
      await makeGuessButton.trigger('click')

      if (round < 5) {
        const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
        await nextRoundButton.trigger('click')
      }
    }

    // After final round, Summary button should appear
    const summaryButton = wrapper.find('[data-testid="summary-button"]')
    expect(summaryButton.exists()).toBe(true)
  })

  it('should increment round number after clicking Next Round', async () => {
    const wrapper = mount(SinglePlayerGamePage)

    // Round 1
    const loadImageButton = wrapper.find('[data-testid="emit-image-loaded"]')
    await loadImageButton.trigger('click')

    const placeMarkerButton = wrapper.find('[data-testid="emit-marker-placed"]')
    await placeMarkerButton.trigger('click')

    const makeGuessButton = wrapper.find('[data-testid="make-guess-button"]')
    await makeGuessButton.trigger('click')

    const nextRoundButton = wrapper.find('[data-testid="next-round-button"]')
    await nextRoundButton.trigger('click')

    expect(wrapper.text()).toContain('Round 2 / 5')
  })
})
