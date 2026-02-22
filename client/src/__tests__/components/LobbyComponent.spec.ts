import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LobbyComponent from '@/components/LobbyComponent.vue'
import type { GameConfigNode, PlayerResult } from '@/types'

vi.mock('@/components/ui/card', () => ({
  Card: {
    template: '<div><slot /></div>',
  },
  CardContent: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: {
    template:
      '<button :disabled="disabled" :data-testid="$attrs[\'data-testid\']" @click="$emit(\'click\')"><slot /></button>',
    props: ['variant', 'size', 'disabled'],
    emits: ['click'],
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
  status: 'Guessing',
  ...overrides,
})

const createMockGameConfig = (): GameConfigNode => ({
  mapType: 'world',
  timeLimit: 60,
  onlyPanorama: false,
  allowMoving: true,
  allowZooming: true,
})

describe('LobbyComponent', () => {
  it('should disable Start Game button when there are less than 2 players', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [createMockPlayer({ isHost: true })],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const startButton = wrapper.find('[data-testid="start-game-button"]')
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('should disable Start Game button when user is not the host', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player2',
          name: 'Player',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: false,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2', isHost: false }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const startButton = wrapper.find('[data-testid="start-game-button"]')
    expect(startButton.attributes('disabled')).toBeDefined()
  })

  it('should enable Start Game button when host and 2+ players', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const startButton = wrapper.find('[data-testid="start-game-button"]')
    expect(startButton.attributes('disabled')).toBeUndefined()
  })

  it('should show loading text when creating rounds', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: true,
      },
    })

    expect(wrapper.text()).toContain('Creating the game')
  })

  it('should show Start Game text when not creating rounds', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const startButton = wrapper.find('[data-testid="start-game-button"]')
    expect(startButton.text()).toContain('Start Game')
    expect(startButton.text()).not.toContain('Creating the game')
  })

  it('should hide Leave Room button when creating rounds', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: true,
      },
    })

    const leaveButton = wrapper.find('[data-testid="leave-room-button"]')
    expect(leaveButton.exists()).toBe(false)
  })

  it('should show Leave Room button when not creating rounds', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const leaveButton = wrapper.find('[data-testid="leave-room-button"]')
    expect(leaveButton.exists()).toBe(true)
  })

  it('should display time limit as Unlimited when set to 0', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [createMockPlayer({ isHost: true })],
        gameConfig: { ...createMockGameConfig(), timeLimit: 0 },
        isCreatingRounds: false,
      },
    })

    expect(wrapper.text()).toContain('Unlimited')
  })

  it('should display time limit with seconds suffix when not unlimited', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [createMockPlayer({ isHost: true })],
        gameConfig: { ...createMockGameConfig(), timeLimit: 60 },
        isCreatingRounds: false,
      },
    })

    expect(wrapper.text()).toContain('60s')
  })

  // Button click emit tests
  it('should emit startGame when Start Game button is clicked', async () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const startButton = wrapper.find('[data-testid="start-game-button"]')
    await startButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('startGame')
  })

  it('should emit leaveRoom when Leave Room button is clicked', async () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', isHost: true }),
          createMockPlayer({ id: 'player2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    const leaveButton = wrapper.find('[data-testid="leave-room-button"]')
    await leaveButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('leaveRoom')
  })

  it('should display room ID in header', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [createMockPlayer({ isHost: true })],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    expect(wrapper.text()).toContain('Room #room123')
  })

  it('should display all players in the lobby', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [
          createMockPlayer({ id: 'player1', name: 'Player 1', isHost: true }),
          createMockPlayer({ id: 'player2', name: 'Player 2' }),
        ],
        gameConfig: createMockGameConfig(),
        isCreatingRounds: false,
      },
    })

    expect(wrapper.text()).toContain('Player 1')
    expect(wrapper.text()).toContain('Player 2')
    expect(wrapper.text()).toContain('Players (2)')
  })

  it('should display game configuration settings', () => {
    const wrapper = mount(LobbyComponent, {
      props: {
        roomId: 'room123',
        myself: {
          id: 'player1',
          name: 'Host',
          emoji: '🎮',
          avatarClass: 'bg-blue-100',
          isHost: true,
        },
        players: [createMockPlayer({ isHost: true })],
        gameConfig: {
          mapType: 'world',
          timeLimit: 60,
          onlyPanorama: true,
          allowMoving: false,
          allowZooming: true,
        },
        isCreatingRounds: false,
      },
    })

    expect(wrapper.text()).toContain('world')
    expect(wrapper.text()).toContain('60s')
    expect(wrapper.text()).toContain('Yes') // onlyPanorama and allowZooming
    expect(wrapper.text()).toContain('No') // allowMoving
  })
})
