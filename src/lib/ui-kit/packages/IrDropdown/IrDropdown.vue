<script setup>
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { IrIcon } from '@/lib/ui-kit'
import { popupManager } from '@/lib/ui-kit/src/utils/popup-manager.js'

const props = defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  minWidth: { type: [String, Number], default: null },
  maxWidth: { type: [String, Number], default: null },
  minHeight: { type: [String, Number], default: null },
  maxHeight: { type: [String, Number], default: '216px' },
  align: {
    type: String,
    default: 'start',
    validator: (v) => ['start', 'end'].includes(v),
  },
  offset: { type: Number, default: 8 },
  viewportPadding: { type: Number, default: 8 },
})

const isOpen = ref(false)
const zIndex = ref(null)

const triggerRef = ref(null)
const menuRef = ref(null)

const position = ref({
  top: 0,
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
  zIndex: zIndex.value,
}))

const getDirection = () =>
  document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr'

const updatePosition = () => {
  if (!triggerRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const viewportWidth = document.documentElement.clientWidth
  const padding = props.viewportPadding
  const dir = getDirection()

  const menuWidth = menuRef.value?.offsetWidth ?? triggerRect.width

  const anchorEnd =
    (props.align === 'end' && dir === 'ltr') ||
    (props.align === 'start' && dir === 'rtl')

  let left = anchorEnd
    ? triggerRect.right - menuWidth
    : triggerRect.left

  const maxLeft = viewportWidth - menuWidth - padding
  if (left > maxLeft) left = maxLeft
  if (left < padding) left = padding

  position.value = {
    top: triggerRect.bottom + window.scrollY + props.offset,
    left: left + window.scrollX,
    width: triggerRect.width,
  }
}

const open = async () => {
  zIndex.value = popupManager.getNewZIndex()
  isOpen.value = true

  await nextTick()

  updatePosition()
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

<template>
  <div
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

<style lang="scss" scoped src="./IrDropdown.scss" />
