<script setup>
import { IrCard } from '@/lib/ui-kit'
import DataTable from '@/components/dataTable/DataTable.vue'
import PageHeader from '@/components/PageHeader.vue'
import api from '@/api/api-list.js'

const headers = [
  {
    key: 'order',
    title: 'Req. ID & Date',
  },
  {
    key: 'name',
    title: 'Details',
  },
  {
    key: 'rating',
    title: 'Amount',
    align: 'center',
  },
  {
    key: 'actions',
    title: 'action',
    align: 'center',
  },
]
</script>

<template>
  <div class="mt-12">
    <PageHeader
      title="My Accounts"
      description="Manage your connected brokers."
      button-text="Add new account"
      class="mb-6"
    />
    <div>
      <IrCard class="mb-6">
        If you've skipped this step before you know
        what a headache it can be. If you weren't aware of this step when setting
        up Prettier and ESLint before you'd likely never want to
        use either of the tools again! Luckily it's easily fixable.
      </IrCard>
      <IrCard title="Rebate History" flush header-class="!border-0" class="mb-6">
        <DataTable id="brokers" :url="api.brokers" :headers striped="even" />
      </IrCard>
    </div>
  </div>
</template>
