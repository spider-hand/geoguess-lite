<template>
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

const auth = useFirebaseAuth()
const currentUser = useCurrentUser()

watch(currentUser, async (newVal, oldVal) => {
  try {
    if (!newVal && oldVal) {
      // User has logged out
      console.log('User logged out')
    } else if (newVal) {
      if (!oldVal) {
        // User has logged in
        console.log('User logged in:', newVal)
      }
    }
  } catch (error) {
    console.error('currentUser watch error:', error)
    auth?.signOut()
  }
})

// TODO: Force the user to sign out when failing to fetch the user from database
</script>
