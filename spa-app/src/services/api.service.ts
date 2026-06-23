import type { Movement, MovementPayload, User } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiService = {
  async getUser(): Promise<User> {
    const response = await fetch(`${BASE_URL}/me`)
    if (!response.ok) throw new Error('Failed to fetch user profile')
    return response.json()
  },

  async getMovements(): Promise<Movement[]> {
    const response = await fetch(`${BASE_URL}/movements`)
    if (!response.ok) throw new Error('Failed to fetch movements')
    return response.json()
  },

  async getIncome(): Promise<Movement[]> {
    const response = await fetch(`${BASE_URL}/income`)
    if (!response.ok) throw new Error('Failed to fetch income')
    return response.json()
  },

  async getOutcome(): Promise<Movement[]> {
    const response = await fetch(`${BASE_URL}/outcome`)
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
