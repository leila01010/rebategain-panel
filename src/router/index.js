import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { getToken, redirectToSso, saveReturnTo } from '@/services/auth.service.js'

const routes = [
  { path: '/', name: 'overview', component: () => import('../views/OverView.vue'), },
  { path: '/accounts', name: 'accounts', component: () => import('../views/AccountsView.vue'), },
  { path: '/payment-methods', name: 'paymentMethods', component: () => import('../views/PaymentMethodsView.vue'), },
  { path: '/withdraws', name: 'withdraws', component: () => import('../views/WithdrawsView.vue'), },
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), },
  { path: '/sso', name: 'sso', meta: { layout: 'blank' }, component: () => import('../views/SsoView.vue'), },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  if (to.name === 'sso') return true

  if (!getToken()) {
    saveReturnTo(to.fullPath)
    redirectToSso()
    return false
  }

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
