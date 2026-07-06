<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import AppNavbar from '@/components/AppNavbar.vue'

const { user, fetchUser } = useUser()

onMounted(fetchUser)
</script>

<template>
  <div class="drawer lg:drawer-open min-h-screen">
    <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col min-h-screen">
      <header class="navbar bg-base-100 border-b border-base-200 lg:hidden sticky top-0 z-10">
        <label for="sidebar-drawer" class="btn btn-ghost btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-5 w-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <span class="font-bold text-lg ml-1">FinanceLab</span>
      </header>

      <main class="flex-1 p-4 md:p-8 bg-base-200">
        <div class="max-w-5xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>

    <div class="drawer-side z-40">
      <label for="sidebar-drawer" class="drawer-overlay"></label>
      <AppNavbar :user="user" />
    </div>
  </div>
</template>
