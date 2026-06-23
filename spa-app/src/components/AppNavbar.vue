<script setup lang="ts">
import type { User } from '@/types'

interface Props {
  user: User | null
}

defineProps<Props>()
</script>

<template>
  <aside class="min-h-screen w-64 bg-neutral text-neutral-content flex flex-col">
    <div class="p-5 border-b border-neutral-content/10">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="font-bold text-sm leading-tight">FinanceLab</p>
          <p class="text-xs text-neutral-content/50 leading-tight">Personal Finance</p>
        </div>
      </RouterLink>
    </div>

    <nav class="flex-1 p-4 flex flex-col gap-1">
      <p class="text-xs font-semibold text-neutral-content/40 uppercase tracking-wider px-3 mb-2">Overview</p>

      <RouterLink
        to="/"
        exact-active-class="bg-primary/20 text-primary"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-content/70 hover:bg-neutral-content/10 hover:text-neutral-content transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </RouterLink>

      <p class="text-xs font-semibold text-neutral-content/40 uppercase tracking-wider px-3 mt-4 mb-2">Movements</p>

      <RouterLink
        to="/income"
        active-class="bg-success/20 text-success"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-content/70 hover:bg-neutral-content/10 hover:text-neutral-content transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
        Income
      </RouterLink>

      <RouterLink
        to="/outcome"
        active-class="bg-error/20 text-error"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-content/70 hover:bg-neutral-content/10 hover:text-neutral-content transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
        Expenses
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-neutral-content/10">
      <template v-if="user">
        <div class="flex items-center gap-3 px-3 py-2.5">
          <div class="avatar avatar-placeholder shrink-0">
            <div class="bg-primary text-primary-content w-8 rounded-full">
              <span class="text-sm font-semibold">{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium leading-tight truncate">{{ user.name }}</p>
            <p class="text-xs text-neutral-content/50 leading-tight truncate">{{ user.email }}</p>
          </div>
        </div>
      </template>
      <div v-else class="flex items-center gap-3 px-3 py-2.5">
        <div class="skeleton w-8 h-8 rounded-full shrink-0"></div>
        <div class="flex-1 flex flex-col gap-1.5">
          <div class="skeleton h-3 w-24"></div>
          <div class="skeleton h-2.5 w-32"></div>
        </div>
      </div>
    </div>
  </aside>
</template>
