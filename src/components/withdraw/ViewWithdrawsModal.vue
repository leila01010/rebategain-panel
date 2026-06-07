<script setup>
import api from '@/api/api-list.js'
import { formatCurrency, formatDate, maskMiddle } from '@/utils/helpers.js'
import enums from '@/utils/enums.js'
import { STATUSES } from '@/data/statuses.js'
import { IrChip, IrIcon, IrModal } from '@/lib/ui-kit'
import DataTable from '@/components/dataTable/DataTable.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IrButton } from '@/lib/ui-kit/index.js'

const { t } = useI18n()

const show = defineModel('show', { type: Boolean, default: false })

const headers = computed(() => [
  {
    key: 'reqID',
    title: t('withdraw.reqID'),
  },
  {
    key: 'date',
    title: t('common.date'),
  },
  {
    key: 'method',
    title: t('common.method'),
  },
  {
    key: 'walletAddress',
    title: t('withdraw.walletAddress'),
  },
  {
    key: 'amount',
    title: t('common.amount'),
  },
  {
    key: 'status',
    title: t('common.status'),
  },
  {
    key: 'rejectionReason',
    title: t('common.description'),
    width: '200px'
  },
])

const filters = computed(() => [
  {
    key: 'status',
    title: t('common.status'),
    options: enums.getArray('WITHDRAWS_STATUS').map((s) => ({ value: s.value, label: s.title })),
  },
])

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
  <IrModal
    v-model:show="show"
    size="1000px"
    body-class="withdraw-full-history"
  >
    <DataTable
      ref="tableRef"
      id="withdraws"
      :title="$t('withdraw.fullHistory')"
      :subtitle="$t('withdraw.fullHistoryText')"
      :url="api.withdraws"
      :headers
      :filters
      :per-page="6"
    >
      <template #item-reqID="{ data }">
        <span class="inline-block text-dark-blue-600 font-bold mb-1">{{ `WD-${data.id}` }}</span>
      </template>
      <template #item-date="{ data}">
        {{ formatDate(data.createdAt) }}
      </template>
      <template #item-method="{ data}">
        <div class="flex items-center gap-1">
          <div class="size-5 flex items-center justify-center rounded-full bg-blue-20 border border-dark-blue-50">
            <IrIcon
              :name="TYPE_ICON[data.userPaymentMethod.type]"
              :size="12"
              class="text-dark-blue-300"
            />
          </div>
          <span class="font-medium">{{ assetNetwork(data) }}</span>
        </div>
      </template>
      <template #item-walletAddress="{ data}">
        {{ maskMiddle(data.userPaymentMethod.address.walletAddress) }}
      </template>
      <template #item-amount="{ data }">
        <span v-text="formatCurrency(data.amount)" class="font-bold" />
      </template>
      <template #item-status="{ data }">
        <IrChip
          :text="enums.getItem('WITHDRAWS_STATUS', data.status, 'title')"
          :prepend-icon="STATUSES[data.status].icon"
          :color="STATUSES[data.status].color"
          size="sm"
        />
      </template>
      <template #mobile-item="{ item }">
        <div class="cursor-pointer" @click="openDetails(item)">
          <div class="flex items-center gap-2 justify-between text-dark-blue-600 mb-4">
            <span class="text-lg font-bold" v-text="formatCurrency(item.amount)" />
            <IrChip
              :text="enums.getItem('WITHDRAWS_STATUS', item.status, 'title')"
              :prepend-icon="STATUSES[item.status].icon"
              :color="STATUSES[item.status].color"
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

    <div class="flex justify-end p-3">
      <IrButton
        :text="$t('common.close')"
        variant="outline"
        color="secondary"
        size="sm"
        @click="show = false"
      />
    </div>
  </IrModal>
</template>

<style>
.withdraw-full-history {
  padding: 4px;
  .ir-card {
    border: none;
  }
}
</style>
