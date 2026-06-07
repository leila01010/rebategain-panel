<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from "vue-i18n"
import { popupManager } from '@/lib/ui-kit/src/utils/popup-manager.js'
import { IrIcon } from '@/lib/ui-kit'

const { t } = useI18n()

const texts = {
  loading: t('uiKit.select.loading'),
  select: t('uiKit.select.select'),
  search: t('uiKit.select.search'),
  noCategory: t('uiKit.select.noCategory'),
  noItemText: t('uiKit.select.noItemText'),
  noResultText: t('uiKit.select.noResultText'),
  nItem: (n) => t('uiKit.select.nItem', [n]),
  andNItem: (n) => t('uiKit.select.andNItem', [n]),
}

const props = defineProps({
  modelValue: { type: [String, Number, Object, Array], default: '' },
  options: { type: Array, default: () => [] },
  nested: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  showCaret: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  valueProp: { type: String, default: 'id' },
  labelProp: { type: String, default: 'title' },
  selectedOptions: { type: Array, default: () => [] },
  dropdownClass: { type: [Array, String, Object], default: '' },
  dropdownMinWidth: { type: String, default: '' },
  size: { type: String, default: 'md', validator: v => ['md', 'lg'].includes(v) },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  caption: { type: String, default: '' },
  maxItemsInText: { type: Number, default: 5 },
  searchPlaceholder: { type: String, default: '' },
  searchMethod: { type: Function, default: null },
  noItemText: { type: String, default: '' },
  noResultText: { type: String, default: '' },
  prependIcon: { type: String, default: '' },
  appendIcon: { type: String, default: '' },
  prependInnerIcon: { type: String, default: '' },
  appendInnerIcon: { type: String, default: '' },
  caretIcon: { type: String, default: 'arrow-down' },
  clearIcon: { type: String, default: 'close' },
  block: { type: Boolean, default: false },
  remote: { type: Boolean, default: false },
  remoteMethod: { type: Function, default: null },
  remoteDebounce: { type: Number, default: 300 },
  loadingText: { type: String, default: '' },
  minSearchLength: { type: Number, default: 0 },
})

const emit = defineEmits([
  'update:modelValue',
  'update:selected-options',
  'open',
  'close',
  'focus',
  'blur',
  'clear',
  'search',
  'remote-search',
  'error',
])

const inputRef = ref(null)
const selectWrapper = ref(null)
const popover = ref(null)
const dropdownItems = ref([])
const touched = ref(false)
const localValue = ref([])
const isOpen = ref(false)
const searchQuery = ref('')
const localOptions = ref([])
const isFocused = ref(false)
const remoteLoading = ref(false)
const debounceTimer = ref(null)

const isRemoteSearch = computed(() => props.remote && props.remoteMethod)

const showLoading = computed(() => props.loading || remoteLoading.value)

const localLoadingText = computed(() => props.loadingText || texts.loading)

const localOptionsRaw = computed(() => {
  return localOptions.value.map(group => {
    const children = group.children.map(opt => {
      opt.selected = isSelected(opt)
      return opt
    })
    return { ...group, children }
  })
})

const localOptionsFlat = computed(() => {
  return localOptionsRaw.value.flatMap(g => g.children)
})

const localOptionsFlatIds = computed(() => localOptionsFlat.value.map(o => o.id))

