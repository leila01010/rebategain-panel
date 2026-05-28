<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  modelValue: { type: String, default: 'personal' },
})

defineEmits(['update:modelValue'])

const TABS = [
  { id: 'personal', labelKey: 'profile.tabs.personalInformation', icon: 'user', disabled: false },
  { id: 'security', labelKey: 'profile.tabs.security', icon: 'lock' },
]
</script>

<template>
  <div class="profile-tabs" role="tablist">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      type="button"
      role="tab"
      class="profile-tabs__tab"
      :class="{
        'profile-tabs__tab--active': modelValue === tab.id,
        'profile-tabs__tab--disabled': tab.disabled,
      }"
      :disabled="tab.disabled"
      :aria-selected="modelValue === tab.id"
      @click="!tab.disabled && $emit('update:modelValue', tab.id)"
    >
      <IrIcon :name="tab.icon" :size="12" />
      <span>{{ $t(tab.labelKey) }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.profile-tabs {
  display: flex;
  align-items: center;
  background-color: var(--color-blue-20);
  border-radius: 12px;
  padding: 8px;
  border: 1px solid var(--color-dark-blue-50);
  gap: 4px;

  &__tab {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 12px;
    white-space: nowrap;
    color: var(--color-dark-blue-400);
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;

    &--active {
      background-color: #ffffff;
      color: var(--color-dark-blue-600);
      border: 1px solid var(--color-dark-blue-50);
    }

    &--disabled {
      cursor: not-allowed;
      color: var(--color-dark-blue-200, #b6bfd1);
    }
  }
  @media (max-width: 767px) {
    margin: 0 -16px;
    border-radius: 0;
  }
}
</style>
