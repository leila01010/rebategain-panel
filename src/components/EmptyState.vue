<script setup>
import { IrButton, IrIcon } from '@/lib/ui-kit'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  buttonText: { type: String, default: '' },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <IrIcon :name="icon" size="48" />
    </div>

    <h3 class="empty-state__title">{{ title }}</h3>

    <p class="empty-state__description">{{ description }}</p>

    <IrButton
      :text="buttonText"
      prepend-icon="plus"
      size="lg"
      class="empty-state__button"
      @click="emit('action')"
    />
  </div>
</template>

<style lang="scss">
.empty-state {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
  border-radius: 16px;
  background-color: #fff;
  border: 2px dashed var(--color-dark-blue-50);

  &__icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--color-blue-50);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  &__icon svg {
    color: var(--color-primary);
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-dark-blue-800);
    margin-bottom: 16px;
  }

  &__description {
    font-size: 12px;
    color: var(--color-dark-blue-300);
    margin-bottom: 32px;
  }
}
</style>
