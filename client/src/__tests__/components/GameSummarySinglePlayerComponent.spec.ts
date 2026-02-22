import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameSummarySinglePlayerComponent from '@/components/GameSummarySinglePlayerComponent.vue'
import type { RoundRecord } from '@/types'

vi.mock('@/components/MapComponent.vue', () => ({
  default: {
    template: '<div data-testid="map">Map</div>',
  },
}))

vi.mock('@/components/StreetViewComponent.vue', () => ({
  default: {
    template: '<div data-testid="streetview">StreetView</div>',
  },
}))

vi.mock('@/components/SummaryCardComponent.vue', () => ({
  default: {
    template: '<div :data-title="title" :data-value="value">{{ title }}: {{ value }}</div>',
    props: ['title', 'value', 'icon', 'bgClass', 'iconClass'],
  },
}))

vi.mock('@/components/ui/accordion/Accordion.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/accordion/AccordionContent.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/accordion/AccordionItem.vue', () => ({
  default: {
    template: '<div><slot /></div>',
    props: ['value'],
  },
}))

vi.mock('@/components/ui/accordion/AccordionTrigger.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/card/Card.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/card/CardContent.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/card/CardHeader.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/card/CardTitle.vue', () => ({
  default: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    template:
      '<button :data-testid="$attrs[\'data-testid\']" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant'],
    emits: ['click'],
  },
}))

vi.mock('@/components/ui/progress/Progress.vue', () => ({
  default: {
    template: '<div data-testid="progress"></div>',
    props: ['modelValue', 'max'],
  },
}))

const createMockRoundRecord = (overrides: Partial<RoundRecord> = {}): RoundRecord => ({
  round: 1,
  score: 1000,
  distance: 100,
  correctLocation: { lat: 0, lng: 0 },
  playerLocations: [],
  mapCenter: [0, 0],
  mapZoom: 5,
  imageId: 'img123',
  ...overrides,
})

describe('GameSummarySinglePlayerComponent', () => {
  it('should calculate total distance from all rounds', () => {
    const gameRecords = [
      createMockRoundRecord({ round: 1, distance: 100 }),
      createMockRoundRecord({ round: 2, distance: 200 }),
      createMockRoundRecord({ round: 3, distance: 150 }),
    ]

    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords,
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('450km')
  })

  it('should exclude negative distances from total calculation', () => {
    const gameRecords = [
      createMockRoundRecord({ round: 1, distance: 100 }),
      createMockRoundRecord({ round: 2, distance: -1 }), // No guess made
      createMockRoundRecord({ round: 3, distance: 200 }),
    ]

    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 5000,
        averageScore: 1000,
        gameRecords,
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('300km')
  })

  it('should show Play Again button when isPlayAgainEnabled is true', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        isPlayAgainEnabled: true,
        distanceUnit: 'km',
      },
    })

    const playAgainButton = wrapper.find('[data-testid="play-again-button"]')
    expect(playAgainButton.exists()).toBe(true)
  })

  it('should hide Play Again button when isPlayAgainEnabled is false', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        isPlayAgainEnabled: false,
        distanceUnit: 'km',
      },
    })

    const playAgainButton = wrapper.find('[data-testid="play-again-button"]')
    expect(playAgainButton.exists()).toBe(false)
  })

  it('should always show Return to Main Menu button', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        isPlayAgainEnabled: false,
        distanceUnit: 'km',
      },
    })

    const returnButton = wrapper.find('[data-testid="return-to-menu-button"]')
    expect(returnButton.exists()).toBe(true)
  })

  it('should display average score with points suffix', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2500,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('2500 points')
  })

  it('should emit play-again when Play Again button is clicked', async () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        isPlayAgainEnabled: true,
        distanceUnit: 'km',
      },
    })

    const playAgainButton = wrapper.find('[data-testid="play-again-button"]')
    await playAgainButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('play-again')
  })

  it('should emit return-to-menu when Return to Menu button is clicked', async () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        isPlayAgainEnabled: true,
        distanceUnit: 'km',
      },
    })

    const returnButton = wrapper.find('[data-testid="return-to-menu-button"]')
    await returnButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('return-to-menu')
  })

  it('should display total score', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 15000,
        averageScore: 3000,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('15000')
  })

  it('should show Play Again button by default when isPlayAgainEnabled prop is not provided', () => {
    const wrapper = mount(GameSummarySinglePlayerComponent, {
      props: {
        totalScore: 10000,
        averageScore: 2000,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    const playAgainButton = wrapper.find('[data-testid="play-again-button"]')
    expect(playAgainButton.exists()).toBe(true)
  })
})
