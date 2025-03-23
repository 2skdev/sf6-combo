<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const { logout, user, error } = useAuth()

const handleLogout = async () => {
  await logout()
  if (!error.value) {
    router.push('/login')
  }
}
</script>

<template>
  <header class="navbar bg-base-200 shadow-sm px-6">
    <RouterLink to="/" class="btn btn-ghost text-2xl font-black">SF6 COMBO</RouterLink>

    <div class="ml-auto flex">
      <div v-if="user">
        <button class="btn btn-soft" popovertarget="popover-1" style="anchor-name: --anchor-1">
          {{ user?.email }}
        </button>
        <ul class="dropdown dropdown-end menu w-48 mt-2 rounded-box bg-base-200 shadow-sm" popover id="popover-1"
          style="position-anchor: --anchor-1">
          <li>
            <RouterLink to="/setting">設定</RouterLink>
          </li>
          <li><a @click="handleLogout">ログアウト</a></li>
        </ul>
      </div>
      <RouterLink v-else to="/login" class="btn btn-primary">ログイン</RouterLink>
    </div>
  </header>
</template>
