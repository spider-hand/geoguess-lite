import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomSliderComponent from '@/components/CustomSliderComponent.vue'

vi.mock('@/components/ui/slider', () => ({
  Slider: {
    template: '<div data-testid="slider"></div>',
    props: ['modelValue', 'min', 'max', 'step'],
  },
}))

describe('CustomSliderComponent', () => {
  it('should display unlimited text when value equals unlimitedValue', () => {
    const wrapper = mount(CustomSliderComponent, {
      props: {
        label: 'Time Limit',
        modelValue: 0,
        min: 0,
        max: 300,
        step: 60,
        unlimitedValue: 0,
        unlimitedText: 'No Limit',
      },
    })

    expect(wrapper.text()).toContain('No Limit')
  })

  it('should display value with unit when not unlimited', () => {
    const wrapper = mount(CustomSliderComponent, {
      props: {
        label: 'Time Limit',
        modelValue: 120,
        min: 0,
        max: 300,
        step: 60,
        unit: 's',
        unlimitedValue: 0,
      },
    })

    expect(wrapper.text()).toContain('120s')
  })

  it('should display help text when provided', () => {
    const wrapper = mount(CustomSliderComponent, {
      props: {
        label: 'Time Limit',
        modelValue: 60,
        min: 0,
        max: 300,
        step: 60,
        helpText: 'Set to 0 for unlimited',
      },
    })

    expect(wrapper.text()).toContain('Set to 0 for unlimited')
  })

  it('should not display help text when not provided', () => {
    const wrapper = mount(CustomSliderComponent, {
      props: {
        label: 'Time Limit',
        modelValue: 60,
        min: 0,
        max: 300,
        step: 60,
      },
    })

    const helpText = wrapper.find('[data-testid="help-text"]')
    expect(helpText.exists()).toBe(false)
  })

  it('should display min and max values with unit suffix', () => {
    const wrapper = mount(CustomSliderComponent, {
      props: {
        label: 'Time Limit',
        modelValue: 150,
        min: 0,
        max: 300,
        step: 60,
        unit: 's',
      },
    })

    expect(wrapper.text()).toContain('0s')
    expect(wrapper.text()).toContain('300s')
  })
})
