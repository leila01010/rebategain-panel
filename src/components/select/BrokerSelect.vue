<script setup>
import { IrSelect } from '@/lib/ui-kit'
import http from '@/services/http.js'
import api from '@/api/api-list.js'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useReferenceStore } from '@/stores/reference.js'

const emit = defineEmits(['select', 'add-broker'])

const PER_PAGE = 50

const selfValue = defineModel({ type: [String, Number], default: null })

const referenceStore = useReferenceStore()

const { brokers } = storeToRefs(referenceStore)

const loading = ref(false)

async function fetch() {
  if (brokers.value.length) return

  loading.value = true

  try {
    const data = await http.get(api.brokers, { params: { perPage: PER_PAGE } })
    brokers.value = (data?.data || []).map((item) => ({
      title: item.name,
      id: item.id,
      ...item,
    }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function selectBroker(option, select) {
  select(option)
  emit('select', option)
}
</script>

<template>
  <IrSelect
    v-model="selfValue"
    :options="brokers"
    :label="$t('common.broker')"
    :placeholder="$t('common.selectBroker')"
    :loading
    block
    filterable
    @open="fetch"
  >
    <template #options="{ items, select }">
      <div class="max-h-[207px] p-2 overflow-auto custom-scrollbar">
        <div v-for="group in items" :key="group.id" class="w-full">
          <div
            v-for="option in group.children"
            :key="option.id"
            class="flex items-center gap-x-2 px-4 py-2 border rounded-xl hover:bg-blue-20 cursor-pointer"
            :class="option.id === selfValue ? 'bg-blue-20 border-primary' : 'bg-white border-white'"
            @click="selectBroker(option, select)"
          >
            <span class="text-sm text-dark-blue-7" v-text="option.title" />
          </div>
        </div>
      </div>
    </template>
  </IrSelect>
</template>
