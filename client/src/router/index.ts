import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/pages/LandingPage.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/pages/GamePage.vue'),
    },
    {
      path: '/game/single-player',
      name: 'game-single-player',
      component: () => import('@/pages/SinglePlayerGamePage.vue'),
    },
    {
      path: '/game/multiplayer/:roomId',
      name: 'game-multiplayer',
      component: () => import('@/pages/MultiplayerGamePage.vue'),
      meta: { requiresAuth: true },
      props: (route) => ({ roomId: route.params.roomId as string }),
    },
    {
      path: '/game/daily-challenge',
      name: 'game-daily-challenge',
      component: () => import('@/pages/DailyChallengeGamePage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }
})

export default router
