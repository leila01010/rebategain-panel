<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  loading: { type: Boolean, default: false },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="center-wrapper">
    <div class="loading-state">
      <IrIcon name="loading" :size="50" class="loading-state__icon" />

      <h3 class="loading-state__title" v-text="$t('common.loadingText')" />
    </div>
  </div>
</template>

<style lang="scss">
.loading-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    margin-bottom: 16px;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-dark-blue-400);
  }
}
</style>
