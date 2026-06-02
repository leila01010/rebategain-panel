<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  src: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'user',
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(val),
  },
})
</script>

<template>
  <div
    class="ir-avatar"
    :class="[`ir-avatar--${size}`]"
    :style="{ backgroundImage: 'url(' + src + ')' }"
  >
    <slot />
    <slot v-if="!src" name="empty">
      <IrIcon v-if="icon" :name="icon" />
    </slot>
  </div>
</template>

<style lang="css" src="./IrAvatar.css" />
