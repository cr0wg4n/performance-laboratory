import { computed, ref, watch, type Ref } from 'vue'
import { formatCurrency } from '@/utils/format.util'
import type { Movement } from '@/types'

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

function matchesSearchQuery(searchableValue: string, query: string): boolean {
  return searchableValue.includes(query)
}

export function useMovementSearch(movements: Ref<Movement[]>, currency: Ref<string>) {
  const searchInput = ref('')
  const searchQuery = ref('')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const sortField = ref<'date' | 'description'>('date')

  const sortedMovements = computed(() =>
    [...movements.value].sort((a, b) => {
      if (sortField.value === 'description') {
        const cmp = a.description.localeCompare(b.description)
        return sortOrder.value === 'desc' ? -cmp : cmp
      }
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sortOrder.value === 'desc' ? -diff : diff
    }),
  )

  function toggleDateSort() {
    if (sortField.value === 'date') {
      sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
      sortField.value = 'date'
      sortOrder.value = 'desc'
    }
  }

  function toggleNameSort() {
    if (sortField.value === 'description') {
      sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
      sortField.value = 'description'
      sortOrder.value = 'asc'
    }
  }

  const filteredMovements = computed(() => {
    const query = normalizeSearchValue(searchQuery.value)

    if (!query) {
      return sortedMovements.value
    }

    return sortedMovements.value.filter((movement) => {
      const searchableValues = [
        movement.description,
        movement.type,
        formatCurrency(movement.amount, currency.value),
        movement.amount.toString(),
        new Date(movement.date).toLocaleDateString('en-US'),
        new Date(movement.date).toISOString(),
      ]

      return searchableValues.some((value) => matchesSearchQuery(normalizeSearchValue(value), query))
    })
  })

  const visibleMovementCount = computed(() => filteredMovements.value.length)
  const emptyStateMessage = computed(() =>
    searchInput.value.trim() ? 'No movements match your search' : 'No movements yet',
  )

  watch(movements, () => {
    if (searchQuery.value) searchQuery.value = searchQuery.value
  }, { deep: true })

  watch(currency, () => {
    searchQuery.value = searchQuery.value
  })

  function handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    searchInput.value = value
    searchQuery.value = value
  }

  return {
    searchInput,
    filteredMovements,
    visibleMovementCount,
    emptyStateMessage,
    handleSearchInput,
    sortOrder,
    sortField,
    toggleDateSort,
    toggleNameSort,
  }
}
