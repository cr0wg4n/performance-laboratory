<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
}
interface Emits {
  change: [page: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pages = computed<(number | '...')[]>(() => {
  const { totalPages: total, currentPage: current } = props
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: (number | '...')[] = [1]
  if (current > 3) items.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) items.push(i)

  if (current < total - 2) items.push('...')
  items.push(total)

  return items
})
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center py-3 px-5 border-t border-base-200">
    <div class="join">
      <button
        class="join-item btn btn-sm"
        :disabled="currentPage === 1"
        @click="emit('change', currentPage - 1)"
      >«</button>
      <template v-for="(p, i) in pages" :key="typeof p === 'number' ? `page-${p}` : `ellipsis-${i}`">
        <button
          v-if="typeof p === 'number'"
          class="join-item btn btn-sm"
          :class="{ 'btn-active': p === currentPage }"
          @click="emit('change', p)"
        >{{ p }}</button>
        <button v-else class="join-item btn btn-sm btn-disabled" tabindex="-1">…</button>
      </template>
      <button
        class="join-item btn btn-sm"
        :disabled="currentPage === totalPages"
        @click="emit('change', currentPage + 1)"
      >»</button>
    </div>
  </div>
</template>
