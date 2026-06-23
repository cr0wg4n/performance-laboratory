import { debounce } from 'lodash'
import { computed, onUnmounted, ref, type Ref } from 'vue'
import { formatCurrency } from '@/utils/format.util'
import type { Movement } from '@/types'


const DEBOUNCE_MS = 300

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

function matchesSearchQuery(searchableValue: string, query: string): boolean {
  return searchableValue.includes(query)
}

export function useMovementSearch(movements: Ref<Movement[]>, currency: Ref<string>) {
  const searchInput = ref('')
  const searchQuery = ref('')

  const sortedMovements = computed(() =>
    [...movements.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

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

  const updateSearchQuery = debounce((value: string) => {
    searchQuery.value = value
  }, DEBOUNCE_MS)

  onUnmounted(() => {
    updateSearchQuery.cancel()
  })

  function handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    searchInput.value = value
    updateSearchQuery(value)
  }

  return {
    searchInput,
    filteredMovements,
    visibleMovementCount,
    emptyStateMessage,
    handleSearchInput,
  }
}
