import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/me', (req, res) => {
  const balance = db.getMovements().reduce(
    (sum, m) => sum + (m.type === 'income' ? m.amount : -m.amount),
    0
  )
  res.json({ ...db.getUser(), balance })
})

app.get('/movements', (req, res) => {
  res.json(db.getMovements())
})

app.get('/income', (req, res) => {
  res.json(db.getMovements().filter((m) => m.type === 'income'))
})

app.get('/outcome', (req, res) => {
  res.json(db.getMovements().filter((m) => m.type === 'outcome'))
})

app.post('/movements', (req, res) => {
  const { type, amount, description } = req.body

  if (!['income', 'outcome'].includes(type)) {
    return res.status(400).json({ error: 'type must be income or outcome' })
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' })
  }
  if (!description) {
    return res.status(400).json({ error: 'description is required' })
  }

  res.status(201).json(db.addMovement({ type, amount, description }))
})

app.delete('/movements/:id', (req, res) => {
  const deleted = db.deleteMovement(Number(req.params.id))
  if (!deleted) return res.status(404).json({ error: 'movement not found' })
  res.json(deleted)
})

app.listen(3000, () => console.log('Server running on http://localhost:3000'))
