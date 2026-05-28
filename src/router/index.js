import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const routes = [
  { path: '/', name: 'overview', component: () => import('../views/OverView.vue'), },
  { path: '/accounts', name: 'accounts', component: () => import('../views/AccountsView.vue'), },
  { path: '/payment-methods', name: 'paymentMethods', component: () => import('../views/PaymentMethodsView.vue'), },
  { path: '/withdraws', name: 'withdraws', component: () => import('../views/WithdrawsView.vue'), },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (userStore.isLoaded) return true

  try {
    await userStore.fetch()
    return true
  } catch {
    return false
  }
})

export default router
