import { auth } from '@/firebase'
import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
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
    path: '/signup',
    component: SignupView,
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

router.beforeEach((to, from, next) => {
  const user = auth.currentUser

  if (to.meta.requireAuth === true && !user) {
    next('/login')
  } else if (to.meta.requireAuth === false && user) {
    next('/')
  } else {
    next()
  }
})

export default router
