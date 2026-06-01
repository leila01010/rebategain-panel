<script setup>
import { computed } from 'vue'
import { IrModal, IrIcon, IrChip, IrDivider } from '@/lib/ui-kit'
import { formatDate, formatCurrency } from '@/utils/helpers.js'
import enums from '@/utils/enums.js'

const show = defineModel('show', { type: Boolean, default: false })

const props = defineProps({
  item: { type: Object, default: null },
})

const STATUS_CONFIG = {
  pending: { color: 'primary', icon: 'time' },
  accepted: { color: 'success', icon: 'check-circle' },
  paid: { color: 'success', icon: 'check-circle' },
  rejected: { color: 'danger', icon: 'close-circle' },
  expired: { color: 'danger', icon: 'close-circle' },
}

const assetNetwork = computed(() => {
  const an = props.item?.userPaymentMethod?.assetNetwork
  if (!an) return ''
  return `${an.asset.name} (${an.network.name})`
})

const walletAddress = computed(() => {
  return props.item?.userPaymentMethod?.address?.walletAddress || ''
})
</script>

<template>
  <IrModal
    v-model:show="show"
    size="296px"
    :title="$t('withdraw.requestDetails')"
    :full-screen="false"
  >
    <template #header-prepend>
      <IrIcon name="upload" :size="16" class="text-dark-blue-500" />
    </template>

    <div v-if="item" class="withdraw-details">
      <div class="withdraw-details__row">
        <div class="text-dark-blue-300">
          <span class="withdraw-details__label" v-text="`${$t('withdraw.reqID')}:`" />
          <span class="withdraw-details__value font-bold">{{ ` WD-${item.id}` }}</span>
        </div>
        <IrChip
          :text="enums.getItem('WITHDRAWS_STATUS', item.status, 'title')"
          :prepend-icon="STATUS_CONFIG[item.status].icon"
          :color="STATUS_CONFIG[item.status].color"
          size="sm"
        />
      </div>
      <div>
        <span class="withdraw-details__label" v-text="$t('withdraw.date')" />
        <span class="withdraw-details__value">{{ ` ${formatDate(item.createdAt)}` }}</span>
      </div>

      <IrDivider class="my-4" />

      <div>
        <span class="withdraw-details__label" v-text="$t('withdraw.amountLabel')" />
        <span class="withdraw-details__value font-bold">{{
          ` ${formatCurrency(item.amount)}`
        }}</span>
      </div>
      <div>
        <span class="withdraw-details__label" v-text="$t('withdraw.method')" />
        <span class="withdraw-details__value">{{ ` ${assetNetwork}` }}</span>
      </div>
      <div>
        <span class="withdraw-details__label" v-text="`${$t('withdraw.walletAddress')}:`" />
        <span class="withdraw-details__value">{{ ` ${walletAddress}` }}</span>
      </div>

      <template v-if="item.description">
        <IrDivider class="my-4" />
        <div class="text-primary font-medium mb-1" v-text="$t('withdraw.description')" />
        <p class="text-dark-blue-600">{{ item.description }}</p>
      </template>
    </div>
  </IrModal>
</template>

<style lang="scss">
.withdraw-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__label {
    color: var(--color-dark-blue-300);
  }

  &__value {
    color: var(--color-dark-blue-600);
    font-weight: 500;
  }
}
</style>
