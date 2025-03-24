<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { themeChange } from 'theme-change'
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const { logout, user, error } = useAuth()

const theme = localStorage.getItem('theme')

const handleLogout = async () => {
  await logout()
  if (!error.value) {
    router.push('/login')
  }
}

onMounted(async () => {
  themeChange(false)
})
</script>

<template>
  <header class="navbar bg-base-100/50 px-6 h-16 fixed z-50 backdrop-blur">
    <RouterLink to="/">
      <img src="/src/assets/logo.svg" class="h-8" />
    </RouterLink>

    <label class="ml-auto mr-2 swap swap-rotate">
      <input type="checkbox" data-toggle-theme="light,dark" :checked="theme === 'dark'" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="swap-off size-6 fill-current"
      >
        <path
          d="M11.5 3.385V2q0-.213.144-.356t.357-.144t.356.144T12.5 2v1.385q0 .212-.144.356t-.357.144t-.356-.144t-.143-.356M11.5 22v-1.384q0-.213.144-.357t.357-.143t.356.143t.143.357V22q0 .213-.144.356t-.357.144t-.356-.144T11.5 22M22 12.5h-1.384q-.213 0-.357-.144t-.143-.357t.143-.356t.357-.143H22q.213 0 .356.144t.144.357t-.144.356T22 12.5m-18.615 0H2q-.213 0-.356-.144t-.144-.357t.144-.356T2 11.5h1.385q.212 0 .356.144t.144.357t-.144.356t-.356.143m16.019-7.19l-.735.734q-.14.14-.341.15t-.37-.16q-.156-.155-.159-.346q-.003-.192.157-.357l.74-.74q.14-.147.344-.156t.37.156t.162.359t-.168.36M6.044 18.67l-.74.74q-.14.146-.344.156q-.204.009-.37-.156q-.165-.166-.162-.36t.168-.36l.735-.734q.14-.14.341-.15t.37.16q.156.155.159.347q.003.19-.157.356m12.647.735l-.735-.735q-.14-.14-.15-.341t.16-.37q.155-.156.347-.159q.19-.003.356.157l.74.74q.147.14.157.345q.009.203-.156.369q-.166.165-.36.162t-.36-.168M5.33 6.044l-.74-.74q-.146-.14-.155-.344t.156-.37t.359-.162t.36.168l.734.735q.14.14.15.341t-.16.37q-.155.156-.346.159q-.192.003-.357-.157M12.005 17q-2.082 0-3.544-1.457T7 12.005T8.457 8.46T11.995 7t3.544 1.457T17 11.995t-1.457 3.544T12.005 17M12 16q1.675 0 2.838-1.162T16 12t-1.162-2.838T12 8T9.162 9.163T8 12t1.163 2.838T12 16m0-4"
        />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="swap-on size-6 fill-current"
      >
        <path
          d="m14.712 7.596l-2.289-2.288l2.289-2.289L17 5.308zm5 3l-1.289-1.288l1.289-1.289L21 9.308zM12.075 21q-1.888 0-3.543-.713T5.64 18.336t-1.951-2.893t-.714-3.543q0-2.92 1.68-5.265t4.436-3.27q-.104 2.34.717 4.501q.82 2.161 2.48 3.82q1.66 1.66 3.82 2.481t4.502.717q-.92 2.754-3.268 4.435T12.075 21m0-1q2.2 0 4.075-1.1t2.95-3.025q-2.15-.2-4.075-1.097t-3.45-2.422t-2.425-3.44T8.075 4.85Q6.15 5.925 5.063 7.813T3.975 11.9q0 3.375 2.363 5.738T12.075 20m-.5-7.644"
        />
      </svg>
    </label>

    <div v-if="user" class="size-6">
      <div class="ml-auto dropdown dropdown-end">
        <div tabindex="0" role="button" class="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6 fill-current">
            <path
              d="M4.5 17.27q-.213 0-.356-.145T4 16.768t.144-.356t.356-.143h15q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.144T4 11.999t.144-.356t.356-.143h15q.213 0 .356.144t.144.357t-.144.356t-.356.143zm0-4.77q-.213 0-.356-.143Q4 7.443 4 7.23t.144-.356t.356-.143h15q.213 0 .356.144T20 7.23t-.144.356t-.356.144z"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li>
            <RouterLink to="/setting">設定</RouterLink>
          </li>
          <li><a @click="handleLogout">ログアウト</a></li>
        </ul>
      </div>
    </div>
    <RouterLink v-else to="/login" class="btn font-normal">ログイン</RouterLink>
  </header>
</template>
