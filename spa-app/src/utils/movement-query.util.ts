import type { LocationQuery, LocationQueryValue } from 'vue-router'
import type { MovementQueryParams } from '@/services/api.service'

function getSingleQueryValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function getMovementQueryParams(query: LocationQuery): MovementQueryParams | undefined {
  const pageValue = getSingleQueryValue(query.page)
  const limitValue = getSingleQueryValue(query.limit)

  if (pageValue == null || limitValue == null) {
    return undefined
  }

  const page = Number(pageValue)
  const limit = Number(limitValue)

  if (!Number.isInteger(page) || page <= 0 || !Number.isInteger(limit) || limit <= 0) {
    return undefined
  }

  return { page, limit }
}
