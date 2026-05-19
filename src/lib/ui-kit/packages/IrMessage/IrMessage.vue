<template>
  <div
    class="ir-messages-holder"
    :style="{ zIndex }"
    role="region"
    aria-label="Notifications"
  >
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
import { ref, watch } from 'vue'
import { IrIcon } from '@/lib/ui-kit'
import { popupManager } from '@/lib/ui-kit/src/utils/popup-manager.js'

const props = defineProps({
  messages: { type: Array, default: () => [] },
})

defineEmits(['dismiss'])

const zIndex = ref(null)

// each time a new toast appears, lift the holder above every popup opened so
// far (modals included) — popupManager.getNewZIndex() always returns a value
// higher than the current ceiling.
watch(
  () => props.messages.length,
  (length, prev) => {
    if (length > prev) zIndex.value = popupManager.getNewZIndex()
  },
)
</script>

<style lang="scss" src="./IrMessage.scss" />
