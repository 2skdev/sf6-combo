<script setup lang="ts">
import { RouterView } from 'vue-router'
import FooterComponent from './components/FooterComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import { useAuth } from './composables/useAuth'

const { loading } = useAuth()
</script>

<template>

  <div v-if="loading" class="w-screen h-screen flex items-center justify-center">
    <span class="loading loading-ring loading-xl"></span>
  </div>

  <div v-else class="min-h-screen flex flex-col">
    <HeaderComponent />

    <main class="container mx-auto p-4 flex-1 mt-16">
      <RouterView />
    </main>

    <FooterComponent />
  </div>
</template>
