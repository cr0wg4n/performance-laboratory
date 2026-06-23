<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MovementPayload } from '@/types'

interface Props {
  isLoading?: boolean
  error?: string | null
}

interface Emits {
  submit: [payload: MovementPayload]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const open = defineModel<boolean>('open', { default: false })

const dialogRef = ref<HTMLDialogElement | null>(null)
const validationError = ref<string | null>(null)

const form = ref<MovementPayload>({
  type: 'income',
  amount: 0,
  description: '',
})

watch(open, (value) => {
  if (value) {
    form.value = { type: 'income', amount: 0, description: '' }
    validationError.value = null
    dialogRef.value?.showModal()
  } else {
    dialogRef.value?.close()
  }
})

function handleClose() {
  open.value = false
}

function handleSubmit() {
  validationError.value = null

  if (form.value.amount <= 0) {
    validationError.value = 'Amount must be greater than 0'
    return
  }
  if (!form.value.description.trim()) {
    validationError.value = 'Description is required'
    return
  }

  emit('submit', { ...form.value })
}

const displayError = ref<string | null>(null)
watch(
  [() => props.error, validationError],
  ([apiError, valError]) => {
    displayError.value = valError ?? apiError ?? null
  },
)
</script>

<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle" @close="handleClose">
    <div class="modal-box p-0 overflow-hidden">
      <div
        class="px-6 py-5 transition-colors"
        :class="form.type === 'income' ? 'bg-success' : 'bg-error'"
      >
        <div class="flex items-center justify-between">
          <div :class="form.type === 'income' ? 'text-success-content' : 'text-error-content'">
            <h3 class="text-lg font-bold leading-tight">
              {{ form.type === 'income' ? 'Add Income' : 'Add Expense' }}
            </h3>
            <p class="text-sm opacity-70 mt-0.5">
              {{ form.type === 'income' ? 'Record a new earning' : 'Record a new expense' }}
            </p>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle"
            :class="form.type === 'income' ? 'text-success-content' : 'text-error-content'"
            @click="handleClose"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form class="flex flex-col gap-5 p-6" @submit.prevent="handleSubmit">
        <div class="join w-full">
          <button
            type="button"
            class="join-item btn flex-1 transition-colors"
            :class="form.type === 'income' ? 'btn-success' : 'btn-ghost'"
            @click="form.type = 'income'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Income
          </button>
          <button
            type="button"
            class="join-item btn flex-1 transition-colors"
            :class="form.type === 'outcome' ? 'btn-error' : 'btn-ghost'"
            @click="form.type = 'outcome'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Expense
          </button>
        </div>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Amount</legend>
          <input
            v-model.number="form.amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            class="input input-bordered w-full text-lg font-semibold"
            :class="form.type === 'income' ? 'focus:border-success' : 'focus:border-error'"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Description</legend>
          <input
            v-model="form.description"
            type="text"
            placeholder="What was this for?"
            class="input input-bordered w-full"
          />
        </fieldset>

        <div v-if="displayError" role="alert" class="alert alert-error py-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">{{ displayError }}</span>
        </div>

        <div class="flex gap-3 mt-1">
          <button
            type="button"
            class="btn btn-ghost flex-1"
            :disabled="props.isLoading"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn flex-1"
            :class="form.type === 'income' ? 'btn-success' : 'btn-error'"
            :disabled="props.isLoading"
          >
            <span v-if="props.isLoading" class="loading loading-spinner loading-sm"></span>
            Save {{ form.type === 'income' ? 'Income' : 'Expense' }}
          </button>
        </div>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button type="submit" @click="handleClose">close</button>
    </form>
  </dialog>
</template>
