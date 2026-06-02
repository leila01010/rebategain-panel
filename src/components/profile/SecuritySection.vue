<script setup>
import { IrCard, IrIcon, IrButton } from '@/lib/ui-kit'
import { useDevice } from '@/composables/useDevice.js'

const { isPhone } = useDevice()
</script>

<template>
  <IrCard class="-mx-4 !rounded-none md:m-auto md:!rounded-2xl" body-class="!p-4 md:!p-8">
    <template #header v-if="!isPhone">
      <div class="flex items-center gap-2">
        <IrIcon name="lock" :size="16" />
        <span class="text-base text-dark-blue-600 font-bold">{{ $t('profile.passwordManagement') }}</span>
      </div>
    </template>

    <div class="flex flex-col md:flex-row items-end md:items-start gap-x-2 gap-y-4">
      <div class="grow">
        <h6 class="text-xs text-dark-blue-500 font-bold mb-1" v-text="$t('profile.password')" />
        <p class="text-xs text-dark-blue-500 leading-[18px]" v-text="$t('profile.updatePasswordText')" />
      </div>
      <IrButton
        :text="$t('profile.changePassword')"
        variant="outline"
        color="secondary"
        size="sm"
        append-icon="edit-two"
      />
    </div>
  </IrCard>
</template>

<style>
</style>
