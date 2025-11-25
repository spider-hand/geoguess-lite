<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import useUserQuery from './composables/useUserQuery'
import { useQueryClient } from '@tanstack/vue-query'
import useAuth from './composables/useAuth'

const queryClient = useQueryClient()
const currentUser = useCurrentUser()
const router = useRouter()
const route = useRoute()
const { signOut } = useAuth()

const {
  isErrorOnFetchUser,
} = useUserQuery()

watch(currentUser, async (newVal, oldVal) => {
  // Redirect to landing page if user logs out on a protected route
  if (
    !newVal &&
    oldVal &&
    route.meta.requiresAuth
  ) {
    queryClient.clear()
    return router.push({ name: 'landing' })
  } else if (newVal) {
    return router.push({ name: 'game' })
  }
}, { immediate: true }
)

watch(isErrorOnFetchUser, (newVal) => {
  if (newVal) {
    signOut()
  }
})
</script>
