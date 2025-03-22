import { auth } from '@/firebase'
import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: HomeView,
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
    path: '/about',
    component: AboutView,
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
