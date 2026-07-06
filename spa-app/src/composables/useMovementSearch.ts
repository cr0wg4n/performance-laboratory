import { computed, ref, type Ref } from 'vue'
import { formatCurrency } from '@/utils/format.util'
import type { Movement } from '@/types'

const PAGE_SIZE = 10

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
  const currentPage = ref(1)
  let searchDebounce: ReturnType<typeof setTimeout> | null = null

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
    currentPage.value = 1
  }

  function toggleNameSort() {
    if (sortField.value === 'description') {
      sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
    } else {
      sortField.value = 'description'
      sortOrder.value = 'asc'
    }
    currentPage.value = 1
  }

  const filteredMovements = computed(() => {
    const query = normalizeSearchValue(searchQuery.value)
    if (!query) return sortedMovements.value

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

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredMovements.value.length / PAGE_SIZE)))

  const paginatedMovements = computed(() => {
    const page = Math.min(currentPage.value, totalPages.value)
    const start = (page - 1) * PAGE_SIZE
    return filteredMovements.value.slice(start, start + PAGE_SIZE)
  })

  const visibleMovementCount = computed(() => filteredMovements.value.length)
  const emptyStateMessage = computed(() =>
    searchInput.value.trim() ? 'No movements match your search' : 'No movements yet',
  )

  function handleSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    searchInput.value = value
    if (searchDebounce !== null) clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
      searchQuery.value = value
      currentPage.value = 1
    }, 300)
  }

  function goToPage(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  return {
    searchInput,
    filteredMovements,
    paginatedMovements,
    currentPage,
    totalPages,
    visibleMovementCount,
    emptyStateMessage,
    handleSearchInput,
    goToPage,
    sortOrder,
    sortField,
    toggleDateSort,
    toggleNameSort,
  }
}
