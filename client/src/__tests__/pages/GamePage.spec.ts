import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GamePage from '@/pages/GamePage.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  onBeforeRouteLeave: vi.fn(),
}))

const mockCurrentUser = ref<{ uid: string } | null>(null)
const mockIsCurrentUserLoaded = ref(true)

vi.mock('@/composables/useAuth', () => ({
  default: () => ({
    currentUser: mockCurrentUser,
    isCurrentUserLoaded: mockIsCurrentUserLoaded,
    signUpWithGoogle: vi.fn(),
    signOut: vi.fn(),
  }),
}))

vi.mock('@/composables/useUserQuery', () => ({
  default: () => ({
    user: ref({
      id: 'user123',
      avatarEmoji: '🎮',
      avatarBg: 'blue',
      name: 'Test',
      distanceUnit: 'km',
    }),
    mutateUserUpdateAsync: vi.fn(),
    isPendingOnUpdateUser: ref(false),
    mutateUserDeleteAsync: vi.fn(),
    isPendingOnDeleteUser: ref(false),
  }),
}))

vi.mock('@/composables/useDailyScoreQuery', () => ({
  default: () => ({
    todayTopScores: ref({ scores: [] }),
  }),
}))

vi.mock('@/composables/useMultiplayerRoom', () => ({
  useMultiplayerRoom: () => ({
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    isLoading: ref(false),
  }),
}))

vi.mock('@/components/HeaderComponent.vue', () => ({
  default: {
    template: '<header>Header</header>',
  },
}))

vi.mock('@/components/CustomCheckboxComponent.vue', () => ({
  default: {
    template: '<div><slot /></div>',
    props: ['id', 'label', 'modelValue'],
  },
}))

vi.mock('@/components/CustomSliderComponent.vue', () => ({
  default: {
    template: '<div><slot /></div>',
    props: [
      'label',
      'modelValue',
      'min',
      'max',
      'step',
      'unit',
      'unlimitedValue',
      'unlimitedText',
      'helpText',
    ],
  },
}))

vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    template: '<button :disabled="disabled"><slot /></button>',
    props: ['variant', 'size', 'disabled'],
  },
}))

vi.mock('@/components/ui/select/Select.vue', () => ({
  default: { template: '<div><slot /></div>', props: ['modelValue', 'disabled'] },
}))

vi.mock('@/components/ui/select/SelectContent.vue', () => ({
  default: { template: '<div><slot /></div>' },
}))

vi.mock('@/components/ui/select/SelectItem.vue', () => ({
  default: { template: '<div><slot /></div>', props: ['value'] },
}))

vi.mock('@/components/ui/select/SelectTrigger.vue', () => ({
  default: { template: '<div><slot /></div>', props: ['disabled'] },
}))

vi.mock('@/components/ui/select/SelectValue.vue', () => ({
  default: { template: '<div><slot /></div>', props: ['placeholder'] },
}))

vi.mock('@/components/ui/input/Input.vue', () => ({
  default: {
    template: '<input />',
    props: ['modelValue', 'placeholder'],
  },
}))

describe('GamePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true
  })

  const mountGamePage = () =>
    mount(GamePage, {
      global: {
        stubs: {
          'emoji-picker': true,
        },
      },
    })

  const findGameModeButton = (wrapper: ReturnType<typeof mount>, label: string) => {
    return wrapper.findAll('button').find((button) => button.text().includes(label))
  }

  it('should apply unavailable styles to multiplayer when not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mountGamePage()
    const multiplayerButton = findGameModeButton(wrapper, 'Multiplayer')

    expect(multiplayerButton?.classes()).toContain('opacity-50')
    expect(multiplayerButton?.classes()).toContain('cursor-not-allowed')
  })

  it('should apply unavailable styles to daily challenge when not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mountGamePage()
    const dailyChallengeButton = findGameModeButton(wrapper, 'Daily Challenge')

    expect(dailyChallengeButton?.classes()).toContain('opacity-50')
    expect(dailyChallengeButton?.classes()).toContain('cursor-not-allowed')
  })

  it('should not apply unavailable styles when logged in', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mountGamePage()
    const multiplayerButton = findGameModeButton(wrapper, 'Multiplayer')
    const dailyChallengeButton = findGameModeButton(wrapper, 'Daily Challenge')

    expect(multiplayerButton?.classes()).not.toContain('opacity-50')
    expect(multiplayerButton?.classes()).not.toContain('cursor-not-allowed')
    expect(dailyChallengeButton?.classes()).not.toContain('opacity-50')
    expect(dailyChallengeButton?.classes()).not.toContain('cursor-not-allowed')
  })
})
