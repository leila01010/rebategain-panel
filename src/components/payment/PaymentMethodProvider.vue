<script setup>
import { onMounted, ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import AddPaymentMethodModal from '@/components/payment/AddPaymentMethodModal.vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const loading = ref(true)
const showForm = ref(false)
const data = ref([])

async function getData() {
  loading.value = true
  try {
    const res = await http.get(api.paymentMethods)
    data.value = res?.data || []
    loading.value = false
  } catch (e) {
    loading.value = false
    console.error(e)
  }
}

onMounted(() => getData())

defineExpose({ getData })
</script>

<template>
  <div>
    <Transition name="fade" mode="out-in">
      <LoadingState v-if="loading" />
      <EmptyState
        v-else-if="!data.length"
        icon="wallet"
        :title="$t('payment.noMethods')"
        :description="$t('payment.noMethodsText')"
        :button-text="$t('payment.addMethod')"
        @action="showForm = true"
      />
      <slot v-else :data="data" />
    </Transition>

    <AddPaymentMethodModal
      v-model:show="showForm"
      :has-methods="data.length > 0"
      @done="getData"
    />
  </div>
</template>
