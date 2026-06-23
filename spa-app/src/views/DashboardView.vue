<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMovementSearch } from '@/composables/useMovementSearch'
import { useUser } from '@/composables/useUser'
import { useMovements } from '@/composables/useMovements'
import MovementList from '@/components/movements/MovementList.vue'
import MovementForm from '@/components/movements/MovementForm.vue'
import SuccessCarousel from '@/components/SuccessCarousel.vue'
import { formatCurrency } from '@/utils/format.util'
import { getMovementQueryParams } from '@/utils/movement-query.util'
import type { MovementPayload } from '@/types'

const { user, fetchUser } = useUser()
const { movements, isLoading, error, fetchMovements, addMovement, removeMovement } = useMovements()
const route = useRoute()

const showForm = ref(false)
const formLoading = ref(false)
const formError = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const deleteError = ref<string | null>(null)

const currency = computed(() => user.value?.currency ?? 'USD')

const { searchInput, filteredMovements, visibleMovementCount, emptyStateMessage, handleSearchInput } = useMovementSearch(movements, currency)

const totalIncome = computed(() =>
  movements.value.filter((m) => m.type === 'income').reduce((sum, m) => sum + m.amount, 0),
)

const totalExpenses = computed(() =>
  movements.value.filter((m) => m.type === 'outcome').reduce((sum, m) => sum + m.amount, 0),
)

async function loadData() {
  await Promise.all([fetchUser(), fetchMovements(getMovementQueryParams(route.query))])
}

onMounted(loadData)
watch(() => [route.query.page, route.query.limit], loadData)

function handleOpenForm() {
  formError.value = null
  showForm.value = true
}

async function handleAddMovement(payload: MovementPayload) {
  formLoading.value = true
  formError.value = null
  try {
    await addMovement(payload)
    await loadData()
    showForm.value = false
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to add movement'
  } finally {
    formLoading.value = false
  }
}

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
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-base-content/50 text-sm mt-0.5">Welcome back, {{ user?.name ?? '...' }}</p>
      </div>
      <button class="btn btn-primary btn-sm md:btn-md shrink-0" @click="handleOpenForm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Movement
      </button>
    </div>

    <SuccessCarousel />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 shadow-sm border-t-4 border-primary">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span class="badge badge-ghost badge-sm font-mono">{{ user?.currency ?? '—' }}</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Current Balance</p>
          <template v-if="user">
            <p class="text-3xl font-bold text-primary mt-1 tabular-nums">
              {{ formatCurrency(user.balance, currency) }}
            </p>
          </template>
          <div v-else class="skeleton h-9 w-36 mt-1"></div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-sm border-t-4 border-success">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span class="text-xs text-base-content/40">All time</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Total Income</p>
          <template v-if="!isLoading">
            <p class="text-3xl font-bold text-success mt-1 tabular-nums">
              {{ formatCurrency(totalIncome, currency) }}
            </p>
          </template>
          <div v-else class="skeleton h-9 w-32 mt-1"></div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-sm border-t-4 border-error">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span class="text-xs text-base-content/40">All time</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Total Expenses</p>
          <template v-if="!isLoading">
            <p class="text-3xl font-bold text-error mt-1 tabular-nums">
              {{ formatCurrency(totalExpenses, currency) }}
            </p>
          </template>
          <div v-else class="skeleton h-9 w-32 mt-1"></div>
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
            <h2 class="font-semibold">All Movements</h2>
            <p class="text-sm text-base-content/40 mt-0.5">Search by description, amount, date, or movement type.</p>
          </div>
          <div class="flex flex-col gap-2 w-full md:max-w-sm">
            <label class="input input-bordered flex items-center gap-2 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input :value="searchInput" type="search" class="grow" placeholder="Search all movements" @input="handleSearchInput" />
            </label>
            <span class="text-right text-base-content/40 text-sm tabular-nums">{{ visibleMovementCount }} results</span>
          </div>
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

    <MovementForm
      v-model:open="showForm"
      :is-loading="formLoading"
      :error="formError"
      @submit="handleAddMovement"
    />
  </div>
</template>
