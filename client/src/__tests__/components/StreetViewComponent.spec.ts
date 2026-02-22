import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StreetViewComponent from '@/components/StreetViewComponent.vue'

vi.mock('mapillary-js', () => ({
  Viewer: vi.fn().mockImplementation(() => ({
    remove: vi.fn(),
    moveTo: vi.fn(),
    getPosition: vi.fn(),
  })),
}))

vi.mock('@/components/ui/spinner/Spinner.vue', () => ({
  default: {
    template: '<div data-testid="spinner">Loading...</div>',
  },
}))

describe('StreetViewComponent', () => {
  it('should show spinner when isLoading is true', () => {
    const wrapper = mount(StreetViewComponent, {
      props: {
        isLoading: true,
      },
    })

    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(true)
  })

  it('should hide spinner when isLoading is false', () => {
    const wrapper = mount(StreetViewComponent, {
      props: {
        isLoading: false,
      },
    })

    expect(wrapper.find('[data-testid="spinner"]').exists()).toBe(false)
  })

  it('should show result overlay when showResult is true', () => {
    const wrapper = mount(StreetViewComponent, {
      props: {
        showResult: true,
        resultScore: 4500,
        resultDistance: 100,
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('4500 points')
    expect(wrapper.text()).toContain('100km away')
  })

  it('should show time up message when resultDistance is -1', () => {
    const wrapper = mount(StreetViewComponent, {
      props: {
        showResult: true,
        resultScore: 0,
        resultDistance: -1,
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain("Time's up! No guess made.")
  })

  it('should hide result overlay when showResult is false', () => {
    const wrapper = mount(StreetViewComponent, {
      props: {
        showResult: false,
        resultScore: 4500,
        resultDistance: 100,
      },
    })

    expect(wrapper.text()).not.toContain('points')
  })
})
