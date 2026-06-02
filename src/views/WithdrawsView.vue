<script setup>
import { ref, computed } from 'vue'
import { IrCard, IrIcon, IrChip, IrButton } from '@/lib/ui-kit'
import DataTable from '@/components/dataTable/DataTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import WithdrawForm from '@/components/withdraw/WithdrawForm.vue'
import AddWithdrawModal from '@/components/withdraw/AddWithdrawModal.vue'
import WithdrawDetailsModal from '@/components/withdraw/WithdrawDetailsModal.vue'
import ViewWithdrawsModal from '@/components/withdraw/ViewWithdrawsModal.vue'
import { formatDate, maskMiddle, formatCurrency } from '@/utils/helpers.js'
import api from '@/api/api-list.js'
import enums from '@/utils/enums.js'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/composables/useDevice.js'

const { t } = useI18n()
const { isPhone } = useDevice()

const tableRef = ref(null)
const showForm = ref(false)
const showFullHistory = ref(false)
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

const filters = computed(() => [
  {
    key: 'status',
    title: t('common.status'),
    options: enums.getArray('WITHDRAWS_STATUS').map((s) => ({ value: s.value, label: s.title })),
  },
  /*{
    key: 'type',
    title: t('withdraw.methodTitle'),
    options: [
      { value: 'crypto', label: t('payment.tabs.crypto') },
      { value: 'bank', label: t('payment.tabs.bank') },
      { value: 'ewallet', label: t('payment.tabs.e-wallet') },
    ],
  },*/
])

const STATUS_CONFIG = {
  pending: { color: 'primary', icon: 'time' },
  accepted: { color: 'success', icon: 'check-circle' },
  paid: { color: 'success', icon: 'check-circle' },
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
        <WithdrawForm @done="tableRef?.fetch()" />
      </IrCard>
      <DataTable
        ref="tableRef"
        id="withdraws"
        :title="$t('withdraw.history')"
        :url="api.withdraws"
        :headers
        :filters
        :per-page="5"
        :show-pagination="isPhone"
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
              <p>{{ maskMiddle(data.userPaymentMethod.address.walletAddress) }}</p>
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

        <template #view-more>
          <button
            class="w-full flex items-center justify-center gap-2 p-4 cursor-pointer border-t border-blue-20"
            @click="showFullHistory = true"
          >
            <span class="text-xs text-dark-blue-600" v-text="$t('withdraw.viewFullHistory')" />
            <IrIcon :size="12" name="arrow-right" />
          </button>
        </template>
      </DataTable>
    </div>

    <IrButton
      v-if="isPhone"
      :text="$t('withdraw.addNewWithdraw')"
      color="secondary"
      class="withdraw-action"
      @click="showForm = true"
    />

    <AddWithdrawModal v-model:show="showForm" />
    <ViewWithdrawsModal v-model:show="showFullHistory" />
    <WithdrawDetailsModal v-model:show="showDetails" :item="selectedItem" />
  </div>
</template>

<style>
.withdraw-action {
  position: fixed;
  bottom: calc(var(--bottom-nav-height) + 20px + env(safe-area-inset-bottom, 0px));
  left: 16px;
  right: 16px;
  z-index: 20;
}
</style>
