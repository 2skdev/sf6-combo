<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { useCharacter } from '@/composables/useCharacter';

const { characters } = useCharacter()
const { user } = useAuth()
</script>

<template>
  <div class="font-bold mb-8">お気に入り</div>
  <div class="font-bold mb-8">キャラクター一覧</div>
  <div class="relative grid grid-cols-4 gap-4">
    <RouterLink :to='`/${user?.uid ?? "unknown"}/${character.id}`' v-for="character in characters" :key="character.id">
      <img :src="character.base64" class="rounded-full outline-4 outline-base-200 hover:outline-primary bg-base-300">
      <div class="">{{ character.name }}</div>
    </RouterLink>
  </div>
</template>
