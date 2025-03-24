<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { error, register } = useAuth()

const email = ref('')
const password = ref('')

const handleRegister = async () => {
  await register(email.value, password.value)
  if (!error.value) {
    router.push('/')
  }
}
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <div class="text-2xl font-bold">登録</div>

    <div class="w-full max-w-xs flex flex-col space-y-4 mt-6">
      <input
        v-model="email"
        type="email"
        placeholder="メールアドレス"
        class="input input-borderd"
      />
      <input
        v-model="password"
        type="password"
        placeholder="パスワード"
        class="input input-borderd"
      />
      <button @click="handleRegister" class="btn btn-primary">登録</button>
      <RouterLink to="/login" class="btn btn-link">ログイン</RouterLink>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>
