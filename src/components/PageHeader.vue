<script setup>
import { IrButton } from '@/lib/ui-kit'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="page-header">
    <div class="page-header__content">
      <div class="page-header__title">{{ title }}</div>
      <p class="page-header__description">{{ description }}</p>
    </div>
    <div v-if="buttonText || $slots.action" class="page-header__actions">
      <slot name="action">
        <IrButton :text="buttonText" color="secondary" prepend-icon="plus" @click="emit('action')" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-dark-blue-800);
    margin-bottom: 8px;
  }

  &__description {
    font-size: 14px;
    color: var(--color-dark-blue-300);
  }
}
</style>

<style scoped lang="scss">

</style>
