import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '@/composables/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return Unlimited when time limit is 0', () => {
    const { formattedTime } = useTimer(0)
    expect(formattedTime.value).toBe('Unlimited')
  })

  it('should return Infinity remaining time when time limit is 0', () => {
    const { remainingTime } = useTimer(0)
    expect(remainingTime.value).toBe(Infinity)
  })

  it('should format time as MM:SS', () => {
    const { formattedTime } = useTimer(125)
    expect(formattedTime.value).toBe('02:05')
  })

  it('should not be expired initially when time limit is set', () => {
    const { isExpired } = useTimer(60)
    expect(isExpired.value).toBe(false)
  })

  it('should never expire when time limit is 0', () => {
    const { isExpired, start } = useTimer(0)
    start()
    vi.advanceTimersByTime(100000)
    expect(isExpired.value).toBe(false)
  })

  it('should set isActive to true when started', () => {
    const { isActive, start } = useTimer(60)
    expect(isActive.value).toBe(false)
    start()
    expect(isActive.value).toBe(true)
  })

  it('should reset elapsed time and stop when reset is called', () => {
    const { elapsedTime, isActive, start, reset } = useTimer(60)
    start()
    vi.advanceTimersByTime(5000)
    reset()
    expect(elapsedTime.value).toBe(0)
    expect(isActive.value).toBe(false)
  })
})
