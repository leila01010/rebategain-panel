<script setup>
import { IrIcon } from '@/lib/ui-kit'
import { ref, computed, watch, onBeforeUnmount, onMounted, useAttrs } from 'vue'
import { popupManager } from '@/lib/ui-kit/src/utils/popup-manager'
import { useDevice } from '@/composables/useDevice.js'

const props = defineProps({
  title: { type: String, default: null },
  subtitle: { type: String, default: null },
  hideBackground: { type: Boolean, default: true },
  show: { type: Boolean, default: false },
  size: { type: String, default: 'md' }, // xs, sm, md, lg, xl or 600px
  loading: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  fullScreen: {
    type: [Boolean, String],
    default: 'phone',
    validator: (value) => [true, false, 'phone', 'desktop'].includes(value),
  },
  hasPopstate: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
  backIcon: { type: String, default: 'arrow-right' },
  closeIcon: { type: String, default: 'close' },
  showHeader: { type: Boolean, default: undefined },
  headerClass: { type: [Object, Array, String], default: null },
  bodyClass: { type: [Object, Array, String], default: null },
  footerClass: { type: [Object, Array, String], default: null },
  hasBlur: { type: Boolean, default: false },
  isCenter: { type: Boolean, default: false },
  lockScroll: { type: Boolean, default: true },
  noClose: { type: Boolean, default: false },
  zIndex: { type: Number, default: null },
})

const emit = defineEmits(['close', 'update:show', 'body-scroll'])
const slots = defineSlots()
const $attrs = useAttrs()
const { isPhone } = useDevice()

const elRef = ref(null)
const localZIndex = ref(0)
const placeholder = ref(null)
const isVisible = ref(false)
const isShaking = ref(false)
const clickPosition = ref({})

const uid = computed(() => {
  return Math.random().toString(36)
})

const dialogSizeAttr = computed(() => {
  if (isFullScreen.value) return
  if (['xs', 'sm', 'md', 'lg', 'xl'].includes(props.size)) {
    return { class: `ir-modal__dialog--size-${props.size}` }
  }
  return { style: { maxWidth: props.size, width: props.size ? '100%' : 'auto' } }
})

const hasHeader = computed(() => {
  return !props.plain && !!(slots.header || props.title || props.showHeader)
})

const hasFooter = computed(() => {
  return !props.plain && !!slots.footer
})

const isFullScreen = computed(() => {
  return (
    props.fullScreen === true ||
    (props.fullScreen === 'phone' && isPhone.value) ||
    (props.fullScreen === 'desktop' && !isPhone.value)
  )
})

const modalClass = computed(() => [
  `ir-modal--size-${props.size}`,
  {
    'ir-modal--plain': props.plain,
    'ir-modal--has-blur': props.hasBlur,
    'ir-modal--has-header': hasHeader.value,
    'ir-modal--has-footer': hasFooter.value,
    'ir-modal--full-screen': isFullScreen.value,
    'ir-modal--center': props.isCenter,
  },
])

const isTopElement = computed(() => {
  return isVisible.value && popupManager.topElement === elRef.value
})

watch(isVisible, (isVisible) => {
  if (props.show !== isVisible) emit('update:show', isVisible)

  if (isVisible) {
    pushState()
    setZIndex()
  } else {
    onClose()
  }

  popupManager.setTopElement(elRef.value, isVisible)

  if (props.lockScroll) popupManager.setBodyOverflow()
})

watch(() => props.show, (val) => {
  isVisible.value = !!val
  if (!window) return
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('popstate', onPopstate)
})

onMounted(() => {
  isVisible.value = props.show
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('popstate', onPopstate)
})
onBeforeUnmount(() => {
  isVisible.value = false
  popupManager.destroyElement(elRef.value)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('popstate', onPopstate)
})

function onPopstate(event) {
  const shouldClose = !event.state || (event.state && event.state.irModalVmId !== uid.value)

  if (!isTopElement.value || !shouldClose) return

  if (canBeClosed('backdrop')) {
    close('backdrop')
  } else {
    pushState()
  }
}

function pushState() {
  if (props.hasPopstate && history) history.pushState({ irModalVmId: uid.value }, null, null)
}

function setZIndex() {
  localZIndex.value = props.zIndex ? props.zIndex : popupManager.getNewZIndex()
}

function onClose() {
  if (isVisible.value || !history || !props.hasPopstate) return
  if (history.state && history.state.irModalVmId === uid.value) history.back()
}

function onKeydown(e) {
  if (e.keyCode === 27) close()
}
function onMouseDown({ x, y }) {
  clickPosition.value = { x, y }
}
function onMouseMove() {
  clickPosition.value = { x: 0, y: 0 }
}

function close(fromEl) {
  if (!canBeClosed(fromEl)) return shake()
  isVisible.value = false
  emit('close', this)
}

function canBeClosed(fromEl) {
  return !(
    props.noClose ||
    (fromEl === 'backdrop' && !props.closeOnBackdrop)
  )
}

function shake() {
  isShaking.value = true
  setTimeout(() => (isShaking.value = false), 100)
}

function getWrapperAttributes() {
  const attrs = { ...$attrs }
  const placeholderEl = placeholder.value || {}
  Array.from(placeholderEl.attributes || []).forEach((attr) => {
    if (attr.nodeName !== 'class') attrs[attr.nodeName] = attr.nodeValue
  })
  return attrs
}

function onBodyScroll(e) {
  emit('body-scroll', e)
}
</script>

<template>
  <div ref="elRef" class="ir-modal__placeholder">
    <Teleport to="body">
      <div
        ref="modal"
        class="ir-modal"
        :class="modalClass"
        :style="{ zIndex: localZIndex }"
        v-bind="getWrapperAttributes()"
      >
        <Transition name="ir-modal-popup" appear>
          <div
            v-if="isVisible"
            v-show="isVisible"
            role="dialog"
            class="ir-modal__wrapper"
          >
            <div
              ref="container"
              class="ir-modal__container"
              @mousedown.self="onMouseDown"
              @touchstart.self="onMouseDown"
              @mousemove.self="onMouseMove"
              @touchmove.self="onMouseMove"

            >
              <div
                ref="dialog"
                class="ir-modal__dialog"
                :class="{ 'ir-modal__dialog--shake': isShaking }"
                v-bind="dialogSizeAttr"
              >
                <div class="ir-modal__content">
                  <header
                    v-if="hasHeader"
                    class="ir-modal__header"
                    :class="headerClass"
                  >
                    <slot name="header-prepend" />
                    <div class="ir-modal__header-text">
                      <slot name="header">
                        <span class="ir-modal__title" v-text="title" />
                        <span v-if="subtitle" class="ir-modal__subtitle" v-text="subtitle" />
                      </slot>
                    </div>
                    <slot name="header-prepend__action" />
                    <IrIcon
                      v-if="showClose"
                      :name="closeIcon"
                      role="button"
                      class="ir-modal__close"
                      @click.prevent="close"
                    />
                    <slot name="header-append" />
                  </header>

                  <div class="ir-modal__body" :class="bodyClass" @scroll="onBodyScroll">
                    <slot />
                  </div>

                  <footer v-if="hasFooter" class="ir-modal__footer" :class="footerClass">
                    <slot name="footer" />
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="ir-modal-fade" appear>
          <div
            v-if="isVisible && !isFullScreen"
            class="ir-modal__backdrop"
            @click="close"
          />
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" src="./IrModal.scss" />
