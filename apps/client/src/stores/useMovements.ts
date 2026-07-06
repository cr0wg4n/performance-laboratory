import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService, type MovementQueryParams } from '@/services/api.service'
import type { Movement, MovementPayload } from '@/types'

export const useMovementsStore = defineStore('movements', () => {
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

  function fetchMovements(params?: MovementQueryParams) {
    return runFetch(() => apiService.getMovements(params), 'Failed to load movements')
  }

  function fetchIncome(params?: MovementQueryParams) {
    return runFetch(() => apiService.getIncome(params), 'Failed to load income')
  }

  function fetchOutcome(params?: MovementQueryParams) {
    return runFetch(() => apiService.getOutcome(params), 'Failed to load expenses')
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
})
