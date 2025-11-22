<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'

const currentUser = useCurrentUser()
const router = useRouter()
const route = useRoute()

watch(currentUser, (newVal, oldVal) => {
  // Redirect to landing page if user logs out on a protected route
  if (
    !newVal &&
    oldVal &&
    route.meta.requiresAuth
  ) {
    return router.push({ name: 'landing' })
  }

  if (newVal && typeof route.query.redirect === 'string') {
    return router.push(route.query.redirect)
  }
})
</script>
