<script setup>
import { IrSelect, IrIcon, IrDatePicker } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import moment from '@/lib/moment.js'
import { formatDate } from '@/utils/helpers.js'

defineProps({
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  error: { type: String, default: '' },
  latestInquiryDate: { type: String, default: null },
})

defineOptions({ inheritAttrs: false })

const selfValue = defineModel({ type: Array, default: () => [] })

const { t } = useI18n()

const FORMAT = 'YYYY-MM-DD'

const periodOptions = [
  { id: '7', title: t('overview.last7Days'), days: 7 },
  { id: '30', title: t('overview.last30Days'), days: 30 },
  { id: 'custom', title: '' },
]

const showDatePicker = ref(false)
const irSelectValue = ref(null)

const displayRange = computed(() => {
  if (irSelectValue.value !== 'custom') {
    const opt = periodOptions.find(o => o.id === irSelectValue.value)
    return opt?.title ?? ''
  }
  if (selfValue.value?.length !== 2) return ''
  return `${formatDate(selfValue.value[0])} → ${formatDate(selfValue.value[1])}`
})

const date = computed(() => moment().format('YYYY-MM-DD'))

function selectItem(option, select) {
  const to = moment()
  const from = to.clone().subtract(option.days - 1, 'day')
  selfValue.value = [from.format(FORMAT), to.format(FORMAT)]
  select(option)
}

function openDatePicker(select) {
  showDatePicker.value = true
  select({ disabled: false, id: 'custom' })
}
</script>

<template>
  <IrSelect
    v-model="irSelectValue"
    :options="periodOptions"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :block="block"
    :error="error"
  >
    <template #selected>
      {{ displayRange }}
    </template>
    <template #options="{ items, select }">
      <div class="max-h-[210px] overflow-auto">
        <div v-for="group in items" :key="group.id" class="w-full">
          <template v-for="option in group.children" :key="option.id">
            <div
              v-if="option.id !== 'custom'"
              class="flex items-center gap-x-2 px-4 py-3 cursor-pointer border-b border-dark-blue-50"
              @click="selectItem(option, select)"
            >
              <span class="text-sm text-dark-blue-600 leading-4" v-text="option.title" />
            </div>
          </template>
          <div
            class="bg-blue-20 flex items-center gap-x-2 px-4 py-3 cursor-pointer border-b border-dark-blue-50"
            @click="openDatePicker(select)"
          >
            <IrIcon name="calendar" size="16" class="text-dark-blue-400" />
            <span class="text-sm text-dark-blue-600 leading-4">{{ $t('overview.datePicker') }}</span>
          </div>
        </div>
      </div>
    </template>
  </IrSelect>

  <IrDatePicker
    v-model="selfValue"
    v-model:show="showDatePicker"
    mode="range"
    :max="date"
    :min="latestInquiryDate"
    :trigger="false"
  />
</template>
