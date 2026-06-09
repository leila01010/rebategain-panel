<script setup>
import { computed, ref, watch } from 'vue'
import { IrInput, IrModal, IrDivider, IrIcon, IrButton } from '@/lib/ui-kit'
import MonthPanel from './MonthPanel.vue'
import moment from '@/lib/moment.js'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/composables/useDevice.js'

const props = defineProps({
  mode: { type: String, default: 'single', validator: v => ['single', 'range'].includes(v) },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  format: { type: String, default: 'YYYY-MM-DD' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  block: { type: Boolean, default: false },
  presets: { type: Array, default: null }, // [{ key, label, days }] | null => use defaults
  trigger: { type: Boolean, default: true },
})

const { isPhone } = useDevice()

const value = defineModel({ default: null })

const { t } = useI18n()

const DEFAULT_PRESETS = [
  { key: 'last7', label: t('uiKit.datePicker.last7Days'), days: 7 },
  { key: 'last30', label: t('uiKit.datePicker.last30Days'), days: 30 },
  { key: 'lastYear', label: t('uiKit.datePicker.lastYear'), days: 365 },
  { key: 'allTime', label: t('uiKit.datePicker.allTime'), days: null },
]
const activePresets = computed(() => props.presets ?? DEFAULT_PRESETS)

const isRange = computed(() => props.mode === 'range')

const show = defineModel('show', { type: Boolean, default: false })

function openPicker() {
  if (props.disabled) return
  show.value = true
}

const leftCursor = ref(moment().xStartOf('month'))
const rightCursor = computed(() => leftCursor.value.clone().xAdd(1, 'month'))

const rangeStart = ref(null)
const rangeEnd = ref(null)
const singleDate = ref(null)
const hoverDate = ref(null)
const activePresetKey = ref(null)

watch(value, parseFromModel, { immediate: true })

function parseFromModel(v) {
  if (isRange.value) {
    if (v?.from) {
      rangeStart.value = moment(v.from)
      rangeEnd.value = v.to ? moment(v.to) : null
    } else {
      rangeStart.value = null
      rangeEnd.value = null
    }
  } else {
    singleDate.value = v ? moment(v) : null
  }
}

const displayText = computed(() => {
  if (isRange.value) {
    if (!rangeStart.value) return ''
    const a = rangeStart.value.xFormat(props.format)
    const b = rangeEnd.value ? rangeEnd.value.xFormat(props.format) : '…'
    return `${a}  →  ${b}`
  }
  return singleDate.value ? singleDate.value.xFormat(props.format) : ''
})

function onSelectDay(date) {
  if (isRange.value) {
    if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
      rangeStart.value = date.clone()
      rangeEnd.value = null
      activePresetKey.value = null
    } else {
      if (date.isBefore(rangeStart.value, 'day')) {
        rangeEnd.value = rangeStart.value
        rangeStart.value = date.clone()
      } else {
        rangeEnd.value = date.clone()
      }
      commit()
    }
  } else {
    singleDate.value = date.clone()
    value.value = date.xFormat(props.format)
  }
}

function commit() {
  if (isRange.value && rangeStart.value && rangeEnd.value) {
    value.value = {
      from: rangeStart.value.xFormat(props.format),
      to: rangeEnd.value.xFormat(props.format),
    }
  }
}

function applyPreset(p) {
  activePresetKey.value = p.key
  const end = moment()
  if (p.days === null) {
    rangeStart.value = moment('1970-01-01')
  } else {
    rangeStart.value = end.clone().subtract(p.days - 1, 'day')
  }
  rangeEnd.value = end
  leftCursor.value = rangeStart.value.clone().xStartOf('month')
  commit()
}

function prev() { leftCursor.value = leftCursor.value.clone().xAdd(-1, 'month') }
function next() { leftCursor.value = leftCursor.value.clone().xAdd(1, 'month') }
function onHover(date) { hoverDate.value = date }
</script>

<template>
  <div v-if="trigger" class="ir-date-picker" @click="openPicker">
    <IrInput
      :model-value="displayText"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :disabled="disabled"
      :block="block"
      readonly
      suffix-icon="calendar"
    />
  </div>

  <IrModal
    v-model:show="show"
    size=""
    :title="$t('uiKit.datePicker.datePicker')"
    :plain="!isPhone"
    body-class="ir-date-picker__panel"
  >
    <template #header-prepend>
      <IrIcon name="calculator" size="16" />
    </template>
    <aside v-if="isRange" class="ir-date-picker__sidebar">
      <button
        v-for="p in activePresets"
        :key="p.key"
        type="button"
        class="ir-date-picker__preset"
        :class="{ 'ir-date-picker__preset--active': activePresetKey === p.key }"
        @click="applyPreset(p)"
      >
        {{ p.label }}
      </button>
    </aside>

    <div class="ir-date-picker__calendars">
      <div class="ir-date-picker__month-panel">
        <MonthPanel
          :cursor="leftCursor"
          :selected-start="isRange ? rangeStart : singleDate"
          :selected-end="isRange ? rangeEnd : null"
          :hover-date="hoverDate"
          show-prev
          :show-next="!isRange"
          :mode
          @prev="prev"
          @next="next"
          @update:cursor="(c) => leftCursor = c"
          @select-day="(d) => { onSelectDay(d); if (!isRange) show = false }"
          @hover-day="onHover"
        />
      </div>
      <IrDivider v-if="isRange" orientation="vertical" />
      <div v-if="isRange" class="ir-date-picker__month-panel">
        <MonthPanel
          :cursor="rightCursor"
          :selected-start="rangeStart"
          :selected-end="rangeEnd"
          :hover-date="hoverDate"
          show-next
          :mode
          @next="next"
          @update:cursor="(c) => leftCursor = c.clone().xAdd(-1, 'month')"
          @select-day="onSelectDay"
          @hover-day="onHover"
        />
      </div>
      <div v-if="isPhone" class="px-4 py-8">
        <IrButton :text="$t('common.submit')" block @click="show = false" />
      </div>
    </div>
  </IrModal>
</template>

<style lang="scss" src="./IrDatePicker.scss" />