const localOptionsFiltered = computed(() => {
  let opts = localOptionsRaw.value

  if (!isRemoteSearch.value && props.filterable && searchQuery.value) {
    opts = opts.map(g => ({
      ...g,
      children: g.children.filter(option =>
        props.searchMethod
          ? props.searchMethod(option, searchQuery.value)
          : option.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }))
  }

  opts = opts.filter(g => g.children.length)
  let globalIndex = 0
  opts.forEach(g => {
    g.children.forEach(c => { c.index = globalIndex++ })
  })
  return opts
})

const selected = computed(() => localOptionsFlat.value.filter(isSelected))

const selectedItemsAsText = computed(() => {
  const titles = selected.value.map(i => i[props.labelProp])
  const total = titles.length
  const remaining = total - props.maxItemsInText
  let text = titles.join('، ')
  if (total > props.maxItemsInText + 1) {
    const slice = titles.slice(0, props.maxItemsInText)
    const remText = props.maxItemsInText === 1 ? texts.nItem(remaining) : texts.andNItem(remaining)
    text = slice.join('، ') + remText
  }
  return text
})

const hasSelected = computed(() => selected.value.length)

const selectedItem = computed(() => {
  return hasSelected.value ? selected.value[0] : null
})

const valueJson = computed(() => {
  let v = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  v = v.filter(val => val != null && val !== '').sort((a, b) => a - b)
  return JSON.stringify(v)
})

const localValueJson = computed(() => JSON.stringify([...localValue.value].sort((a, b) => a - b)))

const displayValue = computed(() => {
  if (props.filterable && isOpen.value) {
    return searchQuery.value
  }
  return hasSelected.value ? selectedItemsAsText.value : ''
})

const wrapperClass = computed(() => ({
  'ir-select--open': isOpen.value,
  'ir-select--focused': isFocused.value,
  'ir-select--single': !props.multiple,
  'ir-select--multiple': props.multiple,
  'ir-select--disabled': props.disabled,
  'ir-select--clearable': props.clearable,
  'ir-select--selected': hasSelected.value,
  'ir-select--filterable': props.filterable,
  'ir-select--error': !!props.error,
  'ir-select--block': props.block,
  [`ir-select--${props.size}`]: true,
}))

watch(valueJson, (newVal) => {
  if (newVal !== localValueJson.value) localValue.value = JSON.parse(newVal)
  nextTick(validateValue)
}, { immediate: true })

watch(localValueJson, newVal => {
  if (touched.value && valueJson.value !== newVal) {
    const value = props.multiple ? JSON.parse(newVal) : Array.isArray(localValue.value[0]) ? localValue.value : localValue.value[0]
    emit('update:modelValue', value)
    emit('update:selected-options', selected.value)
  }
  nextTick(setPopoverPosition)
})

watch(() => props.options, (options) => {
  setOptions(options)
}, { immediate: true })

watch(searchQuery, (val) => {
  emit('search', val)
})

watch(isOpen, open => {
  touched.value = true
  if (open) {
    if (props.disabled) return close()
    nextTick(() => {
      appendPopoverEl()
      setPopoverPosition(true)
      scrollSelectedItemToCenter()
      dispatchEventOnOpen()
      emit('open')
    })
  } else {
    searchQuery.value = ''
    nextTick(() => {
      removePopoverEl()
      emit('close')
    })
  }
})

watch(localOptionsFiltered, () => nextTick(setPopoverPosition))

onMounted(() => {
  setGlobalEvents()
})

onBeforeUnmount(() => {
  if (debounceTimer.value)
    clearTimeout(debounceTimer.value)
  window.removeEventListener('click', onClick)
  window.removeEventListener('resize', setPopoverPosition)
  document.removeEventListener('ir-select-open', onOpen, true)
  window.removeEventListener('scroll', setPopoverPosition, true)
  removePopoverEl()
})

function open() {
  if (!props.disabled && !isOpen.value)
    isOpen.value = true
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
}

function toggle() {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

function clear() {
  localValue.value = []
  emit('clear')
  close()
}

function onInputFocus() {
  isFocused.value = true
  emit('focus')
}

function onInputBlur() {
  isFocused.value = false
  emit('blur')
}

function isSelected(item) {
  const id = typeof item === 'object' ? item.id : item
  return localValue.value?.includes(id)
}

function onOptionClick(option) {
  if (option.disabled) return
  if (props.multiple) {
    if (isSelected(option)) deleteItem(option)
    else localValue.value.push(option.id)
  } else {
    localValue.value = [option.id]
    close()
  }
}

function deleteItem(option) {
  const id = typeof option === 'object' ? option.id : option
  localValue.value = localValue.value.filter(i => i !== id)
}

function validateValue() {
  if (!touched.value) return
  const invalid = localValue.value.filter(v => !localOptionsFlatIds.value?.includes(v))
  if (invalid.length) localValue.value = localValue.value.filter(v => localOptionsFlatIds.value?.includes(v))
}

function setOptions(optArray) {
  let opts = optArray || []
  const nestedGroup = opts.find(o => Array.isArray(o.children))
  if (!nestedGroup) opts = [{ id: Date.now(), title: null, children: opts }]
  localOptions.value = opts.map(group => ({
    children: (group.children || []).map(o => ({ ...o, id: o[props.valueProp], title: o[props.labelProp] })),
    id: group.id || Math.random(),
    title: group.title || texts.noCategory
  }))
}

function setPopoverPosition(changeSide = false) {
  if (!isOpen.value) return
  const wrapper = selectWrapper.value?.querySelector('.ir-select__control')
  const popoverEl = popover.value
  if (!wrapper || !popoverEl) return

  const rect = wrapper.getBoundingClientRect()
  const popoverHeight = popoverEl.offsetHeight
  const top = rect.top + wrapper.offsetHeight + 4

  let showOnTop
  if (changeSide === true) {

    showOnTop = top + popoverHeight > window.innerHeight
  } else {
    showOnTop = !!+popoverEl.dataset.showOnTop
  }

  if (showOnTop) {
    popoverEl.style.top = rect.top - popoverHeight - 4 + 'px'
  } else {
    popoverEl.style.top = top + 'px'
  }

  popoverEl.dataset.showOnTop = showOnTop ? '1' : '0'
  popoverEl.classList.toggle('on-top', !!showOnTop)
  popoverEl.style.left = rect.left + 'px'
  popoverEl.style.width = wrapper.offsetWidth + 'px'
  popoverEl.style.zIndex = popupManager.getNewZIndex()
}

function setGlobalEvents() {
  window.addEventListener('click', onClick)
  window.addEventListener('resize', setPopoverPosition)
  window.addEventListener('scroll', setPopoverPosition, true)
  document.addEventListener('ir-select-open', onOpen, true)
}

function onOpen(e) {
  if (e.detail !== selectWrapper.value) close()
}

function onClick(event) {
  const wrapper = selectWrapper.value
  const popoverEl = popover.value
  const path = event.composedPath?.() || []
  const clickedOnWrapper = wrapper && wrapper.contains(event.target)
  const clickedOnPopover = popoverEl && path?.includes(popoverEl)
  if (!clickedOnWrapper && !clickedOnPopover) close()
}

function scrollSelectedItemToCenter() {
  nextTick(() => {
    const sel = popover.value?.querySelector('.selected')
    sel?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  })
}

function dispatchEventOnOpen() {
  document.dispatchEvent(new CustomEvent('ir-select-open', { detail: selectWrapper.value }))
}

function appendPopoverEl() {
  if (popover.value) document.body.appendChild(popover.value)
}

function removePopoverEl() {
  if (popover.value?.parentNode) popover.value.parentNode.removeChild(popover.value)
}

function onInputChange(event) {
  const value = event.target.value
  searchQuery.value = value

  if (isRemoteSearch.value) {
    debounceSearch(value)
  }
}

function onClearClick(event) {
  event.stopPropagation()
  clear()
}

function focusToItem(index) {
  const items = dropdownItems.value || []
  let item = items[index]
  if (props.filterable) {
    if (index === -1 || index === items.length) item = inputRef.value
  } else {
    if (index === items.length) item = items[0]
    else if (index < 0) index = Infinity
  }
  if (index === Infinity) item = items[items.length - 1]
  if (item && item.focus) item.focus()
  if (typeof item?.scrollIntoView === 'function')
    nextTick(() => item.scrollIntoView({ block: 'start' }))
}

function onKeyDown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    open()
  } else if (event.key === 'ArrowDown' && !isOpen.value) {
    event.preventDefault()
    open()
  }
}

