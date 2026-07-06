import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('@/views/MovementsView.vue'),
      props: { type: 'income' as const },
    },
    {
      path: '/outcome',
      name: 'outcome',
      component: () => import('@/views/MovementsView.vue'),
      props: { type: 'outcome' as const },
    },
    {
      path: '/insights',
      name: 'insights',
      component: () => import('@/views/InsightsView.vue'),
    },
  ],
})

export default router
