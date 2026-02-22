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

vi.mock('@/components/CustomCardComponent.vue', () => ({
  default: {
    template: '<div class="game-mode-card"><slot /></div>',
    props: ['title', 'description', 'icon', 'bgClass', 'iconClass'],
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

vi.mock('@/components/ui/card', () => ({
  Card: { template: '<div><slot /></div>' },
  CardContent: { template: '<div><slot /></div>' },
}))

vi.mock('@/components/ui/button', () => ({
  Button: {
    template: '<button :disabled="disabled"><slot /></button>',
    props: ['variant', 'size', 'disabled'],
  },
}))

vi.mock('@/components/ui/select', () => ({
  Select: { template: '<div><slot /></div>', props: ['modelValue'] },
  SelectContent: { template: '<div><slot /></div>' },
  SelectItem: { template: '<div><slot /></div>', props: ['value'] },
  SelectTrigger: { template: '<div><slot /></div>' },
  SelectValue: { template: '<div><slot /></div>', props: ['placeholder'] },
}))

vi.mock('@/components/ui/input', () => ({
  Input: {
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

  it('should show Sign up required message for multiplayer when not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(GamePage)

    expect(wrapper.text()).toContain('Sign up required')
  })

  it('should show Sign up required message for daily challenge when not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(GamePage)

    // Daily challenge and multiplayer require sign up
    const signUpMessages = wrapper.findAll('[data-testid="sign-up-required"]')
    expect(signUpMessages.length).toBeGreaterThanOrEqual(1)
  })

  it('should not show Sign up required when logged in', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(GamePage)

    expect(wrapper.text()).not.toContain('Sign up required')
  })
})
