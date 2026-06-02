<script setup>
import { IrModal } from '@/lib/ui-kit'
import WithdrawForm from '@/components/withdraw/WithdrawForm.vue'

const show = defineModel('show', { type: Boolean, default: false })

const emit = defineEmits(['done'])
</script>

<template>
  <IrModal
    v-model:show="show"
    size="420px"
    :title="$t('withdraw.addNewWithdraw')"
  >
    <WithdrawForm @done="emit('done')" />
  </IrModal>
</template>

