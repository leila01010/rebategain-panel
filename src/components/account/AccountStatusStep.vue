<script setup>
import { IrRadio, IrRadioGroup, IrButton } from '@/lib/ui-kit'

const emit = defineEmits(['next'])

defineProps({
  selectedBroker: { type: Object, default: null }
})

const selfValue = defineModel({ type: [String, Number], default: null })
</script>

<template>
  <div>
    <IrButton
      :text="$t('common.back')"
      prepend-icon="arrow-left"
      variant="plain"
      class="mb-4"
      @click="emit('back', 'broker')"
    />
    <h4 v-text="$t('account.doYouHaveAccount')" class="text-sm font-bold text-dark-blue-600 mb-2" />
    <i18n-t keypath="account.doYouHaveAccountText" tag="p" class="text-xs text-dark-blue-500 mb-4">
      <template #broker>
        <strong v-if="selectedBroker" class="font-bold">{{ selectedBroker?.title }}</strong>
      </template>
    </i18n-t>
    <IrRadioGroup v-model="selfValue" class="mb-4">
      <IrRadio
        value="yes"
        :label="$t('account.hasAccount')"
        :description="$t('account.hasAccountText')"
      />
      <IrRadio
        value="no"
        :label="$t('account.hasNotAccount')"
        :description="$t('account.hasNotAccountText')"
      />
    </IrRadioGroup>
    <div class="flex justify-end">
      <IrButton
        :text="$t('common.continue')"
        append-icon="arrow-right"
        :disabled="!selfValue"
        @click="emit('next')"
      />
    </div>
  </div>
</template>
