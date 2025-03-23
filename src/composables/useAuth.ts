import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { onMounted, onUnmounted, ref } from 'vue'

export function useAuth() {
  const error = ref<string | null>()
  const user = ref<User | null>()
  const loading = ref(true)

  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      user.value = authUser
      loading.value = false
    })
    onUnmounted(unsubscribe)
  })

  const register = async (email: string, password: string) => {
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const login = async (email: string, password: string) => {
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const logout = async () => {
    error.value = null
    try {
      await signOut(auth)
      user.value = null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const withdraw = async () => {
    error.value = null
    try {
      await auth.currentUser?.delete()
      user.value = null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const getCustomClaims = async () => {
    error.value = null
    try {
      const idTokenResult = await auth.currentUser?.getIdTokenResult()
      return idTokenResult?.claims
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  return { error, user, loading, register, login, logout, withdraw, getCustomClaims }
}
