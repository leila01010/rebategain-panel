<script setup>
import { computed, ref, reactive, markRaw, watch } from 'vue'
import { IrModal, IrProgress } from '@/lib/ui-kit'
import SelectBrokerStep from '@/components/account/SelectBrokerStep.vue'
import AccountStatusStep from '@/components/account/AccountStatusStep.vue'
import AddAccountStep from '@/components/account/AddAccountStep.vue'

const show = defineModel('show', { type: Boolean, default: false })

const emit = defineEmits(['done'])

const step = ref('broker')
const selectedBroker = ref(null)

const steps = reactive([
  { key: 'broker', cmp: markRaw(SelectBrokerStep), value: '' },
  { key: 'account-status', cmp: markRaw(AccountStatusStep), value: '' },
  { key: 'add-account', cmp: AddAccountStep, value: '' },
])

const activeStep = computed(() => {
  return steps.find(s => s.key === step.value)
})

const activeStepIndex = computed(() => {
  return steps.findIndex(s => s.key === step.value) + 1
})

const hasAccount = computed(() => {
  const step = steps.find(s => s.key === 'account-status') || {}

  return step.value === 'yes'
})

watch(show, (show) => {
  if (!show) reset()
})

function nextStep(data) {
  if (data?.broker) selectedBroker.value = data.broker
  const currentIndex = steps.findIndex((s) => s.key === step.value)
  const next = steps[currentIndex + 1]
  if (next) step.value = next.key
}

function reset() {
  step.value = 'broker'
  selectedBroker.value = null
  steps.forEach((s) => s.value = '')
}

function handleDone() {
  show.value = false
  emit('done')
  reset()
}
</script>

<template>
  <IrModal v-model:show="show" size="420px" :title="$t('account.addNewAccount')">
    <IrProgress :total="steps.length" :elapsed="activeStepIndex" class="absolute left-0 right-0 top-0 -translate-y-px" />
    <Transition name="fade" mode="out-in">
      <KeepAlive>
        <component
          :is="activeStep.cmp"
          v-model="activeStep.value"
          :selected-broker
          :has-account="hasAccount"
          @next="nextStep"
          @close="show = false"
          @back="e => step = e"
          @done="handleDone"
        />
      </KeepAlive>
    </Transition>
  </IrModal>
</template>
