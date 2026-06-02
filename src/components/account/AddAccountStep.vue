<script setup>
import { IrAlert, IrButton, IrDivider, IrInput } from '@/lib/ui-kit'
import BrokerVideoTutorial from '@/components/account/BrokerVideoTutorial.vue'
import { computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const props = defineProps({
  selectedBroker: { type: Object, default: null },
  hasAccount: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'close', 'done'])

const { t } = useI18n()

const ACCOUNT_ID_MIN = 4
const ACCOUNT_ID_MAX = 12

const loading = ref(false)

const { handleSubmit, meta } = useForm()
const {
  value: accountNumber,
  errorMessage: accountNumberError,
} = useField('accountNumber', validateAccountNumber, { initialValue: '' })

function validateAccountNumber(value) {
  const v = String(value ?? '').trim()
  if (!v) return t('account.accountIdRequired')
  if (v.length < ACCOUNT_ID_MIN) return t('account.accountIdMin', { min: ACCOUNT_ID_MIN })
  if (v.length > ACCOUNT_ID_MAX) return t('account.accountIdMax', { max: ACCOUNT_ID_MAX })
  return true
}

const videoLinks = computed(() => {
  const links = {}
  props.selectedBroker.links.forEach((link) => {
    if (links[link.key]) return
    links[link.key] = link
  })

  return links
})

const videoTutorialLink = computed(() => {
  const video = props.hasAccount ? videoLinks.value?.changeIb : videoLinks.value?.addAccount
  return video ? video.url : null
})

const canSubmit = computed(() => meta.value.valid)

const submit = handleSubmit(async (values) => {
  const data = {
    brokerId: props.selectedBroker?.id,
    accountNumber: values.accountNumber,
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
})
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
    <BrokerVideoTutorial v-if="videoTutorialLink" :video-src="videoTutorialLink" class="mt-4" />
    <IrDivider class="!my-6" />
    <form @submit.prevent="submit">
      <h4 v-text="$t('account.enterTradingAccount')" class="text-xs text-dark-blue-500 font-bold mb-1" />
      <p v-text="$t('account.enterTradingAccountText')" class="text-xs text-dark-blue-500 mb-4" />
      <IrInput
        v-model="accountNumber"
        :label="$t('account.accountID')"
        :error="accountNumberError"
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
          type="submit"
          :text="$t('account.submitAccount')"
          :disabled="!canSubmit"
          :loading
        />
      </div>
    </form>
  </div>
</template>
