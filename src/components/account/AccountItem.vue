<script setup>
import enums from '@/utils/enums.js'
import { formatCurrency } from '@/utils/helpers.js'
import { IrAlert, IrCard, IrChip, IrDivider, IrImg, IrModal } from '@/lib/ui-kit/index.js'
import { ref } from 'vue'

defineProps({
  account: { type: Object, default: null, required: true },
})

const STATUS_CONFIG = {
  active: {
    color: 'success',
    icon: 'check-circle'
  },
  pending: {
    color: 'primary',
    icon: 'time'
  },
  action_needed: {
    color: 'warning',
    icon: 'time'
  },
}

const showAlert = ref(false)
</script>

<template>
  <IrCard class="min-h-[244px]">
    <div class="flex items-center gap-x-2">
      <IrImg
        :src="account?.broker?.image"
        alt="broker"
        :min-width="40"
        :max-width="40"
        :height="40"
      />
      <div class="grow">
        <div class="flex items-center justify-between gap-1">
          <h4 class="text-sm font-bold text-dark-blue-600 leading-5 truncate max-w-24">{{ account?.broker?.name }}</h4>
          <IrChip
            :text="enums.getItem('ACCOUNT_STATUS', account.status, 'title')"
            :prepend-icon="STATUS_CONFIG[account.status].icon"
            :color="STATUS_CONFIG[account.status].color"
            size="sm"
          />
        </div>
        <span class="text-xs text-dark-blue-400 leading-3">{{ `ID: ${account.accountNumber}` }}</span>
      </div>
    </div>
    <IrDivider />
    <div v-text="$t('account.rebateGained')" class="text-xs text-dark-blue-300 mb-1" />
    <div class="text-xl text-dark-blue-700 font-bold mb-4">{{ formatCurrency(account.rebateGained) }}</div>
    <IrAlert
      v-if="account.status === 'pending'"
      icon="info"
      color="info"
      :description="$t('account.pendingAlert')"
    />
    <IrAlert
      v-else-if="account.status === 'action_needed'"
      icon="info"
      color="warning"
      :description="$t('account.actionNeededAlert')"
    >
      <button
        v-text="$t('account.howToFixAccount')"
        class="text-xs text-warning underline cursor-pointer mt-1"
        @click="showAlert = true"
      />
    </IrAlert>
  </IrCard>

  <IrModal
    v-model:show="showAlert"
    size="sm"
    body-class="text-sm leading-6"
    :title="$t('account.actionNeededAlert')"
  >
    Please click the button below to register a new profile with IC Markets. Our referral code is automatically applied.
    Once you have completed Step 1 and received your MT4/MT5 account number, enter it below to verify.
  </IrModal>
</template>
