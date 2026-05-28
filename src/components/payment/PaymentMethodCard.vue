<script setup>
import { computed, ref } from 'vue'
import { IrCard, IrChip, IrAlert, IrIcon, IrButton, message } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const props = defineProps({
  method: { type: Object, required: true },
})

const emit = defineEmits(['set-default'])

const { t } = useI18n()

const loading = ref(false)

const TYPE_ICON = {
  crypto: 'finance',
  bank: 'wallet',
  ewallet: 'dollar',
}

const icon = computed(() => TYPE_ICON[props.method.type] || 'wallet')

const title = computed(() => {
  const asset = props.method?.assetNetwork?.asset || {}
  if (props.method.type === 'crypto') return `${asset.code} (${asset.name})` || t('payment.types.crypto')
  if (props.method.type === 'bank') return t('payment.types.bank')
  return props.method.provider || t('payment.types.ewallet')
})

const subtitle = computed(() => {
  const m = props.method
  if (m.type === 'crypto') return m.assetNetwork?.network?.name
  if (m.type === 'bank') return m.bankName
  return t('payment.types.ewallet')
})

async function setDefault() {
  loading.value = true
  try {
    await http.patch(api.paymentMethodDefault.replace('{id}', props.method.id))
    message.success(t('payment.defaultUpdated'))
    emit('set-default')
  } catch (e) {
    message.error(e?.error || t('payment.saveError'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <IrCard class="payment-card">
    <div class="flex items-center gap-x-2 mb-4">
      <div class="payment-card__icon">
        <IrIcon :name="icon" :size="22" />
      </div>
      <div class="grow">
        <div class="w-full flex items-center justify-between gap-2 mb-1">
          <h4 class="text-sm font-bold text-dark-blue-600 leading-5 truncate">{{ title }}</h4>
          <IrChip
            v-if="method.isDefault"
            :text="$t('payment.default')"
            prepend-icon="check"
            color="primary"
            size="sm"
          />
        </div>
        <span class="text-xs text-dark-blue-400 leading-4 truncate block">{{ subtitle }}</span>
      </div>
    </div>

    <IrAlert color="info" size="sm">
      <span class="text-xs text-dark-blue-300" v-text="$t('payment.walletAddress')" />
      <p class="text-dark-blue-500 text-sm md:text-lg font-medium tracking-[4px] mt-1" v-text="method.address.walletAddress" />
    </IrAlert>

    <div v-if="!method.isDefault" class="flex justify-end mt-4">
      <IrButton
        :text="$t('payment.setAsDefault')"
        variant="plain"
        color="secondary"
        :loading
        @click="setDefault"
      />
    </div>
  </IrCard>
</template>

<style scoped lang="scss">
.payment-card {
  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    background-color: #F6F8FE;
    border: 1px solid var(--color-dark-blue-50);
    color: var(--color-dark-blue-300);
  }

  &__details {
    margin-top: 16px;
  }
  .payment-card__details :deep(.ir-alert__icon) {
    display: none;
  }

  .payment-card__fields {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .payment-card__field {
    min-width: 0;
  }
  .payment-card__field--end {
    text-align: end;
  }

  .payment-card__field-label {
    font-size: 12px;
    color: var(--color-dark-blue-300);
    margin-bottom: 6px;
  }

  .payment-card__field-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-dark-blue-700);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.08em;
    word-break: break-all;
  }

  .payment-card__default-btn {
    align-self: flex-end;
    margin-top: auto;
    padding-top: 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-dark-blue-400);
    background: none;
    border: none;
    cursor: pointer;
  }
  .payment-card__default-btn:hover {
    color: var(--color-primary);
  }
}
</style>
