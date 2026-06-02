<script setup>
import { computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { IrButton, IrInput, IrCard, message } from '@/lib/ui-kit'
import PaymentMethodSelect from '@/components/select/PaymentMethodSelect.vue'
import api from '@/api/api-list.js'
import http from '@/services/http.js'
import { useI18n } from 'vue-i18n'
import { formatCurrency } from '@/utils/helpers.js'

const emit = defineEmits(['done'])

const { t } = useI18n()

const MIN_AMOUNT = 50

const submitting = ref(false)
const selectedPaymentMethod = ref(null)

const { handleSubmit, meta, resetField } = useForm()
const {
  value: amount,
  errorMessage: amountError,
} = useField('amount', validateAmount, { initialValue: '' })
const {
  value: userPaymentMethodId,
  errorMessage: paymentMethodError,
} = useField('userPaymentMethodId', validatePaymentMethod, { initialValue: '' })

function validateAmount(value) {
  if (value === '' || value == null) return t('withdraw.amountRequired')
  const n = Number(value)
  if (Number.isNaN(n)) return t('withdraw.amountInvalid')
  if (n < MIN_AMOUNT) return t('withdraw.amountMin', { min: MIN_AMOUNT.toFixed(2) })
  return true
}

function validatePaymentMethod(value) {
  return value ? true : t('withdraw.paymentMethodRequired')
}

const canSubmit = computed(() => meta.value.valid)

const processingFee = computed(() => {
  const value = selectedPaymentMethod.value?.assetNetwork?.withdrawFee * 1 || 0
  return value.toFixed(2)
})

const amountReceived = computed(() => {
  return amount.value ? Number(amount.value) - Number(processingFee.value) : 0
})

const submit = handleSubmit(async (values) => {
  if (submitting.value) return
  const data = {
    amount: amountReceived.value,
    userPaymentMethodId: values.userPaymentMethodId,
  }
  submitting.value = true
  try {
    await http.post(api.withdraws, data)
    message.success(t('withdraw.withdrawalSubmittedSuccessfully'))
    resetField('amount')
    emit('done')
  } catch (e) {
    console.log(e?.error)
  } finally {
    submitting.value = false
  }
})

function onSelectPaymentMethod(item) {
  selectedPaymentMethod.value = item
}
</script>

<template>
  <form @submit.prevent="submit">
    <IrInput
      v-model="amount"
      :min="0"
      :label="$t('withdraw.amount')"
      :helper-text="$t('withdraw.amountHint')"
      :error="amountError"
      type="number"
      class="mb-4"
      block
    >
      <template #prefix>$</template>
      <!--<template #suffix>
        <button
          class="w-[53px] h-7 bg-blue-20 rounded-full flex items-center justify-center text-xs text-primary font-bold -me-2 cursor-pointer"
          @click="setMaxValue"
        >Max</button>
      </template>-->
    </IrInput>

    <PaymentMethodSelect
      v-model="userPaymentMethodId"
      :error="paymentMethodError"
      class="mb-4"
      @select="onSelectPaymentMethod"
    />

    <IrCard bg-color="bg-blue-20" class="mb-6">
      <div class="flex items-center justify-between gap-2 text-xs mb-1">
        <span v-text="$t('withdraw.processingFee')" class="text-dark-blue-300" />
        <span class="font-medium">{{ `${processingFee} USD` }}</span>
      </div>
      <div class="flex items-center justify-between gap-2 text-xs">
        <span v-text="$t('withdraw.estimatedArrival')" class="text-dark-blue-300" />
        <span v-text="$t('withdraw.within24Hours')" class="font-medium" />
      </div>
      <div class="w-full h-px bg-dark-blue-50 my-2" />
      <div class="flex items-center justify-between gap-2 text-sm text-dark-blue-600 font-medium">
        <span v-text="$t('withdraw.youWillReceive')" />
        <span>{{ formatCurrency(amountReceived) }}</span>
      </div>
    </IrCard>

    <IrButton
      :text="$t('withdraw.submitWithdrawalRequest')"
      :loading="submitting"
      :disabled="!canSubmit"
      block
      @click="submit"
    />
  </form>
</template>
