import { ref, computed, onUnmounted } from 'vue'

export function useTimer(timeLimitInSeconds: number) {
  const isActive = ref(false)
  const startTime = ref(0)
  const elapsedTime = ref(0)
  let animationFrame: number | null = null

  const remainingTime = computed(() => {
    if (timeLimitInSeconds <= 0) return Infinity // Unlimited time
    return Math.max(0, timeLimitInSeconds - elapsedTime.value)
  })

  const isExpired = computed(() => {
    return timeLimitInSeconds > 0 && remainingTime.value <= 0
  })

  const formattedTime = computed(() => {
    if (timeLimitInSeconds <= 0) return 'Unlimited'
    
    const time = Math.ceil(remainingTime.value)
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const updateTimer = () => {
    if (!isActive.value) return
    
    const currentTime = performance.now()
    elapsedTime.value = (currentTime - startTime.value) / 1000 // Convert to seconds
    
    if (timeLimitInSeconds > 0 && elapsedTime.value >= timeLimitInSeconds) {
      stop()
      return
    }
    
    animationFrame = requestAnimationFrame(updateTimer)
  }

  const start = () => {
    if (isActive.value) return
    
    startTime.value = performance.now()
    isActive.value = true
    elapsedTime.value = 0
    animationFrame = requestAnimationFrame(updateTimer)
  }

  const stop = () => {
    isActive.value = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  const reset = () => {
    stop()
    elapsedTime.value = 0
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isActive,
    remainingTime,
    isExpired,
    formattedTime,
    elapsedTime,
    start,
    stop,
    reset
  }
}