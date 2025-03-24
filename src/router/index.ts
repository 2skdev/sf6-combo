import { auth } from '@/firebase'
import AboutView from '@/views/AboutView.vue'
import AdminCharacterView from '@/views/AdminCharacterView.vue'
import ComboView from '@/views/ComboView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SettingView from '@/views/SettingView.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/admin/character',
    component: AdminCharacterView,
    meta: {
      requireAuth: true,
      requireAdmin: true, // TODO: impl
    },
  },
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/about',
    component: AboutView,
  },
  {
    path: '/:userId/:characterId',
    component: ComboView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/login',
    component: LoginView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/register',
    component: RegisterView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/setting',
    component: SettingView,
    meta: {
      requireAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to, from, next) => {
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user)
      unsubscribe()
    })
  })

  if (to.meta.requireAuth === true && !user) {
    next('/login')
  } else if (to.meta.requireAuth === false && user) {
    next('/')
  } else {
    next()
  }
})

export default router
