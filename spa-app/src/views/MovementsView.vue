<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useUser } from '@/composables/useUser'
import { useMovements } from '@/composables/useMovements'
import MovementList from '@/components/movements/MovementList.vue'
import { formatCurrency } from '@/utils/format.util'

interface Props {
  type: 'income' | 'outcome'
}

const props = defineProps<Props>()

const { user, fetchUser } = useUser()
const { movements, isLoading, error, fetchIncome, fetchOutcome, removeMovement } = useMovements()

const deletingId = ref<number | null>(null)
const deleteError = ref<string | null>(null)

const currency = computed(() => user.value?.currency ?? 'USD')
const total = computed(() => movements.value.reduce((sum, m) => sum + m.amount, 0))

const sortedMovements = computed(() =>
  [...movements.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
)

async function loadData() {
  await Promise.all([fetchUser(), props.type === 'income' ? fetchIncome() : fetchOutcome()])
}

onMounted(loadData)
watch(() => props.type, loadData)

async function handleDelete(id: number) {
  deletingId.value = id
  deleteError.value = null
  try {
    await removeMovement(id)
    await fetchUser()
  } catch {
    deleteError.value = 'Failed to delete movement. Please try again.'
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
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
        <div class="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 class="font-semibold">{{ type === 'income' ? 'Income' : 'Expenses' }}</h2>
          <span class="text-base-content/40 text-sm tabular-nums">{{ movements.length }} entries</span>
        </div>
        <MovementList
          :movements="sortedMovements"
          :currency="currency"
          :is-loading="isLoading"
          :deleting-id="deletingId"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>
