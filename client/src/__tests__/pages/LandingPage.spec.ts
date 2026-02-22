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

vi.mock('@/components/FooterComponent.vue', () => ({
  default: {
    template: '<footer data-testid="footer">Footer</footer>',
  },
}))

vi.mock('@/components/CustomCardComponent.vue', () => ({
  default: {
    template: '<div data-testid="card"><slot /></div>',
    props: ['title', 'description', 'icon', 'bgClass', 'iconClass', 'contentAlign', 'iconAlign'],
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: {
    template:
      '<button :disabled="disabled" :data-testid="$attrs[\'data-testid\']" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant', 'size', 'disabled'],
  },
}))

vi.mock('@/components/ui/accordion', () => ({
  Accordion: {
    template: '<div><slot /></div>',
    props: ['type', 'collapsible'],
  },
  AccordionContent: {
    template: '<div><slot /></div>',
  },
  AccordionItem: {
    template: '<div><slot /></div>',
    props: ['value'],
  },
  AccordionTrigger: {
    template: '<div><slot /></div>',
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
