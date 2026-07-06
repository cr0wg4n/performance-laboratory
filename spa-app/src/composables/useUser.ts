import { ref } from 'vue'
import { apiService } from '@/services/api.service'
import type { User } from '@/types'

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
let pollingStarted = false

export function useUser() {
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

  if (!pollingStarted) {
    pollingStarted = true
    setInterval(() => void fetchUser(), 10000)
  }

  return { user, isLoading, error, fetchUser }
}
