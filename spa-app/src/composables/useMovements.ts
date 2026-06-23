import { ref } from 'vue'
import { apiService } from '@/services/api.service'
import type { Movement, MovementPayload } from '@/types'

export function useMovements() {
  const movements = ref<Movement[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function runFetch(fetcher: () => Promise<Movement[]>, errorMsg: string) {
    isLoading.value = true
    error.value = null
    try {
      movements.value = await fetcher()
    } catch {
      error.value = errorMsg
    } finally {
      isLoading.value = false
    }
  }

  function fetchMovements() {
    return runFetch(() => apiService.getMovements(), 'Failed to load movements')
  }

  function fetchIncome() {
    return runFetch(() => apiService.getIncome(), 'Failed to load income')
  }

  function fetchOutcome() {
    return runFetch(() => apiService.getOutcome(), 'Failed to load expenses')
  }

  async function addMovement(payload: MovementPayload): Promise<Movement> {
    const movement = await apiService.createMovement(payload)
    movements.value.push(movement)
    return movement
  }

  async function removeMovement(id: number) {
    await apiService.deleteMovement(id)
    movements.value = movements.value.filter((m) => m.id !== id)
  }

  return {
    movements,
    isLoading,
    error,
    fetchMovements,
    fetchIncome,
    fetchOutcome,
    addMovement,
    removeMovement,
  }
}
