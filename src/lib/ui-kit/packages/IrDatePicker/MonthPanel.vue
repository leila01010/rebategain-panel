<script setup>
import { computed, ref } from 'vue'
import moment from '@/lib/moment.js'
import { IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  cursor: { type: Object, required: true },           // moment, first day of the month
  selectedStart: { type: Object, default: null },     // moment | null
  selectedEnd: { type: Object, default: null },       // moment | null
  hoverDate: { type: Object, default: null },         // moment | null
  showPrev: { type: Boolean, default: false },
  showNext: { type: Boolean, default: false },
  mode: { type: String, default: 'single', validator: v => ['single', 'range'].includes(v) },
})

const emit = defineEmits(['prev', 'next', 'update:cursor', 'hover-day', 'select-day'])

const viewMode = ref('days') // 'days' | 'months' | 'years'
const yearPageStart = ref(0)

const weekdays = computed(() => {
  const start = props.cursor.clone().xStartOf('week')
  return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'day').format('dd'))
})

const monthLabel = computed(() => props.cursor.xFormat('jMMMM'))
const yearLabel = computed(() => props.cursor.xFormat('jYYYY'))

const days = computed(() => {
  const first = props.cursor.clone().xStartOf('month')
  const startOfGrid = first.clone().xStartOf('week')
  const grid = []
  for (let i = 0; i < 42; i++) {
    const d = startOfGrid.clone().add(i, 'day')
    const isInMonth = d.xMonth() === first.xMonth() && d.xYear() === first.xYear()
    grid.push({
      date: d,
      key: d.format('YYYY-MM-DD'),
      label: d.xFormat('jD'),
      isInMonth,
      isToday: d.isSame(moment(), 'day'),
    })
  }

  if (grid.slice(35, 42).every(c => !c.isInMonth)) grid.length = 35
  return grid
})

function dayState(cell) {
  const start = props.selectedStart
  const end = props.selectedEnd
  const hover = props.hoverDate
  const isStart = start && cell.date.isSame(start, 'day')
  const isEnd = end && cell.date.isSame(end, 'day')

  let inRange = false

  if (props.mode === 'single')
    return { isStart, isEnd, inRange }

  if (start && end) {
    inRange = cell.date.isSameOrAfter(start, 'day') && cell.date.isSameOrBefore(end, 'day')
  } else if (start && hover && !end) {
    const a = start.isBefore(hover, 'day') ? start : hover
    const b = start.isBefore(hover, 'day') ? hover : start
    inRange = cell.date.isSameOrAfter(a, 'day') && cell.date.isSameOrBefore(b, 'day')
  }

  return { isStart, isEnd, inRange }
}

const months = computed(() => Array.from({ length: 12 }, (_, i) => ({
  index: i,
  label: props.cursor.clone().xMonth(i).xFormat('jMMMM'),
  active: i === props.cursor.xMonth(),
})))

const years = computed(() => {
  const base = yearPageStart.value || (props.cursor.xYear() - (props.cursor.xYear() % 12))
  return Array.from({ length: 12 }, (_, i) => ({
    year: base + i,
    active: base + i === props.cursor.xYear(),
  }))
})

function openMonths() { viewMode.value = viewMode.value === 'months' ? 'days' : 'months' }
function openYears() {
  yearPageStart.value = props.cursor.xYear() - (props.cursor.xYear() % 12)
  viewMode.value = viewMode.value === 'years' ? 'days' : 'years'
}

function pickMonth(monthIndex) {
  emit('update:cursor', props.cursor.clone().xMonth(monthIndex).xDate(1))
  viewMode.value = 'days'
}

function pickYear(year) {
  emit('update:cursor', props.cursor.clone().xYear(year).xDate(1))
  viewMode.value = 'days'
}

function yearPagePrev() { yearPageStart.value -= 12 }
function yearPageNext() { yearPageStart.value += 12 }
</script>

<template>
  <div class="ir-dp-panel">
    <div class="ir-dp-panel__header">
      <button v-if="showPrev" type="button" class="ir-dp-panel__nav" @click="emit('prev')">
        <IrIcon name="arrow-left" />
      </button>
      <span v-else class="ir-dp-panel__nav-placeholder" />

      <div class="ir-dp-panel__title">
        <button type="button" class="ir-dp-panel__title-btn" @click="openMonths">
          {{ monthLabel }}
        </button>
        <button type="button" class="ir-dp-panel__title-btn" @click="openYears">
          {{ yearLabel }}
        </button>
      </div>

      <button v-if="showNext" type="button" class="ir-dp-panel__nav" @click="emit('next')">
        <IrIcon name="arrow-right" />
      </button>
      <span v-else class="ir-dp-panel__nav-placeholder" />
    </div>

    <template v-if="viewMode === 'days'">
      <div class="ir-dp-panel__weekdays">
        <span v-for="(d, i) in weekdays" :key="i" class="ir-dp-panel__weekday">{{ d }}</span>
      </div>

      <div class="ir-dp-panel__grid">
        <button
          v-for="cell in days"
          :key="cell.key"
          type="button"
          class="ir-dp-panel__day"
          :disabled="!cell.isInMonth"
          :class="{
            'ir-dp-panel__day--out': !cell.isInMonth,
            'ir-dp-panel__day--today': cell.isToday,
            'ir-dp-panel__day--in-range': cell.isInMonth && dayState(cell).inRange && !dayState(cell).isStart && !dayState(cell).isEnd,
            'ir-dp-panel__day--start': cell.isInMonth && dayState(cell).isStart,
            'ir-dp-panel__day--end': cell.isInMonth && dayState(cell).isEnd,
          }"
          @click="emit('select-day', cell.date)"
          @mouseenter="cell.isInMonth && emit('hover-day', cell.date)"
        >
          {{ cell.label }}
        </button>
      </div>
    </template>

    <div v-else-if="viewMode === 'months'" class="ir-dp-panel__month-grid">
      <button
        v-for="m in months"
        :key="m.index"
        type="button"
        class="ir-dp-panel__cell"
        :class="{ 'ir-dp-panel__cell--active': m.active }"
        @click="pickMonth(m.index)"
      >
        {{ m.label }}
      </button>
    </div>

    <div v-else class="ir-dp-panel__year-view">
      <div class="ir-dp-panel__year-nav">
        <button type="button" class="ir-dp-panel__nav" @click="yearPagePrev">
          <IrIcon name="arrow-left" />
        </button>
        <span class="ir-dp-panel__year-range">{{ years[0].year }} – {{ years[years.length - 1].year }}</span>
        <button type="button" class="ir-dp-panel__nav" @click="yearPageNext">
          <IrIcon name="arrow-right" />
        </button>
      </div>
      <div class="ir-dp-panel__month-grid">
        <button
          v-for="y in years"
          :key="y.year"
          type="button"
          class="ir-dp-panel__cell"
          :class="{ 'ir-dp-panel__cell--active': y.active }"
          @click="pickYear(y.year)"
        >
          {{ y.year }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./MonthPanel.scss" />