function debounceSearch(query) {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  if (props.minSearchLength && query.length < props.minSearchLength) {
    return
  }

  debounceTimer.value = setTimeout(() => {
    performRemoteSearch(query)
  }, props.remoteDebounce)
}

async function performRemoteSearch(query) {
  if (!props.remoteMethod) return

  try {
    remoteLoading.value = true
    emit('remote-search', query)

    const results = await props.remoteMethod(query)

    if (Array.isArray(results)) {
      setOptions(results)
    }
  } catch (error) {
    console.error('Remote search error:', error)
    emit('error', error)
  } finally {
    remoteLoading.value = false
  }
}
</script>

<template>
  <div ref="selectWrapper" class="ir-select" :class="wrapperClass" @click="toggle">
    <label v-if="label" class="ir-select__label">
      <slot name="label">{{ label }}</slot>
    </label>

    <div v-if="$slots.prepend || prependIcon" class="ir-select__prepend">
      <slot name="prepend">
        <IrIcon v-if="prependIcon" :name="prependIcon" />
      </slot>
    </div>

    <div
      class="ir-select__control"
      :tabindex="disabled ? -1 : 0"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keydown="onKeyDown"
    >
      <div
        v-if="$slots['prepend-inner'] || prependInnerIcon"
        class="ir-select__prepend-inner"
      >
        <slot name="prepend-inner" :selected="selectedItem">
          <IrIcon v-if="prependInnerIcon" :name="prependInnerIcon" />
        </slot>
      </div>

      <div class="ir-select__input-wrapper">
        <template v-if="filterable">
          <input
            v-if="isOpen"
            :value="displayValue"
            :placeholder="searchPlaceholder || texts.search"
            :disabled="disabled"
            :readonly="!isOpen"
            class="ir-select__input"
            type="text"
            autocomplete="off"
            @input="onInputChange"
            @click.stop
            @keydown.stop
          >
          <div
            v-else
            class="ir-select__display"
            :class="{ 'ir-select__display--placeholder': !hasSelected }"
            @click.stop="toggle"
          >
            <span v-if="hasSelected" v-text="displayValue" />
            <span v-else v-text="placeholder || texts.select" />
          </div>
        </template>
        <div
          v-else
          class="ir-select__display"
          :class="{ 'ir-select__display--placeholder': !hasSelected }"
        >
          <slot v-if="hasSelected" name="selected" :selected="selectedItem">
            {{ displayValue }}
          </slot>
          <span v-else v-text="placeholder || texts.select" />
        </div>
      </div>

      <div class="ir-select__append-inner">
        <slot name="append-inner" :clear="clear" :has-selected="hasSelected">
          <IrIcon
            v-if="appendInnerIcon"
            :name="appendInnerIcon"
            class="ir-select__append-inner-icon"
          />
          <IrIcon
            v-if="clearable && hasSelected && !disabled"
            :name="clearIcon"
            class="ir-select__clear-icon"
            @click="onClearClick"
          />
          <IrIcon
            v-if="showCaret && !loading"
            :name="caretIcon"
            class="ir-select__caret-icon"
            :class="{ 'ir-select__caret-icon--rotated': isOpen }"
          />
          <div v-if="loading" class="ir-select__loading-spinner" />
        </slot>
      </div>
    </div>

