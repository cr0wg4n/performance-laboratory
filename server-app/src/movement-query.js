function parseDateParam(value, label) {
  if (value == null || value === '') {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return { error: `${label} must be a valid ISO 8601 date` }
  }

  return date
}

function parsePositiveInteger(value, label) {
  if (value == null || value === '') {
    return null
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { error: `${label} must be a positive integer` }
  }

  return parsed
}

export function queryMovements(movements, query, type) {
  const startDate = parseDateParam(query.startDate, 'startDate')
  if (startDate?.error) {
    return startDate
  }

  const endDate = parseDateParam(query.endDate, 'endDate')
  if (endDate?.error) {
    return endDate
  }

  if (startDate && endDate && startDate > endDate) {
    return { error: 'startDate must be before or equal to endDate' }
  }

  const page = parsePositiveInteger(query.page, 'page')
  if (page?.error) {
    return page
  }

  const limit = parsePositiveInteger(query.limit, 'limit')
  if (limit?.error) {
    return limit
  }

  if ((page && !limit) || (!page && limit)) {
    return { error: 'page and limit must be provided together' }
  }

  let results = type ? movements.filter((movement) => movement.type === type) : [...movements]

  if (startDate || endDate) {
    results = results.filter((movement) => {
      const movementDate = new Date(movement.date)
      return (!startDate || movementDate >= startDate) && (!endDate || movementDate <= endDate)
    })
  }

  if (!page || !limit) {
    return { data: results }
  }

  const startIndex = (page - 1) * limit
  return { data: results.slice(startIndex, startIndex + limit) }
}