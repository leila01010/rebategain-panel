<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { IrSelect } from '@/lib/ui-kit'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { useReferenceStore } from '@/stores/reference.js'

const selfValue = defineModel({ type: [String, Number], default: null })

const referenceStore = useReferenceStore()
const { countries } = storeToRefs(referenceStore)

const loading = ref(false)

watch(selfValue, (newValue) => {
  if (newValue) fetch()
}, { immediate: true })

async function fetch() {
  if (countries.value.length) return
  loading.value = true
  try {
    const { data } = await http.get(api.countries)
    loading.value = false
    countries.value = data || []
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}
</script>

<template>
  <IrSelect
    v-model="selfValue"
    :options="countries"
    label-prop="name"
    :loading
    block
    @open="fetch"
  />
</template>
