import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'overview', component: () => import('../views/OverView.vue'), },
  { path: '/accounts', name: 'accounts', component: () => import('../views/AccountsView.vue'), },
  { path: '/payment-methods', name: 'paymentMethods', component: () => import('../views/PaymentMethodsView.vue'), },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
