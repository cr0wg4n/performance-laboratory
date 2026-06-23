<script setup lang="ts">
import type { Movement } from '@/types'
import MovementListItem from '@/components/movements/MovementListItem.vue'

interface Props {
  movements: Movement[]
  currency: string
  isLoading: boolean
  deletingId?: number | null
}

interface Emits {
  delete: [id: number]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleDelete(id: number) {
  emit('delete', id)
}
</script>

<template>
  <div>
    <template v-if="isLoading">
      <div v-for="n in 8" :key="n" class="flex items-center gap-3 px-5 py-3.5 border-b border-base-200 last:border-0">
        <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
        <div class="flex-1 flex flex-col gap-1.5">
          <div class="skeleton h-3.5 w-40"></div>
          <div class="skeleton h-2.5 w-24"></div>
        </div>
        <div class="skeleton h-4 w-20"></div>
      </div>
    </template>

    <template v-else-if="movements.length === 0">
      <div class="flex flex-col items-center justify-center py-16 text-base-content/40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm font-medium">No movements yet</p>
      </div>
    </template>

    <template v-else>
      <MovementListItem
        v-for="movement in movements"
        :key="movement.id"
        :movement="movement"
        :currency="currency"
        :deleting-id="deletingId"
        @delete="handleDelete"
      />
    </template>
  </div>
</template>
