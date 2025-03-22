<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()

const { setupListener, logout, user, error, loading } = useAuth()

const handleLogout = async () => {
  await logout()
  if (!error.value) {
    router.push('/login')
  }
}

onMounted(() => {
  const unsubscribe = setupListener()
  onUnmounted(unsubscribe)
})
</script>

<template>
  <header>
    <div class="container mx-auto bg-red-500">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <body class="container mx-auto">
    <div v-if="loading">
      <span class="loading loading-ring loading-xl"></span>
    </div>

    <div v-else>
      <RouterView />

      <button @click="handleLogout" class="btn">logout</button>

      <div>{{ user }}</div>
    </div>
  </body>
</template>
