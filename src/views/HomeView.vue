<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useCharacter } from '@/composables/useCharacter'

const { characters } = useCharacter()
const { user } = useAuth()
</script>

<template>
  <div class="text-lg font-bold mb-4">キャラクター一覧</div>

  <div class="relative grid grid-cols-4 gap-4">
    <RouterLink
      :to="`/${user?.uid ?? 'unknown'}/${character.id}`"
      v-for="character in characters"
      :key="character.id"
    >
      <img
        :src="character.base64"
        class="rounded-full outline-4 outline-transparent hover:outline-primary bg-base-200"
      />
      <div class="">{{ character.name }}</div>
    </RouterLink>
  </div>
</template>
