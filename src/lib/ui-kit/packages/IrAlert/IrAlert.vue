<script setup>
import { computed } from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'lg'].includes(value),
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'warning', 'info'].includes(value),
  },
  icon: {
    type: String,
    default: '',
  },
})

const classes = computed(() => [
  'ir-alert',
  `ir-alert--${props.size}`,
  `ir-alert--${props.color}`,
])
</script>

<template>
  <div :class="classes">
    <template v-if="size === 'sm'">
      <div class="ir-alert__inline">
        <IrIcon v-if="icon" :name="icon" class="ir-alert__icon" />

        <div class="ir-alert__content">
          <p v-if="description" class="ir-alert__text">{{ description }}</p>
          <slot />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="ir-alert__header">
        <IrIcon :name="icon" class="ir-alert__icon" />
        <h4 class="ir-alert__title">{{ title }}</h4>
      </div>

      <p class="ir-alert__text">{{ description }}</p>

      <div class="ir-alert__button">
        <slot />
      </div>
    </template>
  </div>
</template>

<style lang="scss" src="./IrAlert.scss" />
