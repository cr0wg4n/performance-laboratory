export interface Movement {
  id: number
  type: 'income' | 'outcome'
  amount: number
  description: string
  date: string
}

export interface User {
  id: number
  name: string
  email: string
  currency: string
  balance: number
}

export type MovementPayload = Omit<Movement, 'id' | 'date'>
