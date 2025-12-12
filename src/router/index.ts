import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HabitList.vue')
    },
    {
      path: '/habit/:id',
      name: 'habit-detail',
      component: () => import('@/views/HabitDetail.vue'),
      props: true
    },
    {
      path: '/stats',
      name: 'statistics',
      component: () => import('@/views/Statistics.vue')
    }
  ]
})

export default router
