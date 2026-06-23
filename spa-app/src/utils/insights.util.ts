import type { Movement } from '@/types'

export interface DateRange {
  start: string
  end: string
}

export interface InsightPoint {
  label: string
  income: number
  outcome: number
}

export interface InsightSummary {
  income: number
  outcome: number
  net: number
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function toDateInputValue(date: Date): string {
  return [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-')
}

export function fromDateInputValue(value: string): Date {
  const [yearValue, monthValue, dayValue] = value.split('-')
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return new Date()
  }

  return new Date(year, month - 1, day)
}

function getRangeBounds(range: DateRange): { start: Date; end: Date } {
  const start = fromDateInputValue(range.start)
  const end = fromDateInputValue(range.end)

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

function createDayIterator(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const current = new Date(start)

  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

export function createDefaultDateRange(referenceDate = new Date()): DateRange {
  const end = new Date(referenceDate)
  const start = new Date(referenceDate)

  start.setMonth(start.getMonth() - 1)

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
  }
}

export function normalizeRange(range: DateRange): DateRange {
  if (range.start <= range.end) {
    return range
  }

  return {
    start: range.end,
    end: range.start,
  }
}

export function buildInsightSeries(movements: Movement[], range: DateRange): InsightPoint[] {
  const normalizedRange = normalizeRange(range)
  const { start, end } = getRangeBounds(normalizedRange)
  const buckets = new Map<string, InsightPoint>()

  for (const day of createDayIterator(start, end)) {
    const key = toDateInputValue(day)
    buckets.set(key, {
      label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: 0,
      outcome: 0,
    })
  }

  for (const movement of movements) {
    const movementDate = new Date(movement.date)

    if (movementDate < start || movementDate > end) {
      continue
    }

    const key = toDateInputValue(movementDate)
    const currentBucket = buckets.get(key)

    if (!currentBucket) {
      continue
    }

    currentBucket[movement.type] += movement.amount
  }

  return [...buckets.values()]
}

export function buildInsightSummary(series: InsightPoint[]): InsightSummary {
  return series.reduce<InsightSummary>(
    (summary, point) => ({
      income: summary.income + point.income,
      outcome: summary.outcome + point.outcome,
      net: summary.net + point.income - point.outcome,
    }),
    {
      income: 0,
      outcome: 0,
      net: 0,
    },
  )
}

export function formatInsightRange(range: DateRange): string {
  const normalizedRange = normalizeRange(range)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }

  return `${fromDateInputValue(normalizedRange.start).toLocaleDateString('en-US', options)} - ${fromDateInputValue(normalizedRange.end).toLocaleDateString('en-US', options)}`
}
