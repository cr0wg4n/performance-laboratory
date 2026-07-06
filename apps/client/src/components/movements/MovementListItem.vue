<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Movement } from '@/types'
import { formatCurrency, formatDate } from '@/utils/format.util'

interface Props {
  movement: Movement
  currency: string
  deletingId?: number | null
}

interface Emits {
  delete: [id: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDeleting = computed(() => props.deletingId === props.movement.id)

const movementMeta = computed(() => {
  const formatted = formatCurrency(props.movement.amount, props.currency)
  const absFormatted = formatCurrency(Math.abs(props.movement.amount), props.currency)
  return {
    formattedAmount: props.movement.type === 'outcome' ? absFormatted : formatted,
    formattedDate: formatDate(props.movement.date),
    colorClass: props.movement.type === 'income' ? 'text-success' : 'text-error',
    sign: props.movement.type === 'outcome' ? '−' : '+',
  }
})

watch(() => props.movement, () => {
  void movementMeta.value
}, { deep: true, immediate: true })

function handleDelete() {
  emit('delete', props.movement.id)
}
</script>

<template>
  <div
    class="group flex items-center gap-3 px-5 py-3.5 border-b border-base-200 last:border-0 hover:bg-base-50 transition-colors"
  >
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      :class="movement.type === 'income' ? 'bg-success/10' : 'bg-error/10'"
    >
      <svg
        v-if="movement.type === 'income'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4.5 w-4.5 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-4.5 w-4.5 text-error"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium leading-snug truncate">{{ movement.description }}</p>
      <p class="text-xs text-base-content/40 leading-snug mt-0.5">{{ formatDate(movement.date) }}</p>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <span
        class="text-sm font-semibold tabular-nums"
        :class="movementMeta.colorClass"
      >
        {{ movementMeta.sign }}{{ movementMeta.formattedAmount }}
      </span>

      <button
        class="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
        :disabled="isDeleting"
        @click="handleDelete"
      >
        <span v-if="isDeleting" class="loading loading-spinner loading-xs"></span>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="h-3.5 w-3.5 stroke-current"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>
