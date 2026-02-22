import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import HeaderComponent from '@/components/HeaderComponent.vue'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockSignUpWithGoogle = vi.fn()
const mockSignOut = vi.fn()
const mockCurrentUser = ref<{ uid: string } | null>(null)
const mockIsCurrentUserLoaded = ref(true)

vi.mock('@/composables/useAuth', () => ({
  default: () => ({
    currentUser: mockCurrentUser,
    isCurrentUserLoaded: mockIsCurrentUserLoaded,
    signUpWithGoogle: mockSignUpWithGoogle,
    signOut: mockSignOut,
  }),
}))

describe('HeaderComponent', () => {
  beforeEach(() => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true
  })

  it('should show Sign Up button when user is not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signUpButton = wrapper.find('[data-testid="sign-up-button"]')
    expect(signUpButton.exists()).toBe(true)
  })

  it('should not show Sign Up button when user is logged in', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signUpButton = wrapper.find('[data-testid="sign-up-button"]')
    expect(signUpButton.exists()).toBe(false)
  })

  it('should not show Sign Up button when user loading is not complete', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = false

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signUpButton = wrapper.find('[data-testid="sign-up-button"]')
    expect(signUpButton.exists()).toBe(false)
  })

  it('should show Sign Out button when user is logged in', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signOutButton = wrapper.find('[data-testid="sign-out-button"]')
    expect(signOutButton.exists()).toBe(true)
  })

  it('should not show Sign Out button when user is not logged in', () => {
    mockCurrentUser.value = null
    mockIsCurrentUserLoaded.value = true

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signOutButton = wrapper.find('[data-testid="sign-out-button"]')
    expect(signOutButton.exists()).toBe(false)
  })

  it('should not show Sign Out button when user loading is not complete', () => {
    mockCurrentUser.value = { uid: 'user123' }
    mockIsCurrentUserLoaded.value = false

    const wrapper = mount(HeaderComponent, {
      global: {
        stubs: {
          Button: {
            template: '<button :data-testid="$attrs[\'data-testid\']"><slot /></button>',
            props: ['variant'],
          },
        },
      },
    })

    const signOutButton = wrapper.find('[data-testid="sign-out-button"]')
    expect(signOutButton.exists()).toBe(false)
  })
})
