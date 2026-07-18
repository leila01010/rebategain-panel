<script setup>
import { computed, ref, watch } from 'vue'
import { IrAlert, IrModal, IrButton, IrIcon } from '@/lib/ui-kit'
import AccountSelect from '@/components/select/AccountSelect.vue'
import TimePeriodSelect from '@/components/select/TimePeriodSelect.vue'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import moment from '@/lib/moment.js'

const show = defineModel('show', { type: Boolean, default: false })

const emit = defineEmits(['done'])

const accountId = ref(null)
const selectedAccount = ref(null)
const submitting = ref(false)
const submitted = ref(false)
const period = ref([])

const isAutomaticPayout = computed(() => !!selectedAccount.value?.broker?.automaticPayout)

const latestInquiryDate = computed(() => selectedAccount.value?.latestInquiryDate || null)

const isExceedLatestInquiryDate = computed(() =>
  moment(period.value[0]).isBefore(moment(latestInquiryDate.value).format('YYYY-MM-DD'))
)

const canSelectDate = computed(() =>
  accountId.value && !isAutomaticPayout.value && !submitted.value
)

const canSubmit = computed(() =>
  !!accountId.value && !!period.value.length && !isAutomaticPayout.value && !isExceedLatestInquiryDate.value
)

watch(show, (value) => {
  if (!value) reset()
})

watch(accountId, () => {
  period.value = []
})

async function submit() {
  if (!canSubmit.value || submitting.value) return
  const url = api.rebateEstimates.replace('{account}', accountId.value)
  submitting.value = true
  try {
    await http.post(url, {
      fromDate: period.value[0],
      toDate: period.value[1],
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
  period.value = []
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

      <TimePeriodSelect
        v-model="period"
        :label="$t('overview.timePeriod')"
        :disabled="!canSelectDate"
        :latest-inquiry-date="latestInquiryDate"
        block
        class="mb-6"
      />

      <IrAlert
        v-if="isAutomaticPayout"
        :title="$t('overview.automaticPayoutAlertTitle')"
        size="lg"
        icon="info"
        color="primary"
        class="mb-6"
      >
        <i18n-t
          keypath="overview.automaticPayoutAlertText"
          tag="p"
          class="text-xs text-blue-700 leading-[18px]"
        >
          <template #nonDirect>
            <strong>{{ $t('overview.nonDirectBrokers') }}</strong>
          </template>
          <template #broker>
            <strong>{{ selectedAccount?.broker?.name }}</strong>
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

      <IrAlert
        v-if="isExceedLatestInquiryDate"
        :description="$t('overview.requestedDateExceedAccountAgeAlert')"
        color="danger"
        icon="info"
        size="md"
        plain
        class="mb-3"
      />

      <IrButton
        v-if="submitted"
        :text="$t('overview.successfullySubmitted')"
        color="success"
        prepend-icon="check"
        block
        disabled
      />
      <IrButton
        v-else
        :text="$t('overview.submitRequest')"
        :loading="submitting"
        :disabled="!canSubmit"
        block
        @click="submit"
      />
    </form>
  </IrModal>
</template>
