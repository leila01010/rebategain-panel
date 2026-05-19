<template>
  <label class="ir-checkbox" :class="wrapperClass">
    <input type="checkbox" :disabled="disabled" @change="onClick">
    <span v-if="labelRight" class="ir-checkbox__label" v-text="labelRight" />
    <span class="ir-checkbox__input" />
    <span v-if="labelLeft" class="ir-checkbox__label" v-text="labelLeft" />
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Boolean],
    default: '',
  },
  value: {
    type: [String, Number, Boolean],
    default: true,
  },
  uncheckedValue: {
    type: [String, Number, Boolean],
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelLeft: {
    type: String,
    default: '',
  },
  labelRight: {
    type: String,
    default: '',
  },
  tips: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  color: {
    type: String,
    default: 'white',
    validator: (v) => ['gray', 'white'].includes(v),
  },
  isRounded: {
    type: Boolean,
    default: false,
  },
  isLeft: {
    type: Boolean,
    default: false,
  },
  isHalfRounded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:model-value'])

const wrapperClass = computed(() => {
  return [
    `ir-checkbox--${props.size}`,
    `ir-checkbox--${props.color}`,
    {
      'ir-checkbox--rounded': props.isRounded,
      'ir-checkbox--half-rounded': props.isHalfRounded,
      'ir-checkbox--checked': isChecked.value,
      'ir-checkbox--disabled': props.disabled,
    },
  ]
})
const isArray = computed(() => {
  return Array.isArray(props.modelValue)
})
const isChecked = computed(() => {
  return isArray.value ? props.modelValue.includes(props.value) : props.modelValue === props.value
})

function onClick() {
  if (props.disabled) return
  if (isArray.value) {
    const modelValue = props.modelValue.filter((item) => item !== props.value)
    emit('update:model-value', isChecked.value ? modelValue : [...modelValue, props.value])
  } else {
    emit('update:model-value', isChecked.value ? props.uncheckedValue : props.value)
  }
}
</script>

<style lang="css" src="./IrCheckbox.css" />
