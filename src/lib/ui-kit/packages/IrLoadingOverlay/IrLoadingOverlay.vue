<template>
  <transition name="fade">
    <div
        v-if="visible"
        :class="[
        fullscreen ? 'fixed inset-0' : 'absolute inset-0',
        'z-30 flex items-center justify-center',
        backdropClass,
        blur ? 'backdrop-blur-sm' : '',
      ]"
    >
      <div class="flex items-center gap-2">
        <slot name="icon">
          <IrIcon name="spinner" size="18" class="text-dark-blue-6 text-2xl" />
        </slot>
        <slot>
          <span v-if="message" class="text-sm text-dark-blue-300" v-text="message" />
        </slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  visible: { type: Boolean, default: true },
  fullscreen: { type: Boolean, default: false },
  message: { type: String, default: '' },
  blur: { type: Boolean, default: false },
  backdropClass: {
    type: String,
    default: 'bg-white/70',
  },
})
</script>
