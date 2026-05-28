import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isLoaded = computed(() => user.value !== null)

  let inflight = null

  async function fetch() {
    if (inflight) return inflight
    loading.value = true
    error.value = null
    inflight = http.get(api.user)
      .then((res) => {
        user.value = {
          ...res?.data,
          avatar: res?.data?.media?.[0]?.url || ''
        }
      })
      .catch((e) => {
        error.value = e?.error ?? null
        throw e
      })
      .finally(() => {
        loading.value = false
        inflight = null
      })
    return inflight
  }

  function clear() {
    user.value = null
    error.value = null
  }

  return { user, loading, error, isLoaded, fetch, clear }
})
