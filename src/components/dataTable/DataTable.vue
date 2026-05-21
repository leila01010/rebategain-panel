<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { IrTable, IrCard, IrPagination, IrIcon, IrInfiniteLoading } from '@/lib/ui-kit'
import http from '@/services/http.js'
import { useRouter } from 'vue-router'
import { useDevice } from '@/composables/useDevice.js'

const props = defineProps({
  // unique id for this table
  id: { type: String, default: '' },
  title: { type: String, default: '' },
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
const { isPhone } = useDevice()

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
const hasMore = computed(() => {
  return page.currentPage < totalPages.value
})
const params = computed(() => {
  return {
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
  const append = isPhone.value && page.currentPage > 1

  const done = async config => {
    loading.value = true
    try {
      const data = await http.get(props.url, { params: config })
      const rows = data?.data || data || []
      items.value = append ? [...items.value, ...rows] : rows
      totalItems.value = data?.pagination?.total ?? (Array.isArray(data) ? data.length : 0)
    } finally {
      loading.value = false
    }
  }

  if (props.beforeUpdate) props.beforeUpdate(config, done)
  else await done(config)
}

function loadMore() {
  if (loading.value || !hasMore.value) return
  page.currentPage++
}

function sortChange(data) {
  sort.value = data
}

function cellValue(item, path) {
  return String(path).split('.').reduce((o, key) => (o ? o[key] : ''), item)
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

defineExpose({ fetch })

onMounted(() => fetch())
</script>

<template>
  <div class="data-table">
    <div>
      <!-- Mobile: card list -->
      <div v-if="isPhone" class="data-table__list">
        <div class="data-table__list-header">
          <h4 class="data-table__list-title" v-text="title" />
        </div>

        <div
          v-for="(item, index) in items"
          :key="item.id ?? index"
          class="data-table__list-item"
        >
          <slot name="mobile-item" :item="item" :index="index" />
        </div>

        <div v-if="loading" class="data-table__list-loading">
          <IrIcon name="loading" :size="16" />
          <span v-text="$t('common.loadingText')" />
        </div>
        <p v-else-if="!items.length" class="data-table__list-empty">
          {{ $t('common.noData') }}
        </p>

        <IrInfiniteLoading
          v-if="showPagination"
          :is-loading="loading"
          :is-disabled="!hasMore"
          wrapper-class="data-table__loader"
          @load-more="loadMore"
        >
          <template #loading>
            <IrIcon v-if="loading" name="spinner" :size="24" class="data-table__spinner" />
          </template>
        </IrInfiniteLoading>
      </div>

      <!-- Desktop: table -->
      <IrCard v-else :title flush header-class="!border-0">
        <IrTable
          :headers
          :items
          :loading
          :size
          :striped
          @sort-change="sortChange"
        >
          <template #item-order="{ index }">
            <span v-text="index + 1" />
          </template>
          <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>

          <template v-if="showPagination && totalPages > 1" #bottom>
            <div class="p-4 border-y border-blue-20">
              <IrPagination v-model="page.currentPage" :total-pages="totalPages" />
            </div>
          </template>
        </IrTable>
      </IrCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table__list {
  margin: 0 -16px;

  &-header {
    padding: 16px;
  }

  &-item {
    background-color: #ffffff;
    padding: 16px;
    border-bottom: 1px dashed var(--color-dark-blue-50);
  }

  &-loading, &-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #ffffff;
    padding: 16px;
    font-size: 14px;
    color: var(--color-dark-blue-600);
  }
}

.data-table__spinner {
  color: var(--color-primary);
  animation: data-table-spin 0.8s linear infinite;
}

@keyframes data-table-spin {
  to { transform: rotate(360deg); }
}
</style>
