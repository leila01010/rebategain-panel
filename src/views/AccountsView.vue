<script setup>
import { ref } from 'vue'
import AccountProvider from '@/components/account/AccountProvider.vue'
import PageHeader from '@/components/PageHeader.vue'
import AddItemCard from '@/components/AddItemCard.vue'
import AddAccountModal from '@/components/account/AddAccountModal.vue'
import AccountItem from '@/components/account/AccountItem.vue'

const showForm = ref(false)
const accountProviderRef = ref(null)

function onAccountAdded() {
  accountProviderRef.value?.getData()
}
</script>

<template>
  <AccountProvider ref="accountProviderRef">
    <template #default="{ data }">
      <div>
        <PageHeader
          :title="$t('account.myAccounts')"
          :description="$t('account.myAccountsText')"
          :button-text="$t('account.addNewAccount')"
          @action="showForm = true"
        />
        <div class="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          <AccountItem v-for="account in data" :key="account.id" :account />
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
