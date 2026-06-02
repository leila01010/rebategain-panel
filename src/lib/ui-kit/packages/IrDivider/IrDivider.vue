<template>
  <div :class="dividerClasses">
    <span v-if="$slots.default" class="ir-divider__label">
      <slot />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val),
  },
  align: {
    type: String,
    default: 'center',
    validator: (val) => ['start', 'center', 'end'].includes(val),
  },
})

const dividerClasses = computed(() => {
  return [
    'ir-divider',
    `ir-divider--${props.orientation}`,
    `ir-divider--${props.align}`,
  ]
})
</script>

<style>
.ir-divider {
  background-color: var(--color-dark-blue-50);
}

.ir-divider--vertical {
  width: 1px;
  height: 100%;
}

.ir-divider--horizontal {
  width: 100%;
  height: 1px;
  position: relative;
  margin-top: 16px;
  margin-bottom: 16px;
}

.ir-divider--horizontal .ir-divider__label {
  position: absolute;
  background: white;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.ir-divider--start .ir-divider__label {
  left: 0;
  transform: translateY(-50%);
}

.ir-divider--center .ir-divider__label {
  left: 50%;
  transform: translate(-50%, -50%);
}

.ir-divider--end .ir-divider__label {
  right: 0;
  transform: translateY(-50%);
}
</style>
