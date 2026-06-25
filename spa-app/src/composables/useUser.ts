import { ref } from 'vue'
import { apiService } from '@/services/api.service'
import type { User } from '@/types'

export function useUser() {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUser() {
    isLoading.value = true
    error.value = null
    try {
      user.value = await apiService.getUser()
    } catch {
      error.value = 'Failed to load user profile'
    } finally {
      isLoading.value = false
    }
  }

  setInterval(() => void fetchUser(), 2000)
  window.addEventListener('focus', () => void fetchUser())
  window.addEventListener('visibilitychange', () => void fetchUser())

  return { user, isLoading, error, fetchUser }
}
