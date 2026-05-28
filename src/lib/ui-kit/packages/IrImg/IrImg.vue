<script setup>
import { computed, ref } from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  imgClass: {
    type: [String, Object, Array],
    default: '',
  },
  width: {
    type: [String, Number],
    default: null,
  },
  height: {
    type: [String, Number],
    default: null,
  },
  minWidth: {
    type: [String, Number],
    default: null,
  },
  minHeight: {
    type: [String, Number],
    default: null,
  },
  maxWidth: {
    type: [String, Number],
    default: null,
  },
  maxHeight: {
    type: [String, Number],
    default: null,
  },
  objectFit: {
    type: String,
    default: null,
    validator: (value) =>
      [
        'none',
        'fill',
        'cover',
        'unset',
        'revert',
        'contain',
        'initial',
        'inherit',
        'scale-down',
      ].includes(value),
  },
})

const loading = ref(false)

const imgStyle = computed(() => {
  const style = { objectFit: props.objectFit }
  const keys = ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight']
  return keys.reduce((styles, styleKey) => {
    const value = props[styleKey]
    if (value !== null && value !== '') {
      styles[styleKey] = isNaN(+value) ? value : `${value}px`
    }
    return styles
  }, style)
})

function onError(e) {
  // loading.value = false
  // e.target.src = 'img/image-error-169.svg'
}

function onLoad() {
  loading.value = false
}
</script>

<template>
  <div class="ir-img">
    <IrIcon v-if="loading" name="spinner" class="ir-img__loading" />
    <img
      class="ir-img__image"
      :src="src"
      :alt="alt"
      :class="imgClass"
      :style="imgStyle"
      @error="onError"
      @load="onLoad"
    />
  </div>
</template>

<style lang="scss">
.ir-img {
  position: relative;
  &__loading {
    font-size: 40px;
    margin: auto;
    display: block;
    text-align: center;
  }
  &__image {
    width: 100%;
    height: 100%;
  }
}
</style>
