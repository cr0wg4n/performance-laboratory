export const user = {
  id: 1,
  name: 'Mau Mat',
  email: 'mm@mm.com',
  currency: 'USD',
}

const incomeTemplates = [
  { description: 'Monthly salary',     amount: 3000 },
  { description: 'Freelance payment',  amount: 500  },
  { description: 'Consulting fee',     amount: 750  },
  { description: 'Bonus',              amount: 1200 },
  { description: 'Tax refund',         amount: 400  },
  { description: 'Investment return',  amount: 220  },
  { description: 'Side project sale',  amount: 180  },
  { description: 'Rental income',      amount: 900  },
  { description: 'Gift received',      amount: 150  },
  { description: 'Cashback reward',    amount:  35  },
]

const outcomeTemplates = [
  { description: 'Groceries',          amount:  85  },
  { description: 'Electric bill',      amount: 120  },
  { description: 'Internet bill',      amount:  50  },
  { description: 'Rent',               amount: 1100 },
  { description: 'Gas station',        amount:  60  },
  { description: 'Restaurant dinner',  amount:  45  },
  { description: 'Streaming services', amount:  30  },
  { description: 'Gym membership',     amount:  40  },
  { description: 'Clothing',           amount:  95  },
  { description: 'Pharmacy',           amount:  25  },
  { description: 'Phone bill',         amount:  55  },
  { description: 'Coffee shop',        amount:  12  },
  { description: 'Online shopping',    amount: 140  },
  { description: 'Car insurance',      amount: 200  },
  { description: 'Medical checkup',    amount:  80  },
  { description: 'Home supplies',      amount:  65  },
  { description: 'Book purchase',      amount:  20  },
  { description: 'Movie tickets',      amount:  28  },
  { description: 'Transport pass',     amount:  75  },
  { description: 'Water bill',         amount:  35  },
]

function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

const rand = seededRand(42)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const jitter = (base) => Math.round(base * (0.85 + rand() * 0.3))

const movements = []
let id = 1

// ~1000 months of data, ~300 entries/month → ~300,000 entries total
for (let month = 0; month < 1000; month++) {
  const year = 2000 + Math.floor(month / 12)
  const m = (month % 12) + 1

  // 1 salary per month
  movements.push({
    id: id++,
    type: 'income',
    amount: jitter(3000),
    description: 'Monthly salary',
    date: new Date(year, m - 1, 1, 9, 0, 0).toISOString(),
  })

  // ~8 random incomes
  for (let i = 0; i < 8; i++) {
    const tpl = pick(incomeTemplates.slice(1))
    const day = 1 + Math.floor(rand() * 28)
    movements.push({
      id: id++,
      type: 'income',
      amount: jitter(tpl.amount),
      description: tpl.description,
      date: new Date(year, m - 1, day, Math.floor(rand() * 12) + 8, 0, 0).toISOString(),
    })
  }

  // ~16 outcomes
  for (let i = 0; i < 16; i++) {
    const tpl = pick(outcomeTemplates)
    const day = 1 + Math.floor(rand() * 28)
    movements.push({
      id: id++,
      type: 'outcome',
      amount: jitter(tpl.amount),
      description: tpl.description,
      date: new Date(year, m - 1, day, Math.floor(rand() * 12) + 8, 0, 0).toISOString(),
    })
  }
}

movements.sort((a, b) => new Date(b.date) - new Date(a.date))
movements.forEach((m, i) => { m.id = i + 1 })

export { movements }
