<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import type { ParsedToken } from 'firebase/auth';
import { onMounted, ref } from 'vue';

const claimns = ref<ParsedToken>()

onMounted(async () => {
  const { getCustomClaims } = useAuth()
  claimns.value = await getCustomClaims()
})
</script>

<template>
  <footer class="bg-base-200 w-full mt-auto h-10 mx-auto space-x-8 flex items-center justify-center text-xs">
    <RouterLink to="/about">about</RouterLink>
    <RouterLink v-if="claimns && claimns['admin'] === 1" to="/admin/character">character</RouterLink>
  </footer>
</template>
