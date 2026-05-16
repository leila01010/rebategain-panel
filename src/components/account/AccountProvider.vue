<script setup>
import { defineExpose, onMounted, ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import AddAccountModal from '@/components/account/AddAccountModal.vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const loading = ref(true)
const showForm = ref(false)
const data = ref([])

async function getData() {
  try {
    const res = await http.get(api.accounts)
    data.value = res?.data
    loading.value = false
  } catch (e) {
    loading.value = false
    console.log(e)
  }
}

onMounted(() => getData())

defineExpose({ getData })
</script>

<template>
  <div>
    <Transition name="fade" mode="out-in">
      <LoadingState v-if="loading" />
      <EmptyState
        v-else-if="!data.length"
        icon="city"
        :title="$t('account.noAccounts')"
        :description="$t('account.noAccountsText')"
        :button-text="$t('account.addAccount')"
        @action="showForm = true"
      />
      <slot v-else :data="data" />
    </Transition>

    <AddAccountModal v-model:show="showForm" @done="getData" />
  </div>
</template>
