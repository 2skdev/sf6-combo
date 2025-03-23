<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { error, login } = useAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  await login(email.value, password.value)
  if (!error.value) {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <div class="text-2xl font-bold">ログイン</div>

    <div class="w-full max-w-xs flex flex-col space-y-4 mt-6">
      <input v-model="email" type="email" placeholder="メールアドレス" class="input input-borderd" />
      <input v-model="password" type="password" placeholder="パスワード" class="input input-borderd" />
      <button @click="handleLogin" class="btn btn-primary">ログイン</button>
      <RouterLink to="/register" class="btn btn-link">登録</RouterLink>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>
