import type { Movement, MovementPayload, User } from '@/types'
import { config } from '@/config'

const BASE_URL = config.apiHost

export interface MovementQueryParams {
  page?: number
  limit?: number
}

function buildMovementUrl(path: string, params?: MovementQueryParams): string {
  const searchParams = new URLSearchParams()

  if (params?.page != null) {
    searchParams.set('page', params.page.toString())
  }

  if (params?.limit != null) {
    searchParams.set('limit', params.limit.toString())
  }

  const query = searchParams.toString()
  return `${BASE_URL}${path}${query ? `?${query}` : ''}`
}

export const apiService = {
  async getUser(): Promise<User> {
    const response = await fetch(`${BASE_URL}/me`)
    if (!response.ok) throw new Error('Failed to fetch user profile')
    return response.json()
  },

  async getMovements(params?: MovementQueryParams): Promise<Movement[]> {
    const response = await fetch(buildMovementUrl('/movements', params))
    if (!response.ok) throw new Error('Failed to fetch movements')
    return response.json()
  },

  async getIncome(params?: MovementQueryParams): Promise<Movement[]> {
    const response = await fetch(buildMovementUrl('/income', params))
    if (!response.ok) throw new Error('Failed to fetch income')
    return response.json()
  },

  async getOutcome(params?: MovementQueryParams): Promise<Movement[]> {
    const response = await fetch(buildMovementUrl('/outcome', params))
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async createMovement(payload: MovementPayload): Promise<Movement> {
    const response = await fetch(`${BASE_URL}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error)
    }
    return response.json()
  },

  async deleteMovement(id: number): Promise<Movement> {
    const response = await fetch(`${BASE_URL}/movements/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error)
    }
    return response.json()
  },
}
