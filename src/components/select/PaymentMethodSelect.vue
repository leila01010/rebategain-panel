<script setup>
import { computed, onMounted, ref } from 'vue'
import { IrSelect, IrButton } from '@/lib/ui-kit'
import AddPaymentMethodModal from '@/components/payment/AddPaymentMethodModal.vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

defineProps({
  error: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const selfValue = defineModel({ type: [String, Number], default: null })

const loading = ref(false)
const paymentMethods = ref([])
const showAddModal = ref(false)

const formattedPaymentMethods = computed(() => {
  return paymentMethods.value.map((paymentMethod) => {
    return {
      title: `${paymentMethod.assetNetwork?.network?.name} - ${paymentMethod.address.walletAddress}`,
      id: paymentMethod.id,
      ...paymentMethod,
    }
  })
})

async function fetch() {
  if (paymentMethods.value.length) return
  loading.value = true
  try {
    const { data } = await http.get(api.paymentMethods)
    loading.value = false
    paymentMethods.value = data
    const defaultMethod = paymentMethods.value.find(p => p.isDefault)
    if (defaultMethod) {
      selfValue.value = defaultMethod?.id
      emit('select', defaultMethod)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function onSelectedOptions(options) {
  emit('select', options?.[0] ?? null)
}

function onAdded(item) {
  paymentMethods.value.push(item)
  selfValue.value = item?.id
  emit('select', item)
}

onMounted(() => fetch())
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1 px-2">
      <span class="text-xs text-dark-blue-300" v-text="$t('withdraw.paymentMethod')" />
      <IrButton
        :text="$t('withdraw.addNew')"
        variant="plain"
        size="sm"
        color="secondary"
        @click="showAddModal = true"
      />
    </div>
    <IrSelect
      v-model="selfValue"
      :options="formattedPaymentMethods"
      :loading
      :error
      block
      @update:selected-options="onSelectedOptions"
    />

    <AddPaymentMethodModal v-model:show="showAddModal" @done="onAdded" />
  </div>
</template>
