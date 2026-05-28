<script setup>
import { ref } from 'vue'
import { IrCard, IrImg, IrChip, IrDivider, IrAlert } from '@/lib/ui-kit'
import AccountProvider from '@/components/account/AccountProvider.vue'
import PageHeader from '@/components/PageHeader.vue'
import AddItemCard from '@/components/AddItemCard.vue'
import AddAccountModal from '@/components/account/AddAccountModal.vue'
import { formatCurrency } from '@/utils/helpers.js'
import enums from '@/utils/enums.js'

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

const showForm = ref(false)
const accountProvider = ref(null)

function onAccountAdded() {
  accountProvider.value?.getData()
}
</script>

<template>
  <AccountProvider ref="accountProvider">
    <template #default="{ data }">
      <div>
        <PageHeader
          :title="$t('account.myAccounts')"
          :description="$t('account.myAccountsText')"
          :button-text="$t('account.addNewAccount')"
          @action="showForm = true"
        />
        <div class="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-12">
          <IrCard v-for="account in data" :key="account.id" class="min-h-[244px]">
            <div class="flex items-center gap-x-2">
              <IrImg
                :src="account.broker.image"
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
          </IrCard>
          <AddItemCard
            :title="$t('account.connectAnotherAccount')"
            :description="$t('account.connectAnotherAccountText')"
            @click="showForm = true"
          />
        </div>
      </div>
    </template>
  </AccountProvider>

  <AddAccountModal v-model:show="showForm" @done="onAccountAdded" />
</template>
