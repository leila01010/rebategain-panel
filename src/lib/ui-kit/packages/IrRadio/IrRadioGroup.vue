<template>
  <div class="ir-radio-group" role="radiogroup">
    <slot />
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'
import { IR_RADIO_GROUP_KEY } from './IrRadioGroupKey'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  name: {
    type: String,
    default: 'ir-radio',
  },
})

const emit = defineEmits(['update:modelValue'])

provide(IR_RADIO_GROUP_KEY, {
  name: computed(() => props.name),
  modelValue: computed(() => props.modelValue),
  select: (value) => emit('update:modelValue', value),
})
</script>

<style scoped>
.ir-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
