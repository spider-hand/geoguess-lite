import { createRouter, createWebHistory } from 'vue-router'

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
  ],
})

export default router
