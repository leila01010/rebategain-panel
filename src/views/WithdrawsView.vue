<script setup>
import { ref, computed } from 'vue'
import { IrCard, IrIcon, IrChip, IrButton } from '@/lib/ui-kit'
import DataTable from '@/components/dataTable/DataTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import WithdrawForm from '@/components/withdraw/WithdrawForm.vue'
import AddWithdrawModal from '@/components/withdraw/AddWithdrawModal.vue'
import WithdrawDetailsModal from '@/components/withdraw/WithdrawDetailsModal.vue'
import { formatDate, maskString, formatCurrency } from '@/utils/helpers.js'
import api from '@/api/api-list.js'
import enums from '@/utils/enums.js'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/composables/useDevice.js'

const { t } = useI18n()
const { isPhone } = useDevice()

const showForm = ref(false)
const showDetails = ref(false)
const selectedItem = ref(null)

function openDetails(item) {
  selectedItem.value = item
  showDetails.value = true
}

const headers = computed(() => [
  {
    key: 'dateID',
    title: t('withdraw.dateID'),
  },
  {
    key: 'details',
    title: t('common.details'),
  },
  {
    key: 'amount',
    title: t('common.amount'),
    align: 'center',
  },
  {
    key: 'status',
    title: t('common.status'),
  },
])

const STATUS_CONFIG = {
  pending: { color: 'primary', icon: 'time' },
  accepted: { color: 'success', icon: 'check-circle' },
  rejected: { color: 'danger', icon: 'close-circle' },
  expired: { color: 'danger', icon: 'close-circle' },
}

const TYPE_ICON = {
  crypto: 'finance',
  bank: 'wallet',
  ewallet: 'dollar',
}

const assetNetwork = (item) => {
  const assetNetwork = item.userPaymentMethod.assetNetwork || {}
  return `${assetNetwork.asset.name} (${assetNetwork.network.name})`
}
</script>

<template>
  <div class="withdraws">
    <PageHeader
      :title="$t('withdraw.withdrawFunds')"
      :description="$t('withdraw.withdrawFundsText')"
    />

    <div class="flex flex-col lg:flex-row gap-4">
      <IrCard v-if="!isPhone" :title="$t('withdraw.newWithdrawal')" class="lg:basis-1/3">
        <WithdrawForm />
      </IrCard>
      <DataTable
        ref="tableRef"
        id="withdraws"
        :title="$t('withdraw.history')"
        :url="api.withdraws"
        :headers
        :per-page="5"
        class="grow lg:basis-2/3"
      >
        <template #item-dateID="{ data }">
          <div>
            <span class="inline-block text-dark-blue-600 font-bold mb-1">{{ `WD-${data.id}` }}</span>
            <p class="text-dark-blue-300">{{ formatDate(data.createdAt) }}</p>
          </div>
        </template>
        <template #item-details="{ data }">
          <div class="flex gap-1">
            <div class="size-9 rounded-full bg-blue-20 border border-dark-blue-50 p-[7px]">
              <IrIcon
                :name="TYPE_ICON[data.userPaymentMethod.type]"
                :size="20"
                class="text-dark-blue-300"
              />
            </div>
            <div>
              <span>{{ assetNetwork(data) }}</span>
              <p>{{ maskString(data.userPaymentMethod.address.walletAddress) }}</p>
            </div>
          </div>
        </template>
        <template #item-amount="{ data }">
          <span v-text="formatCurrency(data.amount)" class="font-bold" />
        </template>
        <template #item-status="{ data }">
          <IrChip
            :text="enums.getItem('WITHDRAWS_STATUS', data.status, 'title')"
            :prepend-icon="STATUS_CONFIG[data.status].icon"
            :color="STATUS_CONFIG[data.status].color"
            size="sm"
          />
        </template>
        <template #mobile-item="{ item }">
          <div class="cursor-pointer" @click="openDetails(item)">
            <div class="flex items-center gap-2 justify-between text-dark-blue-600 mb-4">
              <span class="text-lg font-bold" v-text="formatCurrency(item.amount)" />
              <IrChip
                :text="enums.getItem('WITHDRAWS_STATUS', item.status, 'title')"
                :prepend-icon="STATUS_CONFIG[item.status].icon"
                :color="STATUS_CONFIG[item.status].color"
                size="sm"
              />
            </div>
            <div class="flex items-center gap-2 justify-between text-xs text-dark-blue-600">
              <span class="text-dark-blue-300" v-text="formatDate(item.createdAt)" />
              <span>
                <span class="text-dark-blue-300" v-text="$t('withdraw.reqID')" />
                <span class="font-bold">{{ ` WD-${item.id}` }}</span>
              </span>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <IrButton
      v-if="isPhone"
      :text="$t('withdraw.addNewWithdraw')"
      color="secondary"
      class="withdraw-action absolute left-4 right-4 bottom-8"
      @click="showForm = true"
    />

    <AddWithdrawModal v-model:show="showForm" />
    <WithdrawDetailsModal v-model:show="showDetails" :item="selectedItem" />
  </div>
</template>

<style>
.withdraw-action {
  position: absolute;
  bottom: calc(64px + 20px + env(safe-area-inset-bottom, 0px));
  left: 16px;
  right: 16px;
  z-index: 20;
}
</style>
