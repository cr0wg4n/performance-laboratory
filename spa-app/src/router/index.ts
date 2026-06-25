import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import MovementsView from '@/views/MovementsView.vue'
import InsightsView from '@/views/InsightsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/income',
      name: 'income',
      component: MovementsView,
      props: { type: 'income' as const },
    },
    {
      path: '/outcome',
      name: 'outcome',
      component: MovementsView,
      props: { type: 'outcome' as const },
    },
    {
      path: '/insights',
      name: 'insights',
      component: InsightsView,
    },
  ],
})

export default router
