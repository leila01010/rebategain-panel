<script setup>
import { computed, ref, watch } from 'vue'
import { IrAlert, IrModal, IrSelect, IrButton, IrIcon } from '@/lib/ui-kit'
import AccountSelect from '@/components/select/AccountSelect.vue'
import { useI18n } from 'vue-i18n'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import moment from '@/lib/moment'

const show = defineModel('show', { type: Boolean, default: false })

const emit = defineEmits(['done'])

const { t } = useI18n()

const accountId = ref(null)
const selectedAccount = ref(null)
const period = ref('7')
const submitting = ref(false)
const submitted = ref(false)

const periodOptions = [
  { id: '7', title: t('overview.last7Days') },
  { id: '30', title: t('overview.last30Days') },
  { id: '90', title: t('overview.last90Days') },
]

const isAutomaticPayout = computed(() => !!selectedAccount.value?.broker?.automaticPayout)

const canSubmit = computed(() => !!accountId.value && !!period.value && !isAutomaticPayout.value)

const dateRange = computed(() => {
  const days = Number(period.value)
  return {
    fromDate: moment().subtract(days, 'days').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
  }
})

watch(show, (value) => {
  if (!value) reset()
})

async function submit() {
  if (!canSubmit.value || submitting.value) return
  const url = api.rebateEstimates.replace('{account}', accountId.value)
  submitting.value = true
  try {
    await http.post(url, {
      fromDate: dateRange.value.fromDate,
      toDate: dateRange.value.toDate,
    })
    submitted.value = true
    emit('done')
    setTimeout(() => (show.value = false), 1800)
  } finally {
    submitting.value = false
  }
}

function reset() {
  accountId.value = null
  selectedAccount.value = null
  period.value = '7'
  submitted.value = false
  submitting.value = false
}
</script>

<template>
  <IrModal
    v-model:show="show"
    size="355px"
    :title="$t('overview.requestRebateEstimate')"
  >
    <template #header-prepend>
      <IrIcon name="dashboard" :size="18" class="text-dark-blue-500" />
    </template>

    <form>
      <p class="text-dark-blue-300 text-xs mb-6">
        {{ $t('overview.requestRebateEstimateText') }}
      </p>

      <AccountSelect
        v-model="accountId"
        :disabled="submitted"
        class="mb-4"
        @select="selectedAccount = $event"
      />

      <IrSelect
        v-model="period"
        :options="periodOptions"
        :label="$t('overview.timePeriod')"
        :disabled="submitted"
        block
      />

      <IrAlert
        v-if="isAutomaticPayout"
        :title="$t('overview.automaticPayoutAlertTitle')"
        size="lg"
        icon="info"
        color="info"
        class="mt-4"
      >
        <i18n-t
          keypath="overview.automaticPayoutAlertText"
          tag="p"
          class="text-xs text-dark-blue-500 leading-[18px]"
        >
          <template #nonDirect>
            <strong>{{ $t('overview.nonDirectBrokers') }}</strong>
          </template>
        </i18n-t>
        <div class="flex justify-end">
          <IrButton
            :text="$t('overview.myBrokerAccount')"
            :url="selectedAccount?.broker?.link"
            target="_blank"
            prepend-icon="share"
            variant="plain"
            size="sm"
            class="mt-2"
          />
        </div>
      </IrAlert>

      <IrButton
        v-if="submitted"
        :text="$t('overview.successfullySubmitted')"
        color="success"
        prepend-icon="check"
        class="mt-6"
        block
        disabled
      />
      <IrButton
        v-else
        :text="$t('overview.submitRebateRequest')"
        :loading="submitting"
        :disabled="!canSubmit"
        class="mt-6"
        block
        @click="submit"
      />
    </form>
  </IrModal>
</template>
