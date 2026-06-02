<script setup>
import { computed } from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  text: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['md', 'lg', 'sm'].includes(val),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'success', 'danger', 'warning', 'info'].includes(val),
  },
  prependIcon: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
})

const chipClasses = computed(() =>
  [
    'ir-chip',
    `ir-chip--${props.size}`,
    `ir-chip--${props.color}`,
  ]
)
</script>

<template>
  <div :class="chipClasses">
    <div
      v-if="$slots.prepend || prependIcon"
      class="ir-chip__prepend"
    >
      <slot name="prepend">
        <IrIcon v-if="prependIcon" :name="prependIcon" />
      </slot>
    </div>
    <span class="ir-chip__text">
      <slot>{{ text }}</slot>
    </span>
    <div
      v-if="$slots.append || appendIcon"
      class="ir-chip__append"
    >
      <slot name="append">
        <IrIcon v-if="appendIcon" :name="appendIcon" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss" src="./IrChip.scss" />
