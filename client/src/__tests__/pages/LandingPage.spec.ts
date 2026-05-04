import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import LandingPage from '@/pages/LandingPage.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockSignUpWithGoogle = vi.fn()
const mockCurrentUser = ref<{ uid: string } | null>(null)
const mockIsCurrentUserLoaded = ref(true)

vi.mock('@/composables/useAuth', () => ({
  default: () => ({
    currentUser: mockCurrentUser,
    isCurrentUserLoaded: mockIsCurrentUserLoaded,
    signUpWithGoogle: mockSignUpWithGoogle,
    signOut: vi.fn(),
  }),
}))

vi.mock('@/components/HeaderComponent.vue', () => ({
  default: {
    template: '<header data-testid="header">Header</header>',
  },
}))

describe('LandingPage', () => {
  beforeEach(() => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true
    mockPush.mockClear()
    mockSignUpWithGoogle.mockClear()
  })

  it('should navigate to game page when logged in user clicks Get Started', async () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(LandingPage)

    const getStartedButton = wrapper.find('[data-testid="get-started-button"]')
    await getStartedButton.trigger('click')

    expect(mockPush).toHaveBeenCalledWith({ name: 'game' })
  })

  it('should call signUpWithGoogle when guest clicks Get Started', async () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(LandingPage)

    const getStartedButton = wrapper.find('[data-testid="get-started-button"]')
    await getStartedButton.trigger('click')

    expect(mockSignUpWithGoogle).toHaveBeenCalled()
  })

  it('should show Continue as Guest button when not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(LandingPage)

    const guestButton = wrapper.find('[data-testid="continue-as-guest-button"]')
    expect(guestButton.exists()).toBe(true)
  })

  it('should hide Continue as Guest button when logged in', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(LandingPage)

    const guestButton = wrapper.find('[data-testid="continue-as-guest-button"]')
    expect(guestButton.exists()).toBe(false)
  })

  it('should disable buttons when user loading is not complete', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = false

    const wrapper = mount(LandingPage)

    const getStartedButton = wrapper.find('[data-testid="get-started-button"]')
    expect(getStartedButton.attributes('disabled')).toBeDefined()
  })

  it('should enable buttons when user loading is complete', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(LandingPage)

    const getStartedButton = wrapper.find('[data-testid="get-started-button"]')
    expect(getStartedButton.attributes('disabled')).toBeUndefined()
  })
})
