<script setup>
import { IrSelect } from '@/lib/ui-kit'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { ref } from 'vue'

const emit = defineEmits(['select'])

const selfValue = defineModel({ type: [String, Number], default: null })

const loading = ref(false)
const accounts = ref([])

async function fetch() {
  if (accounts.value.length) return
  loading.value = true
  try {
    const { data } = await http.get(api.accounts)
    loading.value = false
    accounts.value = (data || []).map((item) => ({
      title: item?.broker?.name,
      id: item.id,
      ...item,
    })).filter((item) => item.status === 'active')
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}

function onSelectedOptions(options) {
  emit('select', options?.[0] ?? null)
}
</script>

<template>
  <IrSelect
    v-model="selfValue"
    :options="accounts"
    :label="$t('overview.brokerAccount')"
    :placeholder="$t('overview.selectEligibleAccount')"
    :loading
    block
    @open="fetch"
    @update:selected-options="onSelectedOptions"
  />
</template>
