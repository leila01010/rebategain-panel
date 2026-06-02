<script setup>
import { computed, ref, watch } from 'vue'
import { IrIcon, IrLoadingOverlay } from '@/lib/ui-kit'
import { formatDate } from '@/utils/helpers.js'

const props = defineProps({
  headers: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  defaultSort: { type: Array, default: () => [] },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md'].includes(val),
  },
  striped: {
    type: String,
    default: null,
    validator: (val) => ['odd', 'even'].includes(val),
  },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits('sort-change')

const sort = ref([])

const tableClasses = computed(() => {
  return [
    'ir-table',
    `ir-table--${props.size}`,
    props.striped && `ir-table--striped-${props.striped}`,
  ]
})

watch(props.defaultSort, (newVal) => {
  sort.value = newVal
}, { immediate: true })

function toggleSort(field, direction) {
  const index = sort.value.findIndex(s => s.field === field)
  if (index !== -1 && sort.value[index].direction === direction) {
    sort.value.splice(index, 1)
  } else {
    if (index !== -1) sort.value.splice(index, 1)
    sort.value.push({ field, direction })
  }
  emit('sort-change', sort.value)
}

function getSortIconClass(field, direction) {
  const s = sort.value.find(s => s.field === field)
  if (!s) return 'text-gray-400'
  return s.direction === direction ? 'text-dark-blue-6' : 'text-gray-400'
}

function cellValue(item, path) {
  return path.split('.').reduce((o, key) => (o ? o[key] : ''), item)
}
</script>

<template>
  <div :class="tableClasses">
    <div class="ir-table__container">
      <slot name="top" />
      <table class="ir-table__table">
        <colgroup>
          <col
            v-for="header in headers"
            :key="header.key"
            :style="{
              width: header.key === 'actions' ? '115px' : header.width,
              maxWidth: header.maxWidth,
              minWidth: header.minWidth,
            }"
          >
        </colgroup>
        <thead class="ir-table__head">
        <tr class="ir-table__row">
          <th
            v-for="header in headers"
            :key="header.key"
            class="ir-table__cell"
            :class="`ir-table__cell--${header.align || 'start'}`"
            scope="col"
          >
            <div class="ir-table__cell-content">
              <span class="ir-table__title" v-text="header.title" />
              <span v-if="header.sortable" class="ir-table__sort">
                  <IrIcon
                    name="caret-up"
                    class="ir-table__sort-icon"
                    :class="getSortIconClass(header.key, 'asc')"
                    @click="toggleSort(header.key, 'asc')"
                  />
                  <IrIcon
                    name="caret-down"
                    class="ir-table__sort-icon"
                    :class="getSortIconClass(header.key, 'desc')"
                    @click="toggleSort(header.key, 'desc')"
                  />
                </span>
            </div>
          </th>
        </tr>
        </thead>
        <tbody class="ir-table__body">
        <tr v-for="(item, index) in items" :key="index" class="ir-table__row">
          <td
            v-for="header in headers"
            :key="header.key"
            class="ir-table__cell"
            :class="[
              `ir-table__cell--${header.align || 'start'}`,
               header.key === 'actions' && `ir-table__cell-${header.key}`
            ]"
          >
            <div class="ir-table__cell-content">
              <slot
                :name="`item-${header.key}`"
                :data="item"
                :value="cellValue(item, header.key)"
                :index="index"
              >
                <span
                  v-if="header.type === 'date'"
                  v-text="formatDate(item[header.key])"
                />
                <span
                  v-else-if="header.type === 'datetime'"
                  v-text="formatDate(item[header.key], 'HH:mm jYYYY/jMM/jDD')"
                />
                <span v-else-if="header.type === 'dateRange'">
                  <span v-text="formatDate(item.from_date, 'jYYYY/jMM/jDD')" />
                  <span class="px-1 text-dark-blue-4" v-text="$t('common.until')" />
                  <span v-text="formatDate(item.to_date, 'jYYYY/jMM/jDD')" />
                </span>
                <span
                  v-else-if="header.type === 'truncate'"
                  class="truncate"
                  v-text="cellValue(item, header.key)"
                />
                <div v-else>
                  <span v-text="cellValue(item, header.key)" />
                  <span v-if="header.suffix" class="mr-1">{{ header.suffix }}</span>
                </div>
              </slot>
            </div>
          </td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="12" class="ir-table__empty">
            <slot name="no-data">
              <span class="ir-table__empty-text" v-text="$t('common.noData')" />
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
      <slot name="bottom" />
      <IrLoadingOverlay
        :visible="loading"
        :message="$t('common.loadingText')"
        class="ir-table__loading"
      />
    </div>
  </div>
</template>

<style lang="scss" src="./IrTable.scss" />
