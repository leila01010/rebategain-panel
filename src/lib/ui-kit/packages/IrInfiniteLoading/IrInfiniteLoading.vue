<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: false,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },

  loadingText: {
    type: String,
    default: null,
  },

  wrapperClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['load-more'])

const elRef = ref(null)
let observer = null

function onIntersect(entries) {
  if (props.isLoading || props.isDisabled) return
  entries.forEach((entry) => {
    if (entry.isIntersecting) emit('load-more')
  })
}

function init() {
  if (observer || !elRef.value) return
  observer = new IntersectionObserver(onIntersect, { rootMargin: '200px' })
  observer.observe(elRef.value)
}

watch(() => props.isLoading, (loading) => {
  if (loading || !observer || !elRef.value || props.isDisabled) return
  observer.unobserve(elRef.value)
  observer.observe(elRef.value)
})

onMounted(init)
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="elRef" class="ir-infinite-loading" :class="wrapperClass">
    <slot />
    <slot v-if="!isDisabled" name="loading">
      <IrIcon name="loading" :size="16" class="ir-infinite-loading__icon" />
      <span v-if="loadingText" v-text="loadingText" class="ir-infinite-loading__text" />
    </slot>
  </div>
</template>

<style scoped lang="scss">
.ir-infinite-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;

  &__text {
    font-size: 14px;
    color: var(--color-dark-blue-300);
  }
}
</style>
