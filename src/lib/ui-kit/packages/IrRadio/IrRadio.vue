<template>
  <label
    class="ir-radio-card"
    :class="{
      'ir-radio-card--selected': isSelected,
      'ir-radio-card--disabled': disabled,
    }"
  >
    <input
      class="ir-radio-card__input"
      type="radio"
      :name="group.name.value"
      :value="value"
      :checked="isSelected"
      :disabled="disabled"
      @change="group.select(value)"
    />

    <span class="ir-radio-card__indicator">
      <span class="ir-radio-card__dot" />
    </span>

    <span class="ir-radio-card__body">
      <span class="ir-radio-card__title">{{ label }}</span>
      <span v-if="description" class="ir-radio-card__description">{{ description }}</span>
    </span>

    <span v-if="$slots.trailing" class="ir-radio-card__trailing">
      <slot name="trailing" />
    </span>
  </label>
</template>

<script setup>
import { inject, computed } from 'vue'
import { IR_RADIO_GROUP_KEY } from './IrRadioGroupKey'

const props = defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const group = inject(IR_RADIO_GROUP_KEY)

const isSelected = computed(() => group.modelValue.value === props.value)
</script>

<style lang="scss" src="./IrRadio.scss" />
