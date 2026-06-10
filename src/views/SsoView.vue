<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IrIcon } from '@/lib/ui-kit'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { storage } from '@/services/storage.service.js'
import { redirectToSso, consumeReturnTo } from '@/services/auth.service.js'

const route = useRoute()
const router = useRouter()

let exchanging = false

onMounted(async () => {
  const code = route.query.otc

  if (!code) {
    redirectToSso()
    return
  }

  if (storage.get('token')) {
    await router.replace(consumeReturnTo())
    return
  }

  if (exchanging) return
  exchanging = true

  try {
    const res = await http.post(api.ssoExchange, { code })
    storage.set('token', res.data.token)
    await router.replace(consumeReturnTo())
  } catch {
    // redirectToSso()
  } finally {
    exchanging = false
  }
})
</script>

<template>
  <div class="max-w-[800px] mx-auto flex items-center justify-center gap-3 pt-[150px]">
    <IrIcon name="spinner" />
    <h4 class="font-bold">Please Wait...</h4>
  </div>
</template>
