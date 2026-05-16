<template>
  <div
    ref="dropdownRef"
    class="ir-dropdown"
    :class="{
      'ir-dropdown--open': isOpen,
      'ir-dropdown--disabled': disabled,
    }"
  >
    <button
      ref="triggerRef"
      type="button"
      class="ir-dropdown__trigger"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="toggle"
    >
      <slot name="trigger">
        <span class="ir-dropdown__label">{{ label }}</span>
      </slot>
      <IrIcon
        name="arrow-down"
        class="ir-dropdown__icon"
        :class="{ 'ir-dropdown__icon--rotated': isOpen }"
      />
    </button>

    <Teleport to="body">
      <transition name="ir-dropdown-fade">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="ir-dropdown__menu"
          :style="menuStyles"
        >
          <slot name="content" :close="close" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  minWidth: { type: [String, Number], default: null },
  maxWidth: { type: [String, Number], default: null },
  minHeight: { type: [String, Number], default: null },
  maxHeight: { type: [String, Number], default: '300px' },
})

const isOpen = ref(false)

const dropdownRef = ref(null)
const triggerRef = ref(null)
const menuRef = ref(null)

const position = ref({
  top: 0,
  right: 0,
  left: 0,
  width: 0,
})

const addUnit = (value) => {
  if (value === null || value === undefined) return

  return typeof value === 'number' ? `${value}px` : value
}

const menuStyles = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: addUnit(props.minWidth) || `${position.value.width}px`,
  maxWidth: addUnit(props.maxWidth) || `${position.value.width}px`,
  minHeight: addUnit(props.minHeight),
  maxHeight: addUnit(props.maxHeight),
  overflowY: 'auto',
}))

const updatePosition = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  position.value = {
    top: rect.bottom + window.scrollY + 8,
    left: rect.left + window.scrollX,
    width: rect.width,
  }
}

const open = async () => {
  isOpen.value = true

  await nextTick()

  updatePosition()
}

const close = () => {
  isOpen.value = false
}

const toggle = async () => {
  if (isOpen.value) {
    close()
    return
  }

  await open()
}

const handleClickOutside = (event) => {
  const target = event.target

  const clickedTrigger = triggerRef.value?.contains(target)

  const clickedMenu = menuRef.value?.contains(target)

  if (!clickedTrigger && !clickedMenu) {
    close()
  }
}

const handleResize = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  window.addEventListener('resize', handleResize)

  window.addEventListener('scroll', handleResize, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)

  window.removeEventListener('resize', handleResize)

  window.removeEventListener('scroll', handleResize, true)
})

defineExpose({
  open,
  close,
  toggle,
})
</script>

<style lang="scss" src="./IrDropdown.scss" />