<!--    <div v-if="$slots.append || appendIcon" class="ir-select__append">
      <slot name="append">
        <IrIcon v-if="appendIcon" :name="appendIcon" />
      </slot>
    </div>-->

    <div v-if="error" class="ir-select__error">
      <slot name="error">{{ error }}</slot>
    </div>

    <div v-if="caption && !error" class="ir-select__caption">
      <slot name="caption">{{ caption }}</slot>
    </div>

    <Teleport v-if="isOpen" to="body">
      <div ref="popover" class="ir-select__popover">
        <div v-if="$slots['dropdown-header'] && !loading" class="ir-select__dropdown-header">
          <slot name="dropdown-header" :search-query="searchQuery" :selected="selected" />
        </div>

        <div class="ir-select__dropdown-inner custom-scrollbar">
          <template v-if="!showLoading && localOptionsFiltered.length">
            <slot name="options" :items="localOptionsFiltered" :select="onOptionClick">
              <div
                v-for="optionGroup in localOptionsFiltered"
                :key="optionGroup.id"
                class="ir-select__dropdown-group"
              >
                <div v-if="nested && optionGroup.title" class="ir-select__dropdown-group-title">
                  <slot name="group-title" :group="optionGroup">
                    {{ optionGroup.title }}
                  </slot>
                </div>

                <div
                  v-for="option in optionGroup.children"
                  :key="option.id"
                  :ref="el => { if (el) dropdownItems[option.index] = el }"
                  :tabindex="option.index + 1"
                  class="ir-select__dropdown-item"
                  :class="{
                  selected: option.selected,
                  'ir-select__dropdown-item--disabled': option.disabled
                }"
                  @click="onOptionClick(option)"
                  @keydown.esc.prevent="close"
                  @keydown.enter.stop.prevent="onOptionClick(option)"
                  @keydown.up.stop.prevent="focusToItem(option.index - 1)"
                  @keydown.down.stop.prevent="focusToItem(option.index + 1)"
                >
                  <slot name="option" v-bind="{ option, selected: option.selected, multiple }">
                    <div class="ir-select__option-content">
                      <slot name="option-prepend" v-bind="{ option }">
                        <!--<IrCheckbox
                          v-if="multiple"
                          :model-value="option.selected"
                          class="ir-select__option-checkbox"
                          @click.stop
                        />-->
                      </slot>
                      <span class="ir-select__option-label">{{ option.title }}</span>
                      <slot name="option-append" v-bind="{ option }" />
                    </div>
                  </slot>
                </div>
              </div>
            </slot>
          </template>

          <div v-if="showLoading" class="ir-select__loading">
            <slot name="loading">
              <div class="ir-select__loading-content">
                <span>{{ localLoadingText }}</span>
              </div>
            </slot>
          </div>

          <div v-else-if="!localOptionsFiltered.length" class="ir-select__empty">
            <slot v-if="searchQuery" name="no-result" v-bind="{ searchQuery }">
              {{ noResultText || texts.noResultText }}
            </slot>
            <slot v-else name="no-item">
              {{ noItemText || texts.noItemText }}
            </slot>
          </div>
        </div>

        <div v-if="$slots['dropdown-footer'] && !loading" class="ir-select__dropdown-footer">
          <slot name="dropdown-footer" :selected="selected" :close="close" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" src="./IrSelect.scss" />
