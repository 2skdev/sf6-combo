<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()

const { withdraw } = useAuth()

const handleWithdraw = async () => {
  const ret = confirm('アカウントを削除しますか？')
  if (ret) {
    await withdraw()
    router.push('/')
  }
}
</script>

<template>
  <button @click="handleWithdraw" class="btn btn-error">アカウントを削除</button>
</template>
