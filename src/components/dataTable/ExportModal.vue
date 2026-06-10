<script setup>
import { ref } from 'vue'
import { IrModal, IrButton, IrIcon, message } from '@/lib/ui-kit'
import { useI18n } from 'vue-i18n'
import http from '@/services/http.js'

const props = defineProps({
  title: { type: String, default: '' },
  url: { type: String, required: true },
  // params sent with the request (filters, range, etc.)
  params: { type: Object, default: () => ({}) },
  // filename used for the downloaded file
  filename: { type: String, default: 'export.csv' },
  method: { type: String, default: 'get', validator: v => ['get', 'post'].includes(v) },
})

const show = defineModel('show', { type: Boolean, default: false })

const { t } = useI18n()

const submitting = ref(false)

async function download() {
  if (submitting.value) return
  submitting.value = true
  try {
    const config = { responseType: 'blob' }
    const res = props.method === 'post'
      ? await http.post(props.url, props.params, config)
      : await http.get(props.url, { ...config, params: props.params })

    const blob = res instanceof Blob ? res : new Blob([res], { type: 'text/csv' })
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = props.filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(blobUrl)

    show.value = false
  } catch (e) {
    message.error(e?.error || t('common.serverError'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <IrModal v-model:show="show" size="420px" :title="title" :full-screen="false">
    <template #header-prepend>
      <IrIcon name="download" :size="18" class="text-dark-blue-500" />
    </template>

    <p class="text-sm text-dark-blue-300 mb-6" v-text="$t('common.exportEarningsDescription')" />

    <div class="flex flex-col gap-4 mb-6">
      <slot />
    </div>

    <div class="flex justify-end gap-2">
      <IrButton
        :text="$t('common.cancel')"
        variant="text"
        color="secondary"
        @click="show = false"
      />
      <IrButton
        :text="$t('common.downloadCsv')"
        prepend-icon="download"
        :loading="submitting"
        @click="download"
      />
    </div>
  </IrModal>
</template>
