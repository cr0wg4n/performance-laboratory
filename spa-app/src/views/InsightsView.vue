<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useUser } from '@/composables/useUser'
import { useMovementsStore } from '@/composables/useMovements'
import { formatCurrency } from '@/utils/format.util'
import SuccessCarousel from '@/components/SuccessCarousel.vue'
import InsightsChart from '@/components/insights/InsightsChart.vue'
import {
  buildInsightSeries,
  buildInsightSummary,
  createDefaultDateRange,
  formatInsightRange,
  normalizeRange,
  toDateInputValue,
  type DateRange,
} from '@/utils/insights.util'

const { user, fetchUser } = useUser()
const movementsStore = useMovementsStore()
const { movements, isLoading, error } = storeToRefs(movementsStore)
const { fetchMovements } = movementsStore

const dateRange = ref<DateRange>(createDefaultDateRange())

const currency = computed(() => user.value?.currency ?? 'USD')

const normalizedRange = computed(() => normalizeRange(dateRange.value))

const insightSeries = computed(() => buildInsightSeries(movements.value, normalizedRange.value))

const insightSummary = computed(() => buildInsightSummary(insightSeries.value))

const hasData = computed(() => insightSeries.value.some((point) => point.income > 0 || point.outcome > 0))

function handleStartDateChange() {
  dateRange.value = normalizeRange(dateRange.value)
}

function handleEndDateChange() {
  dateRange.value = normalizeRange(dateRange.value)
}

function setQuickRange(days: number) {
  const end = new Date()
  const start = new Date()

  start.setDate(start.getDate() - days)

  dateRange.value = {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
  }
}

onMounted(async () => {
  await Promise.all([fetchUser(), fetchMovements()])
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <SuccessCarousel />

    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Insights</h1>
        <p class="text-base-content/50 text-sm mt-0.5">Income and outcome trends for the selected range.</p>
      </div>
      <p class="text-sm text-base-content/50">{{ formatInsightRange(normalizedRange) }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <article class="card bg-base-100 shadow-sm border-t-4 border-success">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span class="text-xs text-base-content/40">Selected range</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Income</p>
          <p class="text-3xl font-bold text-success mt-1 tabular-nums">{{ formatCurrency(insightSummary.income, currency) }}</p>
        </div>
      </article>

      <article class="card bg-base-100 shadow-sm border-t-4 border-error">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span class="text-xs text-base-content/40">Selected range</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Outcome</p>
          <p class="text-3xl font-bold text-error mt-1 tabular-nums">{{ formatCurrency(insightSummary.outcome, currency) }}</p>
        </div>
      </article>

      <article class="card bg-base-100 shadow-sm border-t-4 border-primary">
        <div class="card-body p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs text-base-content/40">Net flow</span>
          </div>
          <p class="text-sm text-base-content/50 font-medium">Difference</p>
          <p class="text-3xl font-bold text-primary mt-1 tabular-nums">{{ formatCurrency(insightSummary.net, currency) }}</p>
        </div>
      </article>
    </div>

    <section class="card bg-base-100 shadow-sm">
      <div class="card-body gap-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="font-semibold text-lg">Range selector</h2>
            <p class="text-sm text-base-content/50">Adjust the window to inspect trends across any period.</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn btn-ghost btn-sm" type="button" @click="setQuickRange(30)">Last 30 days</button>
            <button class="btn btn-ghost btn-sm" type="button" @click="setQuickRange(90)">Last 90 days</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="form-control w-full">
            <span class="label-text text-sm font-medium mb-2">Start date</span>
            <input
              v-model="dateRange.start"
              type="date"
              class="input input-bordered w-full"
              :max="dateRange.end"
              @change="handleStartDateChange"
            />
          </label>

          <label class="form-control w-full">
            <span class="label-text text-sm font-medium mb-2">End date</span>
            <input
              v-model="dateRange.end"
              type="date"
              class="input input-bordered w-full"
              :min="dateRange.start"
              @change="handleEndDateChange"
            />
          </label>
        </div>

        <div v-if="error" role="alert" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center rounded-2xl border border-dashed border-base-300 min-h-80">
          <div class="flex items-center gap-3 text-base-content/50">
            <span class="loading loading-spinner loading-md"></span>
            Loading insights...
          </div>
        </div>

        <div v-else class="rounded-2xl border border-base-200 bg-base-200/40 p-3 md:p-5">
          <InsightsChart :series="insightSeries" :currency="currency" />
        </div>

        <p v-if="!hasData && !isLoading" class="text-sm text-base-content/50">
          No movements were found in the selected range.
        </p>
      </div>
    </section>
  </div>
</template>
