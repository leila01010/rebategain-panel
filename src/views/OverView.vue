<script setup>
import { IrCard, IrIcon, IrButton, IrChip, IrDivider } from '@/lib/ui-kit'
import OverviewProvider from '@/components/overview/OverviewProvider.vue'
import RebateEstimateModal from '@/components/inquiry/RebateEstimateModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import AddWithdrawModal from '@/components/withdraw/AddWithdrawModal.vue'
import { computed, ref } from 'vue'
import { formatCurrency, formatDate } from '@/utils/helpers.js'
import api from '@/api/api-list.js'
import { useI18n } from 'vue-i18n'
import enums from '@/utils/enums.js'

const { t } = useI18n()

const tableRef = ref(null)
const providerRef = ref(null)
const showForm = ref(false)
const showWithdrawForm = ref(false)

const headers = computed(() => [
  {
    key: 'createdAt',
    title: t('common.date'),
    type: 'date',
  },
  {
    key: 'account.broker.name',
    title: t('common.broker'),
  },
  {
    key: 'amount',
    title: t('common.amount'),
    align: 'center',
  },
  {
    key: 'status',
    title: t('common.status'),
    align: 'center',
  },
])

const STATUS_CONFIG = {
  pending: { color: 'primary', icon: 'time' },
  accepted: { color: 'success', icon: 'check-circle' },
  paid: { color: 'success', icon: 'check-circle' },
  rejected: { color: 'danger', icon: 'close-circle' },
  expired: { color: 'danger', icon: 'close-circle' },
}

const requestsInProcess = (data) => {
  const requestInProcess = data?.withdraw?.requestInProcess || 0
  return requestInProcess > 1
    ? t('overview.requestsInProcess', { count: requestInProcess })
    : t( 'overview.requestInProcess', { count: requestInProcess })
}
</script>

<template>
  <OverviewProvider ref="providerRef">
    <template #default="{ data }">
      <div>
        <PageHeader
          :title="$t('overview.rebates')"
          :description="$t('overview.rebatesText')"
          :button-text="$t('overview.rebateEstimate')"
          @action="showForm = true"
        />
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-8">
          <IrCard class="col-span-2 lg:col-span-1" body-class="!p-0">
            <div class="p-4">
              <div class="w-full flex items-center justify-between gap-2 mb-2">
                <span v-text="$t('overview.availableBalance')" class="text-sm text-dark-blue-600" />
                <IrIcon name="wallet" size="20" class="text-dark-blue-300" />
              </div>
              <h4 class="w-full text-2xl font-bold text-primary">{{ formatCurrency(data.rebateBalance) }}</h4>
            </div>
            <IrDivider class="!m-0" />
            <div class="flex items-center justify-center p-4">
              <IrButton
                :text="$t('overview.withdrawFunds')"
                size="sm"
                variant="plain"
                prepend-icon="upload"
                @click="showWithdrawForm = true"
              />
            </div>
          </IrCard>
          <IrCard class="col-span-1 lg:col-span-1">
            <div class="w-full flex items-center justify-between gap-2 mb-2">
              <span v-text="$t('overview.totalRebateGained')" class="text-sm text-dark-blue-600" />
              <IrIcon name="dollar" size="20" class="text-dark-blue-300" />
            </div>
            <h4 class="w-full text-lg md:text-2xl font-bold mb-4 md:mb-8">{{ formatCurrency(data?.rebateGained?.total) }}</h4>
            <div
              class="flex items-center gap-1 text-xs"
              :class="data.rebateGained?.monthlyChangePercent > 0 ? 'text-success' : 'text-danger'"
            >
              <IrIcon
                :name="data.rebateGained?.monthlyChangePercent > 0 ? 'up-small' : 'down-small'"
                :size="12"
              />
              <span v-text="$t('overview.changeFromLastMonth', { value: `${data.rebateGained?.monthlyChangePercent}%` })" />
            </div>
          </IrCard>
          <IrCard class="col-span-1 lg:col-span-1">
            <div class="w-full flex items-center justify-between gap-2 mb-2">
              <span v-text="$t('overview.totalWithdrawn')" class="text-sm text-dark-blue-600" />
              <IrIcon name="upload" size="20" class="text-dark-blue-300" />
            </div>
            <h4
              class="w-full text-lg md:text-2xl font-bold mb-4 md:mb-8">
              {{ formatCurrency(data?.withdraw?.totalWithdrawAmount) }}
            </h4>
            <p
              v-text="requestsInProcess(data)"
              class="text-dark-blue-300 text-xs"
            />
          </IrCard>
        </div>
        <DataTable
          ref="tableRef"
          id="inquiries"
          :title="$t('overview.rebateHistory')"
          :url="api.inquiries"
          :headers
          :per-page="5"
        >
          <template #item-status="{ data }">
            <IrChip
              :text="enums.getItem('INQUIRY_STATUS', data.status, 'title')"
              :prepend-icon="STATUS_CONFIG[data.status].icon"
              :color="STATUS_CONFIG[data.status].color"
              size="sm"
            />
          </template>
          <template #mobile-item="{ item }">
            <div class="flex items-center gap-2 justify-between text-dark-blue-600 mb-4">
              <span class="text-lg font-bold" v-text="item.amount || '-'" />
              <IrChip
                :text="enums.getItem('INQUIRY_STATUS', item.status, 'title')"
                :prepend-icon="STATUS_CONFIG[item.status].icon"
                :color="STATUS_CONFIG[item.status].color"
                size="sm"
              />
            </div>
            <div class="flex items-center gap-2 justify-between text-xs text-dark-blue-600">
              <span v-text="formatDate(item.createdAt)" />
              <span class="font-bold" v-text="item?.account?.broker?.name" />
            </div>
          </template>
        </DataTable>
      </div>
    </template>
  </OverviewProvider>

  <RebateEstimateModal v-model:show="showForm" @done="tableRef?.fetch()" />

  <AddWithdrawModal v-model:show="showWithdrawForm" @done="providerRef?.getData()" />
</template>
