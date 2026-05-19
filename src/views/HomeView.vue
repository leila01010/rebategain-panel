<script setup>
import { ref } from 'vue'
import { IrButton, IrModal, IrInput, IrChip, IrCard, message, IrSelect, IrDropdown, IrAlert } from '@/lib/ui-kit'
import EmptyState from '@/components/EmptyState.vue'

const showModal = ref(false)
const category = ref('')
const categories = ref([
  { title: 'category 1', id: 0 },
  { title: 'category 2', id: 1 },
  { title: 'category 3', id: 2 }
])

function showMessage() {
  message.success('up Prettier and ESLint')
}
</script>

<template>
  <div class="overview">
    <div class="text-dark-blue-600 text-3xl p-8 mt-12">
      Home View {{ $t('auth.title') }}
      <div class="my-6">
        <IrButton text="Login" color="secondary" size="lg" class="mb-8" @click="showModal = true" />
        <IrButton text="Show Message" color="secondary" size="lg" class="mb-8" @click="showMessage" />
        <IrInput
          :placeholder="$t('auth.title')"
          :label="$t('auth.title')"
          size="lg"
          prefix-icon="wallet"
          suffix-icon="wallet"
          class="mb-8"
        >
          <template #append>+98</template>
        </IrInput>
        <div class="flex items-center gap-2">
          <IrSelect
            v-model="category"
            label="platform"
            placeholder="select"
            :options="categories"
            append-inner-icon="wallet"
            prepend-inner-icon="wallet"
            class="mb-6 !hidden md:!flex"
          />
          <IrDropdown label="Menu" :max-width="250">
            <template #content>
              <div class="demo-dropdown">
                If you've skipped this step before you know
                what a headache it can be. If you weren't aware of this step when setting
              </div>
            </template>
          </IrDropdown>
        </div>
      </div>

      <IrCard class="mb-6">
        <IrAlert size="lg" icon="info" color="primary" class="mb-6" />

        <div class="space-x-4">
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="sm" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="lg" />
        </div>
        <div class="space-x-4">
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="sm" color="success" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" color="success" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="lg" color="success" />
        </div>
        <div class="space-x-4">
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="sm" color="danger" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" color="danger" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="lg" color="danger" />
        </div>
        <div class="space-x-4">
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="sm" color="warning" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" color="warning" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="lg" color="warning" />
        </div>
        <div class="space-x-4">
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="sm" color="info" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" color="info" />
          <IrChip text="Pending" prepend-icon="close-circle" append-icon="close-circle" size="lg" color="info" />
        </div>
      </IrCard>

      <EmptyState
        icon="city"
        title="No Broker Accounts Yet"
        description="Start your trading journey by linking your first broker account. We support major brokers worldwide"
        button-text="Add your broker account"
      />

      <IrModal v-model:show="showModal">
        If you've skipped this step before you know
        what a headache it can be. If you weren't aware of this step when setting
        up Prettier and ESLint before you'd likely never want to
        use either of the tools again! Luckily it's easily fixable.
        <IrButton text="close" variant="outline" @click="showModal = false" />
      </IrModal>
    </div>
  </div>
</template>
