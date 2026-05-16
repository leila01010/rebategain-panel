<script setup>
import { IrButton } from '@/lib/ui-kit'
import BrokerSelect from '@/components/select/BrokerSelect.vue'
import { ref } from 'vue'

const emit = defineEmits(['next'])

const selfValue = defineModel({ type: [String, Number], default: null })

const broker = ref(null)

function selectBroker(data) {
  broker.value = data
}
</script>

<template>
  <div>
    <BrokerSelect v-model="selfValue" class="mb-6" @select="selectBroker" />
    <div class="flex justify-end">
      <IrButton
        :text="$t('common.next')"
        append-icon="arrow-right"
        :disabled="!selfValue"
        @click="emit('next', { broker })"
      />
    </div>
  </div>
</template>
