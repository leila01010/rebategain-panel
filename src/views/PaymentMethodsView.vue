<script setup>
import { ref } from 'vue'
import PaymentMethodProvider from '@/components/payment/PaymentMethodProvider.vue'
import PaymentMethodCard from '@/components/payment/PaymentMethodCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import AddItemCard from '@/components/AddItemCard.vue'
import AddPaymentMethodModal from '@/components/payment/AddPaymentMethodModal.vue'

const showForm = ref(false)
const paymentMethods = ref(null)

function updateData() {
  paymentMethods.value?.getData()
}
</script>

<template>
  <PaymentMethodProvider ref="paymentMethods">
    <template #default="{ data }">
      <div>
        <PageHeader
          :title="$t('payment.title')"
          :description="$t('payment.description')"
          :button-text="$t('payment.addNewMethod')"
          @action="showForm = true"
        />
        <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-12">
          <PaymentMethodCard
            v-for="method in data"
            :key="method.id"
            :method="method"
            @set-default="updateData"
          />
          <AddItemCard
            :title="$t('payment.connectAnother')"
            :description="$t('payment.connectAnotherText')"
            @click="showForm = true"
          />
        </div>
      </div>
    </template>
  </PaymentMethodProvider>

  <AddPaymentMethodModal v-model:show="showForm" @done="updateData" />
</template>
