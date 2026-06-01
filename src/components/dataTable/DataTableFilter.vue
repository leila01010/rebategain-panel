<script setup>
import { ref, computed } from 'vue'
import { IrDropdown, IrCheckbox, IrButton, IrIcon } from '@/lib/ui-kit'

const props = defineProps({
  // [{ key, title, options: [{ value, label }] }]
  filters: { type: Array, default: () => [] },
  // applied selection: { [key]: string[] }
  modelValue: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:model-value'])

const dropdownRef = ref(null)
const draft = ref({})

const activeCount = computed(() =>
  Object.values(props.modelValue).reduce((sum, v) => sum + (v?.length || 0), 0),
)

function syncDraft() {
  const next = {}
  for (const group of props.filters) {
    next[group.key] = [...(props.modelValue[group.key] || [])]
  }
  draft.value = next
}

function apply() {
  const next = {}
  for (const [key, values] of Object.entries(draft.value)) {
    if (values.length) next[key] = values
  }
  emit('update:model-value', next)
  dropdownRef.value?.close()
}

function reset() {
  for (const key of Object.keys(draft.value)) draft.value[key] = []
  emit('update:model-value', {})
  dropdownRef.value?.close()
}
</script>

<template>
  <IrDropdown
    ref="dropdownRef"
    align="end"
    min-width="240px"
    max-width="320px"
    max-height="none"
    @click="syncDraft"
  >
    <template #trigger>
      <span class="data-table-filter__trigger">
        <IrIcon name="filter" :size="16" />
        <span v-text="$t('common.filter')" />
        <span v-if="activeCount" class="data-table-filter__badge" v-text="activeCount" />
      </span>
    </template>

    <template #content>
      <div class="data-table-filter__panel">
        <div
          v-for="group in filters"
          :key="group.key"
          class="data-table-filter__group"
        >
          <h4 class="data-table-filter__group-title" v-text="group.title" />
          <IrCheckbox
            v-for="opt in group.options"
            :key="opt.value"
            v-model="draft[group.key]"
            :value="opt.value"
            :label-left="opt.label"
            size="sm"
            class="data-table-filter__option"
          />
        </div>

        <div class="data-table-filter__footer">
          <IrButton :text="$t('common.reset')" variant="text" color="secondary" size="sm" @click="reset" />
          <IrButton :text="$t('common.apply')" variant="text" color="primary" size="sm" @click="apply" />
        </div>
      </div>
    </template>
  </IrDropdown>
</template>

<style scoped lang="scss">
.data-table-filter__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-dark-blue-600);
}

.data-table-filter__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary);
  border-radius: 9px;
}

.data-table-filter__panel {
  padding: 8px 16px;
}

.data-table-filter__group + .data-table-filter__group {
  margin-top: 8px;
}

.data-table-filter__group-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-dark-blue-800);
}

.data-table-filter__option {
  display: flex;
}

.data-table-filter__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 16px -16px -16px -16px;
  padding: 8px 16px;
  border-top: 1px solid var(--color-blue-20);
}
</style>
