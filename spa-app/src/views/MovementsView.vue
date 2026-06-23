<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMovementSearch } from '@/composables/useMovementSearch'
import { useUser } from '@/composables/useUser'
import { useMovementsStore } from '@/composables/useMovements'
import SuccessCarousel from '@/components/SuccessCarousel.vue'
import MovementList from '@/components/movements/MovementList.vue'
import { formatCurrency } from '@/utils/format.util'
import { getMovementQueryParams } from '@/utils/movement-query.util'

interface Props {
  type: 'income' | 'outcome'
}

const props = defineProps<Props>()

const { user, fetchUser } = useUser()
const movementsStore = useMovementsStore()
const { movements, isLoading, error } = storeToRefs(movementsStore)
const { fetchIncome, fetchOutcome, removeMovement } = movementsStore
const route = useRoute()

const deletingId = ref<number | null>(null)
const deleteError = ref<string | null>(null)

const currency = computed(() => user.value?.currency ?? 'USD')
const total = computed(() => movements.value.reduce((sum, m) => sum + m.amount, 0))

const { searchInput, filteredMovements, emptyStateMessage, handleSearchInput } = useMovementSearch(movements, currency)

async function loadData() {
  const params = getMovementQueryParams(route.query)
  await Promise.all([fetchUser(), props.type === 'income' ? fetchIncome(params) : fetchOutcome(params)])
}

onMounted(loadData)
watch(() => [props.type, route.query.page, route.query.limit], loadData)

async function handleDelete(id: number) {
  deletingId.value = id
  deleteError.value = null
  try {
    await removeMovement(id)
    await loadData()
  } catch {
    deleteError.value = 'Failed to delete movement. Please try again.'
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <SuccessCarousel />

    <div
      class="card shadow-sm border-t-4"
      :class="type === 'income' ? 'bg-success border-success' : 'bg-error border-error'"
    >
      <div
        class="card-body p-5"
        :class="type === 'income' ? 'text-success-content' : 'text-error-content'"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium opacity-70">
              {{ type === 'income' ? 'Total Earned' : 'Total Spent' }}
            </p>
            <template v-if="!isLoading">
              <p class="text-3xl font-bold tabular-nums mt-1">
                {{ formatCurrency(total, currency) }}
              </p>
            </template>
            <div v-else class="skeleton h-9 w-40 mt-1 opacity-30"></div>
            <p class="text-sm opacity-60 mt-1">{{ movements.length }} transactions</p>
          </div>
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center"
            :class="type === 'income' ? 'bg-success-content/15' : 'bg-error-content/15'"
          >
            <svg v-if="type === 'income'" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" role="alert" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-if="deleteError" role="alert" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ deleteError }}</span>
    </div>

    <div class="card bg-base-100 shadow-sm">
      <div class="card-body p-0">
        <div class="flex flex-col gap-4 px-5 pt-5 pb-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="font-semibold">{{ type === 'income' ? 'Income' : 'Expenses' }}</h2>
            <p class="text-sm text-base-content/40 mt-0.5">Search by description, amount, date, or movement type.</p>
          </div>
          <label class="input input-bordered flex items-center gap-2 w-full md:max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input :value="searchInput" type="search" class="grow" placeholder="Search movements" @input="handleSearchInput" />
          </label>
        </div>
        <MovementList
          :movements="filteredMovements"
          :currency="currency"
          :is-loading="isLoading"
          :deleting-id="deletingId"
          :empty-message="emptyStateMessage"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>
