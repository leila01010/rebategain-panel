<script setup>
import { computed, useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  color: {
    type: String,
    default: 'primary',
    validator: (val) =>
      [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
      ].includes(val),
  },
  variant: {
    type: String,
    default: 'fill',
    validator: (val) => ['fill', 'outline', 'text', 'plain'].includes(val),
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg'].includes(val),
  },
  block: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  url: {
    type: [String, Object],
    default: null,
  },
})

const emits = defineEmits(['click'])

const router = useRouter()

const $attrs = useAttrs()

const classes = computed(() => {
  return [
    'ir-button',
    `ir-button--${props.size}`,
    `ir-button--${props.variant}`,
    `ir-button--${props.variant}--${props.color}`,
    {
      'ir-button--icon': !!props.icon,
      'ir-button--block': props.block,
      'ir-button--loading': props.loading,
    },
  ]
})

const tag = computed(() => {
  return props.url ? 'a' : 'button'
})

const isInternalLink = computed(() => {
  if (!props.url || (typeof props.url === 'string' && /^(http?s|www)/.test(props.url)))
    return false
  const route = router.resolve(props.url)
  return route && route.name !== '404'
})

const attrs = computed(() => {
  const attrs = {}
  if (props.url) attrs.href = props.url
  return {
    ...attrs,
    ...$attrs.value,
  }
})

const onClick = function (event) {
  if (props.loading) event.preventDefault()
  emits('click', event)
  if (props.url) handleUrlClick(event)
}

const handleUrlClick = function (event) {
  if (isInternalLink.value) {
    event.preventDefault()
    router.push(props.url)
  }
}
</script>

<template>
  <component
    :is="tag"
    :type="type"
    :class="classes"
    :disabled="disabled"
    tabindex="1"
    v-bind="attrs"
    @click="onClick"
  >
    <IrIcon v-if="icon" :name="icon" class="ir-button__icon" />
    <div v-else-if="loading && !disabled" class="ir-button__loading">
      <div class="ir-button__loading-spin" />
      <span class="ir-button__loading-text" v-text="$t('common.sending')" />
    </div>
    <template v-else>
      <IrIcon v-if="prependIcon" :name="prependIcon" class="ir-button__prepend-icon" />
      <span v-if="text || $slots.default" class="ir-button__text">
        <slot>{{ text }}</slot>
      </span>
      <IrIcon v-if="appendIcon" :name="appendIcon" class="ir-button__append-icon" />
    </template>
  </component>
</template>

<style lang="css" src="./IrButton.css" />
