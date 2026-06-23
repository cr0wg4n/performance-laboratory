import { user as mockUser, movements as mockMovements } from '../mocks/data.js'

const db = {
  user: { ...mockUser },
  movements: mockMovements.map((m) => ({ ...m })),
  _nextId: Math.max(...mockMovements.map((m) => m.id)) + 1,

  getUser() {
    return this.user
  },

  getMovements() {
    return this.movements
  },

  addMovement(data) {
    const movement = { ...data, id: this._nextId++, date: new Date().toISOString() }
    this.movements.push(movement)
    return movement
  },

  deleteMovement(id) {
    const idx = this.movements.findIndex((m) => m.id === id)
    if (idx === -1) return null
    const [deleted] = this.movements.splice(idx, 1)
    return deleted
  },
}

export default db
