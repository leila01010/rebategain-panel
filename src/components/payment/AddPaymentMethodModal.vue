<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  IrModal,
  IrSelect,
  IrInput,
  IrAlert,
  IrButton,
  IrIcon,
  message,
  IrCheckbox,
  IrDivider,
} from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import http from '@/services/http.js'
import api from '@/api/api-list.js'

const emit = defineEmits(['done'])

const show = defineModel('show', { type: Boolean, default: false })

const { t } = useI18n()

const TABS = [
  { key: 'crypto', label: t('payment.tabs.crypto'), icon: 'finance', enabled: true },
  { key: 'bank', label: t('payment.tabs.bank'), icon: 'bank', enabled: false },
  { key: 'e-wallet', label: t('payment.tabs.e-wallet'), icon: 'financing', enabled: false },
]

const activeTab = ref('crypto')
const currencyId = ref('')
const assetNetworkId = ref('')
const address = reactive({
  walletAddress: '',
})
const isDefault = ref(false)
const loading = ref(false)
const submitting = ref(false)
const assets = ref([])

const canSubmit = computed(() => {
  return !!currencyId.value && !!assetNetworkId.value && !!address.walletAddress.trim()
})

const selectedAsset = computed(() => {
  return assets.value.find((asset) => asset.id === currencyId.value)
})

const networks = computed(() => {
  return selectedAsset.value?.networks || []
})

watch(show, (value) => {
  if (!value) reset()
})

async function pasteAddress() {
  try {
    address.walletAddress = await navigator.clipboard.readText()
  } catch (e) {
    console.log('clipboard not available:', e)
  }
}

async function submit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    const { data } = await http.post(api.paymentMethods, {
      type: activeTab.value,
      assetNetworkId: assetNetworkId.value,
      address: address,
      isDefault: isDefault.value,
    })
    message.success(t('payment.saved'))
    emit('done', data)
    show.value = false
  } catch (e) {
    message.error(e?.error || t('payment.saveError'))
  } finally {
    submitting.value = false
  }
}

async function getAssets() {
  if (assets.value.length) return
  loading.value = true
  try {
    const { data } = await http.get(api.assets)
    loading.value = false
    assets.value = (data || []).map((item) => ({
      title: `${item.name} (${item.code})`,
      ...item,
    }))
  } catch (error) {
    loading.value = false
    console.error(error)
  }
}

function reset() {
  activeTab.value = ''
  currencyId.value = ''
  assetNetworkId.value = ''
  address.walletAddress = ''
  isDefault.value = true
  submitting.value = false
}
</script>

<template>
  <IrModal v-model:show="show" size="380px" :title="$t('payment.addNewMethod')">
    <template #header-prepend>
      <IrIcon name="wallet" :size="18" class="text-dark-blue-500" />
    </template>

    <div class="payment-tabs">
      <button
        v-for="tab in TABS"
        :key="tab.key"
        type="button"
        class="payment-tabs__tab"
        :class="{ 'payment-tabs__tab--active': activeTab === tab.key }"
        :disabled="!tab.enabled"
        @click="tab.enabled && (activeTab = tab.key)"
      >
        <IrIcon :name="tab.icon" :size="12" />
        <span>{{ tab.label }}</span>
        <span v-if="!tab.enabled" class="payment-tabs__tab-badge" v-text="$t('payment.soon')" />
      </button>
    </div>

    <form @submit.prevent="submit">
      <IrSelect
        v-model="currencyId"
        :options="assets"
        :label="$t('payment.currency')"
        class="mb-4"
        :loading
        block
        @open="getAssets"
      />

      <IrSelect
        v-model="assetNetworkId"
        :options="networks"
        :label="$t('payment.network')"
        label-prop="name"
        value-prop="pivotId"
        class="mb-4"
        block
      />

      <IrInput
        v-model="address.walletAddress"
        :label="$t('payment.walletAddress')"
        :placeholder="$t('payment.walletAddressPlaceholder')"
        block
        class="mb-6"
      >
        <template #suffix>
          <button type="button" class="payment-paste" @click="pasteAddress">
            {{ $t('payment.paste') }}
          </button>
        </template>
      </IrInput>

      <IrAlert icon="info" color="warning" size="sm" :description="$t('payment.networkWarning')" />

      <IrDivider class="!my-6" />

      <IrCheckbox
        v-model="isDefault"
        :label-left="$t('payment.setDefaultWithdrawal')"
        class="mb-6"
      />

      <IrButton
        type="submit"
        :text="$t('payment.save')"
        :loading="submitting"
        :disabled="!canSubmit"
        block
      />
    </form>
  </IrModal>
</template>

<style>
.payment-tabs {
  display: flex;
  gap: 8px;
  background-color: var(--color-blue-20);
  border: 1px solid var(--color-dark-blue-50);
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 24px;
}

.payment-tabs__tab {
  flex-basis: calc(1 / 3 * 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
  padding: 4px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--color-dark-blue-400);
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.payment-tabs__tab--active {
  color: var(--color-dark-blue-600);
  background-color: #ffffff;
  border-color: var(--color-dark-blue-50);
}

.payment-tabs__tab:disabled {
  cursor: not-allowed;
}

.payment-tabs__tab-badge {
  position: absolute;
  top: 0;
  transform: translate(15px, -100%);
  font-size: 10px;
  color: #ffffff;
  width: 52px;
  height: 16px;
  border-radius: 8px 8px 8px 0;
  background-color: var(--color-blue-900);
}

.payment-paste {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}
</style>
