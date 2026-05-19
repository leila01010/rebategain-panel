<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { IrTable } from '@/lib/ui-kit'
import http from '@/services/http.js'
import { useRouter } from 'vue-router'

const props = defineProps({
  // unique id for this table
  id: { type: String, default: '' },
  headers: { type: Array, default: () => [] },
  filters: { type: Array, default: () => [] },
  // the main url to fetch data:
  // @example: http://example.com/admin/user
  url: { type: String, default: '' },
  exportUrl: { type: String, default: '' },
  showIdColumn: { type: Boolean, default: true },
  defaultSort: { type: String, default: '' },
  defaultSortDir: { type: String, default: '' },
  // auto update after "x" seconds
  updateInterval: { type: Number, default: 0 },
  beforeUpdate: { type: Function, default: null },
  afterUpdate: { type: Function, default: null },
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
  perPage: { type: Number, default: 10 },
  showPagination: { type: Boolean, default: true },
  showFiltersUrl: { type: Boolean, default: false },
  mapRows: { type: Function, default: null },
})

const router = useRouter()

const loading = ref(false)
const updateTimeout = ref(null)
const items = ref([])
const totalItems = ref('')
const quickFilter = ref([])
const sort = ref([])
const page = reactive({
  currentPage: 1,
  perPage: props.perPage,
})

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / page.perPage)
})
const params = computed(() => {
  return {
    filters: quickFilter.value,
    sort: sort.value.map(s => `${s.field}:${s.direction}`),
    page: page.currentPage,
    per_page: page.perPage,
  }
})
const paramsJson = computed(() => {
  return JSON.parse(JSON.stringify(params.value))
})
const hasFilters = computed(() => {
  return quickFilter.value.length > 0
})

watch(() => props.defaultSort, (value) => {
  if (value) {
    const isExist = sort.value.find(s => s.field === props.defaultSort)
    if (!isExist)
      sort.value =[{ field: props.defaultSort, direction: props.defaultSortDir }]
  }
}, { immediate: true })

watch(() => page.perPage, () => updateFromStart)

watch(quickFilter, () => updateFromStart)

watch(sort, () => {
  updateFromStart()
  saveConfig()
}, { deep: true })

watch(page, () => saveConfig)

watch(paramsJson, (after, before) => {
  if (after !== before) {
    if (props.showFiltersUrl)
      router.replace({ query: { filters: JSON.stringify(params.value) } })
    setTimeout(fetch, 150)
  }
}, { immediate: true })

async function fetch() {
  if (loading.value) return
  window.clearTimeout(updateTimeout.value)
  updateTimeout.value = null
  const config = params.value
  const done = async config => {
    // const queryParams = createFilter(config)
    // const queryString = qs.stringify(queryParams, { encodeValuesOnly: true })
    loading.value = true
    try {
      const data = await http.get(props.url)
      items.value = data || []
      // totalItems.value = data.value?.meta?.total
    } finally {
      loading.value = false
    }
  }
  if (props.beforeUpdate) props.beforeUpdate(config, done)
  else await done(config)
}

function sortChange(data) {
  sort.value = data
}

function updateFromStart() {
  page.currentPage = 1
}

function saveConfig() {
  if (!props.id) return
  // $settings.set(`_table_config_${props.id}`, {
  //   sort: sort.value,
  //   page: page
  // })
}

onMounted(() => fetch())
</script>

<template>
  <div class="data-table">
    <IrTable
      :headers
      :items
      :loading
      :size
      :striped
    >
      <template #item-order="{ index }">
        <span v-text="index + 1" />
      </template>
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </IrTable>
  </div>
</template>
