import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { ref } from 'vue'

export function useAuth() {
  const user = ref<User | null>()
  const error = ref<string | null>()
  const loading = ref(true)

  const setupListener = () => {
    return onAuthStateChanged(auth, (authUser) => {
      user.value = authUser
      loading.value = false
    })
  }

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      error.value = null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      error.value = null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      error.value = null
    } catch (e) {
      console.error(e)
      error.value = e instanceof Error ? e.message : 'Unknown error occurred'
    }
  }

  return { user, error, loading, setupListener, register, login, logout }
}
