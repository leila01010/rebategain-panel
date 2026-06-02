<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  type: { type: String, default: '' },
  name: { type: String, default: '' },
  size: { type: String, default: 'md', validator: (val) => ['md', 'lg'].includes(val) },
  label: { type: [String, Boolean], default: '' },
  prefixIcon: { type: String, default: '' },
  suffixIcon: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  wrapperClass: { type: String, default: '' },
  inputClass: { type: String, default: '' },
  error: { type: String, default: '' },
  helperText: { type: String, default: '' },
  ltr: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  labelClass: { type: String, default: '' },
  id: { type: String, default: '' },
  tabindex: { type: String, default: '1' },
  autoFocus: { type: Boolean, default: false },
  autoSize: { type: Boolean, default: false },
  textCenter: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  maxRows: { type: Number, default: 12 },
  maxlength: { type: Number, default: null },
  hasSuccess: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  number: { type: Boolean, default: false },
})

const emit = defineEmits(['focus', 'blur', 'input'])

const $attrs = useAttrs()

const inputRef = ref(null)
const input = ref(null)
const selfValue = defineModel({ type: [String, Number, Array, Object], default: '' })
const focused = ref(false)
const isPasswordShown = ref(false)

const cid = computed(() => {
  return props.id || 'ir-input_' + Math.random().toString(36).substring(2)
})
const listeners = computed(() => {
  return {
    focus: onFocus,
    blur: onBlur,
  }
})
const isDisabled = computed(() => {
  return props.disabled || props.loading
})
const attrs = computed(() => {
  const attrs = {
    ...$attrs,
    id: cid.value,
    name: props.name,
    tabindex: props.tabindex,
    readonly: props.readonly,
    disabled: isDisabled.value,
    maxlength: props.maxlength,
    placeholder: props.placeholder,
    class: ['ir-input__input', props.inputClass],
    type: isPasswordShown.value ? 'text' : props.type,
  }
  if (props.type === 'textarea') delete attrs.type
  if (props.number) attrs.inputmode = 'numeric'
  return attrs
})
const isEmpty = computed(() => {
  return selfValue.value === ''
})
const valueLength = computed(() => {
  return selfValue.value?.toString().length
})
const hasMaxLengthError = computed(() => {
  return valueLength.value >= props.maxlength
})
const baseInputClass = computed(() => {
  return [
    `ir-input--${props.size}`,
    {
      'ir-input--ltr': props.ltr,
      'ir-input--empty': isEmpty.value,
      'ir-input--outline': props.outline,
      'ir-input--focused': focused.value,
      'ir-input--has-error': props.error,
      'ir-input--has-success': props.hasSuccess,
      'ir-input--text-center': props.textCenter,
      'ir-input--maxlength-error': hasMaxLengthError.value,
      'ir-input--disabled': isDisabled.value,
      'ir-input--readonly': props.readonly,
      'ir-input--block': props.block,
    },
  ]
})

watch(() => props.autoFocus, (val) => {
  if (val) focus()
}, { immediate: true })

watch(selfValue, () => {
  if (props.number && selfValue.value != null) {
    const digits = String(selfValue.value).replace(/\D/g, '')
    if (digits !== String(selfValue.value)) {
      selfValue.value = digits
      return
    }
  }
  emit('input', selfValue.value)
  setInputHeight()

}, { immediate: true })

function onFocus(e) {
  if (props.disabled) {
    return e?.preventDefault()
  }
  focused.value = true
  emit('focus', e)
  setTimeout(() => {
    input.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 300)
}
function onBlur(e) {
  focused.value = false
  emit('blur', e)
}
function focus() {
  nextTick(() => {
    if (input.value) input.value.focus()
  })
}

function setInputHeight() {
  if (!props.autoSize || props.type !== 'textarea') return

  this.$nextTick(() => {
    const input = input.value
    const lines = input.value.split('\n').length
    input.style.height = '0'
    input.style.height = input.scrollHeight + 'px'
    const lineHeight = input.scrollHeight / lines
    input.style.maxHeight = props.maxRows * lineHeight + 'px'
  })
}

defineExpose({
  inputRef,
})
</script>

<template>
  <div ref="inputRef" class="ir-input" :class="baseInputClass" :data-type="type">
    <label
      v-if="label"
      ref="label"
      :for="cid"
      class="ir-input__label"
      :class="labelClass"
      @click.prevent="focus"
      v-text="label"
    />
    <div class="ir-input__wrapper">
      <div v-if="$slots.prepend" class="ir-input__prepend">
        <slot name="prepend" />
      </div>
      <div class="ir-input__inner" :class="wrapperClass">
        <div v-if="prefixIcon || $slots.prefix" class="ir-input__prefix">
          <slot name="prefix">
            <IrIcon :name="prefixIcon" />
          </slot>
        </div>

        <input ref="input" v-model="selfValue" v-bind="attrs" v-on="listeners">

        <div
          v-if="type === 'password'"
          class="ir-input__suffix"
          @click.stop="isPasswordShown = !isPasswordShown"
        >
          <slot name="suffix">
            <IrIcon v-if="selfValue" :name="isPasswordShown ? 'eye-slash' : 'eye'" />
          </slot>
        </div>

        <div v-else-if="suffixIcon || $slots.suffix" class="ir-input__suffix">
          <slot name="suffix">
            <IrIcon :name="suffixIcon" />
          </slot>
        </div>
      </div>
      <div v-if="$slots.append" class="ir-input__append">
        <slot name="append" />
      </div>
    </div>
    <p v-if="error" class="ir-input__error" v-text="error" />
    <p v-else-if="helperText" class="ir-input__helper-text" v-text="helperText" />
  </div>
</template>

<style lang="scss" src="./IrInput.scss" />
