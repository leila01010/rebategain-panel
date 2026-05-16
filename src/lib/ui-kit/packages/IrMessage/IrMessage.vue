<template>
  <div class="ir-messages-holder" role="region" aria-label="Notifications">
    <TransitionGroup name="ir-message" tag="ul" class="ir-messages">
      <li
        v-for="item in messages"
        :key="item.id"
        :class="['ir-message', `ir-message--${item.type}`]"
        :role="item.type === 'error' ? 'alert' : 'status'"
        :aria-live="item.type === 'error' ? 'assertive' : 'polite'"
        aria-atomic="true"
      >
        <span class="ir-message__stripe" aria-hidden="true" />

        <span class="ir-message__text">{{ item.text }}</span>

        <button
          class="ir-message__close"
          aria-label="Dismiss notification"
          @click="$emit('dismiss', item.id)"
        >
          <IrIcon name="close-circle" />
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { IrIcon } from '@/lib/ui-kit'

defineProps({
  messages: { type: Array, default: () => [] },
})

defineEmits(['dismiss'])
</script>

<style lang="scss" src="./IrMessage.scss" />
