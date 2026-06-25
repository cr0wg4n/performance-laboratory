import type { LocationQuery, LocationQueryValue } from 'vue-router'
import type { MovementQueryParams } from '@/services/api.service'
import { config } from '@/config'

const { defaultPage: DEFAULT_PAGE, defaultLimit: DEFAULT_LIMIT } = config.pagination

function getSingleQueryValue(value: LocationQueryValue | LocationQueryValue[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function hasAllQueryParam(value: LocationQueryValue | LocationQueryValue[] | undefined): boolean {
  return value !== undefined
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (value == null) {
    return undefined
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

export function getMovementQueryParams(query: LocationQuery): MovementQueryParams | undefined {
  if (hasAllQueryParam(query.all)) {
    return undefined
  }

  const pageValue = getSingleQueryValue(query.page)
  const limitValue = getSingleQueryValue(query.limit)

  const page = parsePositiveInteger(pageValue) ?? DEFAULT_PAGE
  const limit = parsePositiveInteger(limitValue) ?? DEFAULT_LIMIT

  return { page, limit }
}
