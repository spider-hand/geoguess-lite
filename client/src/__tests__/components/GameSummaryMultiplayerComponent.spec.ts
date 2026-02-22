import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GameSummaryMultiplayerComponent from '@/components/GameSummaryMultiplayerComponent.vue'
import type { PlayerResult } from '@/types'

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

vi.mock('@/components/ui/button/Button.vue', () => ({
  default: {
    template: '<button><slot /></button>',
    props: ['variant'],
  },
}))

const createMockPlayer = (overrides: Partial<PlayerResult> = {}): PlayerResult => ({
  id: 'player1',
  name: 'Player 1',
  emoji: '🎮',
  avatarClass: 'bg-blue-100',
  isHost: false,
  score: 0,
  distance: 0,
  status: 'Guessed',
  ...overrides,
})

describe('GameSummaryMultiplayerComponent', () => {
  it('should sort players by score in descending order', () => {
    const players = [
      createMockPlayer({ id: 'p1', name: 'Low Score', score: 1000 }),
      createMockPlayer({ id: 'p2', name: 'High Score', score: 5000 }),
      createMockPlayer({ id: 'p3', name: 'Mid Score', score: 3000 }),
    ]

    const wrapper = mount(GameSummaryMultiplayerComponent, {
      props: {
        players,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    const playerNames = wrapper.findAll('[data-testid="player-name"]').map((el) => el.text())
    expect(playerNames[0]).toBe('High Score')
    expect(playerNames[1]).toBe('Mid Score')
    expect(playerNames[2]).toBe('Low Score')
  })

  it('should display player scores with points suffix', () => {
    const players = [createMockPlayer({ score: 12500 })]

    const wrapper = mount(GameSummaryMultiplayerComponent, {
      props: {
        players,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('12500 points')
  })

  it('should display player distances with correct unit', () => {
    const players = [createMockPlayer({ distance: 500 })]

    const wrapper = mount(GameSummaryMultiplayerComponent, {
      props: {
        players,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    expect(wrapper.text()).toContain('500km off')
  })

  it('should display ranking numbers for players', () => {
    const players = [
      createMockPlayer({ id: 'p1', score: 5000 }),
      createMockPlayer({ id: 'p2', score: 3000 }),
    ]

    const wrapper = mount(GameSummaryMultiplayerComponent, {
      props: {
        players,
        gameRecords: [],
        distanceUnit: 'km',
      },
    })

    const rankings = wrapper.findAll('[data-testid="player-rank"]')
    expect(rankings[0]?.text()).toBe('1')
    expect(rankings[1]?.text()).toBe('2')
  })
})
