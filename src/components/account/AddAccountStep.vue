<script setup>
import { IrAlert, IrButton, IrDivider, IrInput } from '@/lib/ui-kit'
import { ref } from 'vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const props = defineProps({
  selectedBroker: { type: Object, default: null },
  hasAccount: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'close', 'done'])

const loading = ref(false)
const accountNumber = ref('')

async function submit() {
  const data = {
    brokerId: props.selectedBroker?.id,
    accountNumber: accountNumber.value,
  }
  loading.value = true
  try {
    await http.post(api.accounts, data)
    emit('done')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <IrButton
      :text="$t('common.back')"
      prepend-icon="arrow-left"
      variant="plain"
      class="mb-4"
      @click="emit('back', 'account-status')"
    />
    <IrAlert
      v-if="hasAccount"
      :title="$t('account.openAccountByLink')"
      :description="selectedBroker?.changeIbTutorial"
      size="lg"
      icon="info"
      color="primary"
    >
      <IrButton
        block
        :text="$t('account.openBrokerAccount', { broker: selectedBroker?.title })"
        :url="selectedBroker?.link"
        target="_blank"
        append-icon="share"
        size="sm"
        class="mt-4"
      />
    </IrAlert>
    <IrAlert
      v-else
      :title="$t('account.linkAccountWithIB')"
      :description="selectedBroker?.addingAccountTutorial"
      size="lg"
      icon="info"
      color="primary"
    >
      <IrButton
        block
        :text="$t('account.openBrokerAccount', { broker: selectedBroker?.title })"
        :url="selectedBroker?.link"
        target="_blank"
        append-icon="share"
        size="sm"
        class="mt-4"
      />
    </IrAlert>
    <IrDivider class="!my-6" />
    <h4 v-text="$t('account.enterTradingAccount')" class="text-xs text-dark-blue-500 font-bold mb-1" />
    <p v-text="$t('account.enterTradingAccountText')" class="text-xs text-dark-blue-500 mb-4" />
    <IrInput
      v-model="accountNumber"
      :label="$t('account.accountID')"
      placeholder="e.g. 8829102"
      class="mb-6"
      block
    />
    <div class="flex justify-end gap-2">
      <IrButton
        :text="$t('common.cancel')"
        variant="text"
        color="secondary"
        @click="emit('close')"
      />
      <IrButton
        :text="$t('account.submitAccount')"
        :disabled="!accountNumber"
        :loading
        @click="submit"
      />
    </div>
  </div>
</template>
